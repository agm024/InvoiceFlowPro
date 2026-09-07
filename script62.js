const fs = require('fs');

// Fix BUG-001: Webhook signature bypass
let webhook = fs.readFileSync('app/api/razorpay/webhook/route.ts', 'utf8');
webhook = webhook.replace(
  `} else if (signature) {\n      const expectedSignature`,
  `} else {\n      if (!signature) { return NextResponse.json({ error: 'Missing signature' }, { status: 401 }) }\n      const expectedSignature`
);
fs.writeFileSync('app/api/razorpay/webhook/route.ts', webhook, 'utf8');

// Fix BUG-004: Delete Account Action
let profileActions = fs.readFileSync('app/app/settings/profile-actions.ts', 'utf8');
profileActions = profileActions.replace(
  `const { user, companyId } = await requireCompany()`,
  `const { user, companyId } = await requireCompany()\n  if (user.role !== 'owner') return { error: 'Only the company owner can delete the account' }`
);
fs.writeFileSync('app/app/settings/profile-actions.ts', profileActions, 'utf8');

// Fix BUG-003: Remove team member
let teamActions = fs.readFileSync('app/app/settings/team-actions.ts', 'utf8');
teamActions = teamActions.replace(
  `await prisma.user.update({\n      where: { id, companyId },\n      data: { customRoleId: null, role: 'member' }\n    })`,
  `await prisma.user.delete({\n      where: { id, companyId }\n    })`
);
teamActions = teamActions.replace(
  `await prisma.user.update({\r\n      where: { id, companyId },\r\n      data: { customRoleId: null, role: 'member' }\r\n    })`,
  `await prisma.user.delete({\n      where: { id, companyId }\n    })`
);
fs.writeFileSync('app/app/settings/team-actions.ts', teamActions, 'utf8');
