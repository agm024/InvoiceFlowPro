const fs = require('fs');

let text = fs.readFileSync('app/api/razorpay/webhook/route.ts', 'utf8');
text = text.replace(
    /amount: event\.payload\.payment\.entity\.amount \/ 100,/g,
    `originalAmount: event.payload.payment.entity.amount / 100,\n              convertedAmountInr: event.payload.payment.entity.amount / 100,\n              companyId: companyId,`
);
text = text.replace(
    /currency: event\.payload\.payment\.entity\.currency,/g,
    `originalCurrency: event.payload.payment.entity.currency,`
);
text = text.replace(
    /razorpayPaymentId: event\.payload\.payment\.entity\.id/g,
    `gatewayTransactionId: event.payload.payment.entity.id`
);

fs.writeFileSync('app/api/razorpay/webhook/route.ts', text, 'utf8');

let text2 = fs.readFileSync('app/app/settings/team-actions.ts', 'utf8');
if (!text2.includes("import { checkFeatureLimit }")) {
    text2 = text2.replace(
        "import { requireCompany } from '@/lib/auth-context'",
        "import { requireCompany } from '@/lib/auth-context'\nimport { checkFeatureLimit } from '@/lib/billing'"
    );
    fs.writeFileSync('app/app/settings/team-actions.ts', text2, 'utf8');
}
