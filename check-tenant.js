const fs = require('fs');
const path = require('path');

let findings = [];
function checkFile(filePath) {
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
        const content = fs.readFileSync(filePath, 'utf8');
        // Find prisma.*.findUnique or findFirst without companyId
        if (content.match(/prisma\.[a-zA-Z]+\.find(?:Unique|First)\(\s*\{\s*where:\s*\{\s*id:\s*[a-zA-Z0-9_]+\s*(?:,\s*)?\}\s*\}/g)) {
            findings.push(filePath);
        }
    }
}

function walkDir(dir) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        if (fs.statSync(dirPath).isDirectory()) {
            if (!dirPath.includes('node_modules') && !dirPath.includes('.git') && !dirPath.includes('.next')) walkDir(dirPath);
        } else {
            checkFile(dirPath);
        }
    });
}
walkDir('app/app');
console.log(findings.join('\n'));
