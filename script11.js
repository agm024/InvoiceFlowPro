const fs = require('fs');
const path = 'app/sign-up/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const search = `const res = await sendOtpAction(formData.email)`;
const replacement = `const res = await sendOtpAction(formData.email, formData.name)`;

content = content.replace(search, replacement);

fs.writeFileSync(path, content, 'utf8');
