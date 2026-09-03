const fs = require('fs');
const path = 'app/actions/email.ts';
let content = fs.readFileSync(path, 'utf8');

const search = `export async function sendEmail({
  to,
  toName,
  subject,
  html,
}: {
  to: string;
  toName?: string;
  subject: string;
  html: string;
}) {
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {`;

const replacement = `export async function sendEmail({
  to,
  toName,
  subject,
  html,
}: {
  to: string;
  toName?: string;
  subject: string;
  html: string;
}) {`;

content = content.replace(search, replacement);

fs.writeFileSync(path, content, 'utf8');
