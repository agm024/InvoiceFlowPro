const fs = require('fs');
let client = fs.readFileSync('app/pricing/PricingClient.tsx', 'utf8');

client = client.replace(/export function PricingClient\(\{\s*plans\s*\}\s*:\s*\{\s*plans\s*:\s*any\[\]\s*\}\) \{/, 
`import Script from 'next/script'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export function PricingClient({ plans, user }: { plans: any[], user?: any }) {
  const router = useRouter()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const handleSubscribe = async (planId: string, isAnnual: boolean, price: number) => {
    if (!user) {
      router.push('/sign-up');
      return;
    }
    
    if (price <= 0) {
      toast.error('Free plan cannot be subscribed to manually here');
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
        description: \`Subscription Upgrade\`,
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
            router.push('/app/settings');
            router.refresh();
          } else {
            toast.error('Payment verification failed', { id: 'verify' });
          }
        },
        theme: {
          color: '#2563eb'
        }
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
  }
`);

// Now replace the buttons
// Free plan button
client = client.replace(
  `<Link href="/sign-up" className="block text-center w-full py-3 rounded-xl bg-white text-blue-600 font-bold hover:bg-zinc-50 transition shadow-sm">Start Free Trial</Link>`,
  `<button onClick={() => !user && router.push('/sign-up')} className="block text-center w-full py-3 rounded-xl bg-white text-blue-600 font-bold hover:bg-zinc-50 transition shadow-sm">
    {user ? 'Current Plan' : 'Start Free Trial'}
  </button>`
);

// Paid plan button
client = client.replace(
  `<Link href={price > 30000 ? "/contact" : "/sign-up"} className="block text-center w-full py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition">
                  {price > 30000 ? "Contact Sales" : "Get Started"}
                </Link>`,
  `<button 
                  onClick={() => price > 30000 ? router.push('/contact') : handleSubscribe(plan.id, isAnnual, price)}
                  disabled={loadingPlan === plan.id}
                  className="block text-center w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-hover transition disabled:opacity-50"
                >
                  {loadingPlan === plan.id ? 'Processing...' : (price > 30000 ? "Contact Sales" : "Upgrade Now")}
                </button>`
);

// Add the Script tag to the JSX return
client = client.replace(
  `return (`,
  `return (
      <>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />`
);

client = client.replace(/}\s*$/, `}\n      </>\n    )\n}`);

fs.writeFileSync('app/pricing/PricingClient.tsx', client, 'utf8');
