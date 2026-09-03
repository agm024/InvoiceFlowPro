const fs = require('fs');
const path = 'app/actions/email.ts';
let content = fs.readFileSync(path, 'utf8');

const index = content.indexOf('export function wrapInTemplate(htmlContent: string) {');
if (index !== -1) {
    content = content.substring(0, index);
    fs.writeFileSync(path, content, 'utf8');
}
