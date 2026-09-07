const fs = require('fs');
let content = fs.readFileSync('app/statement/[clientId]/page.tsx', 'utf8');

content = content.replace(
  /if \(!client\) notFound\(\)/,
  `if (!client) notFound()\n\n  const subscription = await prisma.subscription.findUnique({ where: { companyId: client.companyId }, include: { plan: true } })\n  const isFree = !subscription || subscription.plan.name === 'FREE'`
);

// find main card: <div id="statement-content" className="bg-white text-black rounded-xl shadow-sm border border-zinc-200 overflow-hidden relative print:border-none print:shadow-none">
if (!content.includes('id="statement-content"')) {
    // maybe it's just <div className="bg-white text-black rounded-xl shadow-sm border border-zinc-200 overflow-hidden print:border-none print:shadow-none">
    content = content.replace(
      /className="bg-white text-black rounded-xl shadow-sm border border-zinc-200 overflow-hidden print:border-none print:shadow-none"/,
      `className="bg-white text-black rounded-xl shadow-sm border border-zinc-200 overflow-hidden print:border-none print:shadow-none relative"`
    );
}

// Add watermark
content = content.replace(
  /<div className="p-10 md:p-14">/g,
  `{isFree && (
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
        )}\n        <div className="p-10 md:p-14 relative z-10">`
);

fs.writeFileSync('app/statement/[clientId]/page.tsx', content, 'utf8');
