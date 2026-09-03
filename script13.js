const fs = require('fs');
const path = 'app/(admin)/app/admin/system/emails/actions.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace('import { sendEmail } from "@/app/actions/email"', 'import { sendEmail, wrapInTemplate } from "@/app/actions/email"');

const search = `  // Send the actual email using ZeptoMail
  const result = await sendEmail({
    to: email,
    subject: \`[TEST] \${template.subject}\`,
    html: htmlToSend
  })`;

const replacement = `  // Send the actual email using ZeptoMail
  // Format the raw DB template with our standard styling
  const prettyHtml = htmlToSend.startsWith('<div') 
    ? htmlToSend 
    : wrapInTemplate(\`<div style="color: #52525b; font-size: 16px; line-height: 1.6;">\${htmlToSend.replace(/\\n/g, '<br/>')}</div>\`);

  const result = await sendEmail({
    to: email,
    subject: \`[TEST] \${template.subject}\`,
    html: prettyHtml
  })`;

content = content.replace(search, replacement);

fs.writeFileSync(path, content, 'utf8');
