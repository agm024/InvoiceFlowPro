const fs = require('fs');
let content = fs.readFileSync('app/statement/[clientId]/page.tsx', 'utf8');

// Undo the previous mistake if any (there shouldn't be since p-10 didn't exist)
content = content.replace(
  /<div id="statement-content" className="max-w-4xl mx-auto bg-white p-4 md:p-8">/,
  `<div id="statement-content" className="max-w-4xl mx-auto bg-white p-4 md:p-8 relative">\n        {isFree && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center overflow-hidden z-0 select-none opacity-[0.04]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-16 whitespace-nowrap -rotate-45 mb-32">
                {Array.from({ length: 4 }).map((_, j) => (
                  <span key={j} className="text-4xl md:text-6xl font-black text-black">
                    CREATED WITH INVOICEFLOWPRO
                  </span>
                ))}
              </div>
            ))}
          </div>
        )}\n        <div className="relative z-10">`
);

// We need to close <div className="relative z-10"> at the end
content = content.replace(
  /        <\/div>\n      <\/div>\n    <\/div>\n  \)\n\}\n$/,
  `        </div>\n        </div>\n      </div>\n    </div>\n  )\n}\n`
);

fs.writeFileSync('app/statement/[clientId]/page.tsx', content, 'utf8');
