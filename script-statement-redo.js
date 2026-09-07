const fs = require('fs');
let content = fs.readFileSync('app/statement/[clientId]/page.tsx', 'utf8');

content = content.replace(
  /if \(!client\) notFound\(\)/,
  `if (!client) notFound()\n\n  const subscription = await prisma.subscription.findUnique({ where: { companyId: client.companyId }, include: { plan: true } })\n  const isFree = !subscription || subscription.plan.name === 'FREE'`
);

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

content = content.replace(
  /        \{\/\* Print Button \(hidden when printing\) \*\/\}/,
  `        </div>\n\n        {/* Print Button (hidden when printing) */}`
);

fs.writeFileSync('app/statement/[clientId]/page.tsx', content, 'utf8');
