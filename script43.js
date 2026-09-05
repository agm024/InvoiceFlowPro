const fs = require('fs');
let content = fs.readFileSync('app/app/settings/page.tsx', 'utf8');

const search = `  const subscription = await prisma.subscription.findUnique({
    where: { companyId }
  })`;

const replacement = `  const companyFull = await prisma.company.findUnique({
    where: { id: companyId },
    include: { subscription: { include: { plan: true } } }
  })
  let isUserLimitReached = false;
  if (companyFull?.subscription?.plan?.userLimits) {
    if ((users.length + invitations.length) >= companyFull.subscription.plan.userLimits) {
      isUserLimitReached = true;
    }
  }

  const subscription = await prisma.subscription.findUnique({
    where: { companyId }
  })`;

content = content.replace(search, replacement);

const searchSettingsTabs = `<SettingsTabs 
        initialTab={initialTab}
        settings={settings}
        banks={banks}
        exchangeRates={exchangeRates}
        internalTransfers={internalTransfers}
        roles={roles}
        users={users}
        invitations={invitations}
        supportAccessGranted={company?.supportAccessGranted || false}
        subscription={subscription}
        currentUser={currentUser}
      />`;

const replacementSettingsTabs = `<SettingsTabs 
        initialTab={initialTab}
        settings={settings}
        banks={banks}
        exchangeRates={exchangeRates}
        internalTransfers={internalTransfers}
        roles={roles}
        users={users}
        invitations={invitations}
        supportAccessGranted={company?.supportAccessGranted || false}
        subscription={subscription}
        currentUser={currentUser}
        isUserLimitReached={isUserLimitReached}
      />`;

content = content.replace(searchSettingsTabs, replacementSettingsTabs);
fs.writeFileSync('app/app/settings/page.tsx', content, 'utf8');
