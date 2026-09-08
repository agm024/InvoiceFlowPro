const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            if (!dirPath.includes('node_modules') && !dirPath.includes('.git') && !dirPath.includes('.next')) {
                walkDir(dirPath, callback);
            }
        } else {
            if (dirPath.endsWith('.tsx') || dirPath.endsWith('.ts')) {
                callback(path.join(dirPath));
            }
        }
    });
}

walkDir('.', function(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Unify to dd MMM yyyy
    content = content.replace(/'MMM dd, yyyy'/g, "'dd MMM yyyy'");
    content = content.replace(/'MMMM dd, yyyy'/g, "'dd MMM yyyy'");
    content = content.replace(/'dd-MMM-yyyy'/g, "'dd MMM yyyy'");
    content = content.replace(/"MMM dd, yyyy 'at' hh:mm a"/g, "'dd MMM yyyy, hh:mm a'");
    content = content.replace(/'MMM dd, hh:mm a'/g, "'dd MMM yyyy, hh:mm a'");
    content = content.replace(/'MMM dd'/g, "'dd MMM'");

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
});
