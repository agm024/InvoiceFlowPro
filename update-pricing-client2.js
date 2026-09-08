const fs = require('fs');
let client = fs.readFileSync('app/pricing/PricingClient.tsx', 'utf8');

client = client.replace(
  `import { useState } from 'react'\nimport Link from 'next/link'`,
  `import { useState } from 'react'\nimport Link from 'next/link'\nimport Script from 'next/script'\nimport { useRouter } from 'next/navigation'\nimport toast from 'react-hot-toast'`
);

client = client.replace(
  `export function PricingClient({ plans }: { plans: any[] }) {`,
  `export function PricingClient({ plans, user }: { plans: any[], user?: any }) {\n  const router = useRouter();\n  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);\n\n  const handleSubscribe = async (planId: string, isAnnual: boolean, price: number) => {\n    if (!user) { router.push('/sign-up'); return; }\n    if (price <= 0) { toast.error('Free plan cannot be subscribed to manually here'); return; }\n    \n    setLoadingPlan(planId);\n    try {\n      const res = await fetch('/api/razorpay/subscription/order', {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify({ planId, isAnnual })\n      });\n      \n      const data = await res.json();\n      if (!res.ok) throw new Error(data.error || 'Failed to create order');\n      \n      const options = {\n        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,\n        amount: data.order.amount,\n        currency: data.order.currency,\n        name: 'InvoiceFlowPro',\n        description: 'Subscription Upgrade',\n        order_id: data.order.id,\n        handler: async function (response: any) {\n          toast.loading('Verifying payment...', { id: 'verify' });\n          const verifyRes = await fetch('/api/razorpay/subscription/verify', {\n            method: 'POST',\n            headers: { 'Content-Type': 'application/json' },\n            body: JSON.stringify({\n              ...response,\n              planId,\n              isAnnual,\n              companyId: data.user.companyId,\n              amount: data.amount,\n              currency: data.order.currency\n            })\n          });\n          \n          if (verifyRes.ok) {\n            toast.success('Subscription activated successfully!', { id: 'verify' });\n            router.push('/app/settings');\n            router.refresh();\n          } else {\n            toast.error('Payment verification failed', { id: 'verify' });\n          }\n        },\n        theme: { color: '#2563eb' }\n      };\n      \n      const rzp = new (window as any).Razorpay(options);\n      rzp.on('payment.failed', function (response: any) {\n        toast.error(response.error.description || 'Payment failed');\n      });\n      rzp.open();\n      \n    } catch (err: any) {\n      toast.error(err.message);\n    } finally {\n      setLoadingPlan(null);\n    }\n  };`
);

client = client.replace(
  `<Link href="/sign-up" className="block text-center w-full py-3 rounded-xl bg-white text-blue-600 font-bold hover:bg-zinc-50 transition shadow-sm">Start Free Trial</Link>`,
  `<button onClick={() => !user && router.push('/sign-up')} className="block text-center w-full py-3 rounded-xl bg-white text-blue-600 font-bold hover:bg-zinc-50 transition shadow-sm">{user ? 'Current Plan' : 'Start Free Trial'}</button>`
);

client = client.replace(
  `<Link href={price > 30000 ? "/contact" : "/sign-up"} className="block text-center w-full py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition">\n                  {price > 30000 ? "Contact Sales" : "Get Started"}\n                </Link>`,
  `<button onClick={() => price > 30000 ? router.push('/contact') : handleSubscribe(plan.id, isAnnual, price)} disabled={loadingPlan === plan.id} className="block text-center w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-hover transition disabled:opacity-50">{loadingPlan === plan.id ? 'Processing...' : (price > 30000 ? "Contact Sales" : "Upgrade Now")}</button>`
);

client = client.replace(
  `return (\n    <div className="w-full max-w-6xl mx-auto">`,
  `return (\n    <>\n      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />\n      <div className="w-full max-w-6xl mx-auto">`
);

client = client.replace(
  `</div>\n  )\n}`,
  `</div>\n    </>\n  )\n}`
);

fs.writeFileSync('app/pricing/PricingClient.tsx', client, 'utf8');
