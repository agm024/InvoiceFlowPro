const fs = require('fs');
let client = fs.readFileSync('app/app/billing/BillingClient.tsx', 'utf8').replace(/\r\n/g, '\n');

const targetFunctionSig = "export default function BillingClient({ plans, subscription }: { plans: any[], subscription: any }) {\n  const [isAnnual, setIsAnnual] = useState(true)\n  const [isPending, startTransition] = useTransition()";

const newFunctionSig = `export default function BillingClient({ plans, subscription }: { plans: any[], subscription: any }) {
  const router = useRouter()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [isAnnual, setIsAnnual] = useState(true)
  const [isPending, startTransition] = useTransition()
  
  const handleSubscribe = async (planId: string, isAnnual: boolean, price: number) => {
    if (price <= 0) {
      toast.error('Free plan is automatically applied');
      return;
    }
    setLoadingPlan(planId);
    try {
      const res = await fetch('/api/razorpay/subscription/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, isAnnual })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create order');
      
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'InvoiceFlowPro',
        description: 'Subscription Upgrade',
        order_id: data.order.id,
        handler: async function (response: any) {
          toast.loading('Verifying payment...', { id: 'verify' });
          const verifyRes = await fetch('/api/razorpay/subscription/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...response,
              planId,
              isAnnual,
              companyId: data.user.companyId,
              amount: data.amount,
              currency: data.order.currency
            })
          });
          
          if (verifyRes.ok) {
            toast.success('Subscription activated successfully!', { id: 'verify' });
            router.refresh();
          } else {
            toast.error('Payment verification failed', { id: 'verify' });
          }
        },
        theme: { color: '#2563eb' }
      };
      
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast.error(response.error.description || 'Payment failed');
      });
      rzp.open();
      
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoadingPlan(null);
    }
  };`;

client = client.replace(targetFunctionSig, newFunctionSig);

client = client.replace(
  /onClick=\{\(\) => \{\s*startTransition\(async \(\) => \{\s*await createCheckoutSession\(plan\.id, isAnnual \? 'year' : 'month'\);\s*\}\)\s*\}\}/g,
  `onClick={() => handleSubscribe(plan.id, isAnnual, isAnnual ? plan.yearlyPrice : plan.monthlyPrice)}`
);

client = client.replace(
  /disabled=\{isPending \|\| /g,
  `disabled={loadingPlan === plan.id || `
);

client = client.replace(
  /\{isPending \? 'Processing\.\.\.' : isCurrentPlan/g,
  `{loadingPlan === plan.id ? 'Processing...' : isCurrentPlan`
);

client = client.replace(
  /return \(\n    <div className="dark:text-white">/,
  `return (\n    <>\n      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />\n      <div className="dark:text-white">`
);

client = client.replace(
  /<\/div>\n  \)$/,
  `</div>\n    </>\n  )`
);

fs.writeFileSync('app/app/billing/BillingClient.tsx', client, 'utf8');
