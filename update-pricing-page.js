const fs = require('fs');

let page = fs.readFileSync('app/pricing/page.tsx', 'utf8');

// add user import
page = page.replace('import { PricingClient } from \'./PricingClient\'', `import { PricingClient } from './PricingClient'\nimport { cookies } from 'next/headers'`);

page = page.replace('const plans = await prisma.plan.findMany({', `const token = (await cookies()).get('auth_token')?.value
  let user = null
  if (token) {
    user = await prisma.user.findFirst({
      where: { sessions: { some: { token } } }
    })
  }
  
  const plans = await prisma.plan.findMany({`);

page = page.replace('<PricingClient plans={plans} />', '<PricingClient plans={plans} user={user} />');

fs.writeFileSync('app/pricing/page.tsx', page, 'utf8');
