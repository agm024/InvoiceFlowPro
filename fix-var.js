const fs = require('fs');
let widget = fs.readFileSync('app/app/OnboardingWidget.tsx', 'utf8');

widget = widget.replace(
  /if \(stepsCompleted === totalSteps\) return null; \/\/ Fully completed\s*\n\s*const stepsCompleted = 1 \+ \(hasBusinessInfo \? 1 : 0\) \+ \(hasGst \? 1 : 0\) \+ \(hasClient \? 1 : 0\) \+ \(hasInvoice \? 1 : 0\);\s*\n\s*const totalSteps = 5;/,
  `const stepsCompleted = 1 + (hasBusinessInfo ? 1 : 0) + (hasGst ? 1 : 0) + (hasClient ? 1 : 0) + (hasInvoice ? 1 : 0);\n  const totalSteps = 5;\n\n  if (stepsCompleted === totalSteps) return null; // Fully completed`
);

fs.writeFileSync('app/app/OnboardingWidget.tsx', widget, 'utf8');
