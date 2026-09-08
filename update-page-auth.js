const fs = require('fs');

let page = fs.readFileSync('app/page.tsx', 'utf8');

const target = `<Link href="/sign-in" className="inline-flex items-center justify-center px-8 py-3.5 rounded-full font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                Sign In
              </Link>`;
const replacement = `{!session && (
                <Link href="/sign-in" className="inline-flex items-center justify-center px-8 py-3.5 rounded-full font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Sign In
                </Link>
              )}`;

page = page.replace(target, replacement);

fs.writeFileSync('app/page.tsx', page, 'utf8');

