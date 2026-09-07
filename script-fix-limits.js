const fs = require('fs');
const files = [
    'app/app/invoices/actions.ts',
    'app/app/clients/actions.ts',
    'app/app/estimates/actions.ts'
];
files.forEach(f => {
    if (!fs.existsSync(f)) return;
    let text = fs.readFileSync(f, 'utf8');
    text = text.replace(/\/\/\s*return\s*\{\s*error:\s*\.\.\.\s*\}\s*\/\/\s*Unlimited[a-zA-Z0-9\s!]+/g, 'return { error: `You have reached your limit. Please upgrade your plan.` }');
    fs.writeFileSync(f, text, 'utf8');
});
