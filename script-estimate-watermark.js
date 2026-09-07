const fs = require('fs');
let content = fs.readFileSync('app/app/estimates/[id]/page.tsx', 'utf8');

// Fetch subscription
content = content.replace(
  /if \(!estimate\) notFound\(\)/,
  `if (!estimate) notFound()\n\n  const subscription = await prisma.subscription.findUnique({ where: { companyId: estimate.companyId }, include: { plan: true } })\n  const isFree = !subscription || subscription.plan.name === 'FREE'`
);

// Relative positioning
content = content.replace(
  /<div className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-card-border overflow-hidden p-8 md:p-12">/,
  `<div className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-card-border overflow-hidden p-8 md:p-12 relative">`
);

// Add watermark
content = content.replace(
  /<div className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-card-border overflow-hidden p-8 md:p-12 relative">/,
  `<div className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-card-border overflow-hidden p-8 md:p-12 relative">\n        {isFree && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center overflow-hidden z-0 select-none opacity-[0.04]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-16 whitespace-nowrap -rotate-45 mb-32">
                {Array.from({ length: 4 }).map((_, j) => (
                  <span key={j} className="text-4xl md:text-6xl font-black text-black dark:text-white">
                    CREATED WITH INVOICEFLOWPRO
                  </span>
                ))}
              </div>
            ))}
          </div>
        )}\n        <div className="relative z-10">`
);

// We need to close the `<div className="relative z-10">` at the end
// Find the last </div> before the final closing tag
content = content.replace(
  /        <\/div>\n      <\/div>\n    <\/div>\n  \)\n\}\n$/,
  `        </div>\n        </div>\n      </div>\n    </div>\n  )\n}\n`
);

fs.writeFileSync('app/app/estimates/[id]/page.tsx', content, 'utf8');
