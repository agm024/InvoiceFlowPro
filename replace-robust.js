const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walk(dirPath, callback);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      callback(dirPath);
    }
  });
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  content = content.replace(/className=(["`])(.*?)\1/g, (match, quote, classes) => {
    if ((classes.includes('bg-zinc-900') || classes.includes('bg-black')) && (classes.includes('text-white') || classes.includes('dark:text-zinc-900') || classes.includes('dark:bg-white'))) {
      
      if (classes.includes('bg-white') && !classes.includes('dark:bg-white') && classes.includes('border-zinc-200')) {
         return match;
      }

      let newClasses = classes
        .replace(/\bbg-zinc-900\b/g, 'bg-primary')
        .replace(/\bbg-black\b/g, 'bg-primary')
        .replace(/\bdark:bg-white\b/g, '')
        .replace(/\bdark:bg-zinc-100\b/g, '')
        .replace(/\bdark:bg-black\b/g, '')
        .replace(/\btext-white\b/g, 'text-primary-foreground')
        .replace(/\bdark:text-zinc-900\b/g, '')
        .replace(/\bhover:bg-zinc-800\b/g, 'hover:bg-primary-hover')
        .replace(/\bhover:bg-black\b/g, 'hover:bg-primary-hover')
        .replace(/\bdark:hover:bg-zinc-200\b/g, '')
        .replace(/\bdark:hover:bg-white\/90\b/g, '')
        .replace(/\bshadow-zinc-900\/20\b/g, 'shadow-primary/20')
        .replace(/\bdark:shadow-white\/10\b/g, '')
        .replace(/\s+/g, ' ').trim(); 
      
      return `className=${quote}${newClasses}${quote}`;
    }
    return match;
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

walk('app', processFile);
walk('components', processFile);

