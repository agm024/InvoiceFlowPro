const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/[id]/page.tsx', 'utf8');

// Add subscription check
const searchFetch = `const companySettings = await getCompanySettings()`;
const replaceFetch = `const companySettings = await getCompanySettings()\n  const prisma = (await import('@/utils/prisma')).default\n  const subscription = await prisma.subscription.findUnique({ where: { companyId: invoice.companyId } })\n  const isFree = !subscription || subscription.plan === 'FREE'`;
content = content.replace(searchFetch, replaceFetch);

// Make #invoice-content relative if it's not
if (!content.includes('id="invoice-content" className="bg-white text-black rounded-xl shadow-sm overflow-hidden border border-zinc-200 relative')) {
  content = content.replace(
    /id="invoice-content" className="bg-white text-black rounded-xl shadow-sm overflow-hidden border border-zinc-200 print:border-none print:shadow-none"/,
    `id="invoice-content" className="bg-white text-black rounded-xl shadow-sm overflow-hidden border border-zinc-200 relative print:border-none print:shadow-none"`
  );
}

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
fs.writeFileSync('app/app/invoices/[id]/page.tsx', content, 'utf8');
