const fs = require('fs');
let content = fs.readFileSync('app/pay/[id]/invoice/page.tsx', 'utf8');

// Fetch subscription
const searchFetch = `let companySettings = await prisma.companySettings.findUnique({`;
const replaceFetch = `const subscription = await prisma.subscription.findUnique({ where: { companyId: invoice.companyId } })\n  const isFree = !subscription || subscription.plan === 'FREE'\n\n  let companySettings = await prisma.companySettings.findUnique({`;
content = content.replace(searchFetch, replaceFetch);

// Make relative
content = content.replace(
  /id="invoice-content" className="bg-white text-black rounded-xl shadow-sm overflow-hidden border border-zinc-200 print:border-none print:shadow-none"/,
  `id="invoice-content" className="bg-white text-black rounded-xl shadow-sm overflow-hidden border border-zinc-200 relative print:border-none print:shadow-none"`
);

// Add watermark
const searchWatermark = `<div className="p-10 md:p-14">`;
const replaceWatermark = `{isFree && (
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
        )}
        <div className="p-10 md:p-14 relative z-10">`;

content = content.replace(searchWatermark, replaceWatermark);
fs.writeFileSync('app/pay/[id]/invoice/page.tsx', content, 'utf8');
