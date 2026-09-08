const fs = require('fs');
let orderRoute = fs.readFileSync('app/api/razorpay/subscription/order/route.ts', 'utf8');

orderRoute = orderRoute.replace(/import \{ cookies \} from 'next\/headers'/, "import { getCurrentUser } from '@/lib/auth-context'");
orderRoute = orderRoute.replace(/const companyId = req\.headers[\s\S]*?const user = \{ companyId \};/, `const currentUser = await getCurrentUser();\n    const user = { companyId: currentUser.companyId };`);

fs.writeFileSync('app/api/razorpay/subscription/order/route.ts', orderRoute, 'utf8');
console.log('Fixed API auth to use getCurrentUser');
