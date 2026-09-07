const fs = require('fs');

function removeLimit(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace the limit reached logic to always be false
  content = content.replace(
    /if \(currentCount >= company\.subscription\.plan\.(invoiceLimits|clientLimits)\) \{\s*isLimitReached = true;\s*\}/g,
    `if (currentCount >= company.subscription.plan.$1) {\n      isLimitReached = false; // Unlimited!\n    }`
  );
  
  content = content.replace(
    /if \(currentCount >= company\.subscription\.plan\.(invoiceLimits|clientLimits)\) \{\s*return \{ error: `You have reached your limit[\s\S]*?` \}\s*\}/g,
    `if (currentCount >= company.subscription.plan.$1) {\n      // Unlimited!\n    }`
  );
  
  // For clients specifically
  content = content.replace(
    /if \(currentClientCount >= company\.subscription\.plan\.clientLimits\) \{\s*return \{ error: `You have reached your limit[\s\S]*?` \}\s*\}/g,
    `if (currentClientCount >= company.subscription.plan.clientLimits) {\n      // Unlimited!\n    }`
  );
  fs.writeFileSync(file, content, 'utf8');
}

try { removeLimit('app/app/estimates/page.tsx'); } catch(e){}
try { removeLimit('app/app/estimates/actions.ts'); } catch(e){}
try { removeLimit('app/app/clients/page.tsx'); } catch(e){}
try { removeLimit('app/app/clients/actions.ts'); } catch(e){}
