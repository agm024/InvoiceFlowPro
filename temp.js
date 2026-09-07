const fs = require('fs');

let text = fs.readFileSync('app/app/estimates/actions.ts', 'utf8');

// There's a trailing } somewhere. Let's just fix it by replacing the whole getEstimateFormData function if needed, or just let regex remove the `} }` that is causing issues.
text = text.replace(/isLimitReached = true;\n  }\n\n  return/g, "isLimitReached = true;\n  }\n\n  return");
// Wait, the error is at line 87. Let's see the context.
