const fs = require('fs');
const path = 'app/actions/email.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace("export async function sendEmail({", "export async function sendEmail({\n  to,\n  toName,\n  subject,\n  html,\n}: {\n  to: string;\n  toName?: string;\n  subject: string;\n  html: string;\n}) {");

// Remove the old signature
content = content.replace(/export async function sendEmail\(\{\s*to,\s*subject,\s*html,\s*\}\:\s*\{\s*to\: string;\s*subject\: string;\s*html\: string;\s*\}\) \{/, "");

content = content.replace("name: to.split('@')[0] || \"Client\",", "name: toName || to.split('@')[0] || \"Client\",");

fs.writeFileSync(path, content, 'utf8');
