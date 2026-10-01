const fs = require('fs');
const path = 'app/app/clients/[slug]/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const helper = `import { format } from 'date-fns'

// Format dates strictly in IST (Asia/Kolkata) to avoid Vercel UTC shifts
function formatIST(dateInput: Date | string | number | undefined, formatStr: string) {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  const offsetDiff = (330 + new Date().getTimezoneOffset()) * 60 * 1000;
  const targetTime = date.getTime() + offsetDiff;
  return format(new Date(targetTime), formatStr);
}`;

content = content.replace("import { format } from 'date-fns'", helper);
content = content.replaceAll("format(new Date(log.createdAt)", "formatIST(log.createdAt");

fs.writeFileSync(path, content);
