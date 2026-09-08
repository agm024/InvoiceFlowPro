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

  // Pattern 1: landing page Hero & Nav buttons
  content = content.replace(/bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-10 py-5/g, 'bg-primary text-primary-foreground px-10 py-5');
  content = content.replace(/bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-8 py-3\.5/g, 'bg-primary text-primary-foreground px-8 py-3.5');
  content = content.replace(/bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2/g, 'bg-primary text-primary-foreground px-4 py-2');
  
  // Pattern 2: sign-in/sign-up buttons
  content = content.replace(/bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-3/g, 'bg-primary text-primary-foreground px-4 py-3');
  content = content.replace(/hover:bg-zinc-800 dark:hover:bg-white\/90/g, 'hover:bg-primary-hover');

  // Pattern 3: Standard app save buttons
  content = content.replace(/bg-zinc-900 dark:bg-white text-white dark:text-zinc-900/g, 'bg-primary text-primary-foreground');
  content = content.replace(/hover:bg-black dark:hover:bg-zinc-200/g, 'hover:bg-primary-hover');

  // Pattern 4: Other dark buttons
  content = content.replace(/bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 text-white/g, 'bg-primary hover:bg-primary-hover text-primary-foreground');
  content = content.replace(/bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white/g, 'bg-primary text-primary-foreground');
  content = content.replace(/bg-zinc-900 hover:bg-zinc-800 text-white/g, 'bg-primary hover:bg-primary-hover text-primary-foreground');
  content = content.replace(/bg-zinc-900 text-white dark:bg-white dark:text-zinc-900/g, 'bg-primary text-primary-foreground');
  
  // Clean up shadow colors that might have been hardcoded
  content = content.replace(/shadow-zinc-900\/20/g, 'shadow-primary/20');
  content = content.replace(/dark:shadow-white\/10/g, '');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

walk('app', processFile);
walk('components', processFile);
