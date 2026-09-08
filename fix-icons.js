const fs = require('fs');
let client = fs.readFileSync('app/checkout/[planId]/CheckoutClient.tsx', 'utf8');

client = client.replace(
  "import { Check, CheckCircle2, ChevronDown, CreditCard, Landmark, Smartphone } from 'lucide-react'",
  "import { Check, CheckCircle2, ChevronDown, CreditCard, Landmark, Smartphone, Lock, Receipt, LifeBuoy, ShieldCheck, FileText, RotateCcw, XCircle } from 'lucide-react'"
);

fs.writeFileSync('app/checkout/[planId]/CheckoutClient.tsx', client, 'utf8');
