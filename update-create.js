const fs = require('fs');

let route = fs.readFileSync('app/api/subscriptions/create/route.ts', 'utf8');

route = route.replace(
  /const rzpCustomer: any = await instance\.customers\.create\(\{[\s\S]*?\}\);/,
  `const company = await prisma.company.findUnique({ where: { id: user.companyId } });
    let rzpCustomerId = company?.rzpCustomerId;

    if (!rzpCustomerId) {
      const rzpCustomer: any = await instance.customers.create({
        name: currentUser.name || (currentUser.email || 'guest@example.com').split('@')[0],
        email: currentUser.email || 'guest@example.com',
        contact: '9999999999',
        fail_existing: 0
      });
      rzpCustomerId = rzpCustomer.id;
      await prisma.company.update({
        where: { id: user.companyId },
        data: { rzpCustomerId }
      });
    }`
);

fs.writeFileSync('app/api/subscriptions/create/route.ts', route, 'utf8');
