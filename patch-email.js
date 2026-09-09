const fs = require('fs');
let code = fs.readFileSync('app/actions/email.ts', 'utf8');

const importStatement = `import { checkRateLimit } from '@/lib/rate-limit'\n`;
code = code.replace(/'use server'/, `'use server'\n\n${importStatement}`);

code = code.replace(/export async function sendEmail\(\{/, `export async function sendEmail({\n  to,\n  toName,\n  subject,\n  html,\n}: {\n  to: string;\n  toName?: string;\n  subject: string;\n  html: string;\n}) {\n  const rl = await checkRateLimit('send-email', 10, 60 * 1000); // Max 10 emails per minute\n  if (!rl.success) return { success: false, error: \`Rate limit exceeded. Try again later.\` };\n\n  if (!client) {\n    console.warn("ZeptoMail client not initialized (missing token)");\n    return { success: false, error: "Email configuration missing" };\n  }`);

// I need to carefully replace the exact signature of sendEmail.
// Instead of replacing the export, I'll just find the first brace inside it.

let newCode = fs.readFileSync('app/actions/email.ts', 'utf8');
newCode = newCode.replace(/'use server'/, `'use server'\n\nimport { checkRateLimit } from '@/lib/rate-limit'\n`);
newCode = newCode.replace(/export async function sendEmail\(.*?\) \{/s, `$&
  const rl = await checkRateLimit('send-email', 20, 60 * 1000);
  if (!rl.success) return { success: false, error: "Rate limit exceeded. Try again later." };
`);

fs.writeFileSync('app/actions/email.ts', newCode, 'utf8');
