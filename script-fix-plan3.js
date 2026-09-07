const fs = require('fs');

function fixPlan(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /subscription\.plan\.name === 'FREE'/g,
    `subscription.plan.name.toLowerCase() === 'free'`
  );
  fs.writeFileSync(file, content, 'utf8');
}

fixPlan('app/app/invoices/[id]/page.tsx');
fixPlan('app/pay/[id]/invoice/page.tsx');
fixPlan('app/app/estimates/[id]/page.tsx');
fixPlan('app/statement/[clientId]/page.tsx');
