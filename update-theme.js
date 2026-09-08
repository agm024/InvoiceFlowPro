const fs = require('fs');

let css = fs.readFileSync('app/globals.css', 'utf8');

css = css.replace('--primary: #4f46e5;', '--primary: #2563eb;');
css = css.replace('--primary-hover: #4338ca;', '--primary-hover: #1d4ed8;');
css = css.replace('--accent: #eef2ff;', '--accent: #eff6ff;'); // blue-50 instead of indigo-50
css = css.replace('--accent-foreground: #4f46e5;', '--accent-foreground: #2563eb;');
css = css.replace('rgba(79, 70, 229, 0.2)', 'rgba(37, 99, 235, 0.2)');

fs.writeFileSync('app/globals.css', css, 'utf8');

