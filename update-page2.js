const fs = require('fs');

let page = fs.readFileSync('app/page.tsx', 'utf8');

// Fix Sign In visibility
page = page.replace(
  /<Link href="\/sign-in" className="inline-flex items-center justify-center px-8 py-3\.5 rounded-full font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">\s*Sign In\s*<\/Link>/,
  `{!session && (
                <Link href="/sign-in" className="inline-flex items-center justify-center px-8 py-3.5 rounded-full font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Sign In
                </Link>
              )}`
);

// Fix currency in mock screen
page = page.replace(/\$1,250\.00/g, '₹1,250.00');
page = page.replace(/\$850\.00/g, '₹850.00');
page = page.replace(/\$3,450\.00/g, '₹3,450.00');
page = page.replace(/\$400\.00/g, '₹400.00');

fs.writeFileSync('app/page.tsx', page, 'utf8');
