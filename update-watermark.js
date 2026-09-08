const fs = require('fs');

const filesToUpdate = [
  'app/app/invoices/[id]/page.tsx',
  'app/pay/[id]/invoice/page.tsx',
  'app/statement/[clientId]/page.tsx'
];

const targetPattern = /\{isFree && \([\s\S]*?CREATED WITH INVOICEFLOWPRO[\s\S]*?\}\)/;

const professionalWatermark = `{isFree && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0 select-none overflow-hidden">
               <div className="border-[8px] border-zinc-100 rounded-[2rem] px-16 py-8 -rotate-[25deg] flex flex-col items-center justify-center opacity-70">
                  <span className="text-zinc-200 font-black text-6xl tracking-widest uppercase">InvoiceFlow<span className="text-zinc-100">Pro</span></span>
                  <span className="text-zinc-300 font-bold text-2xl tracking-[0.4em] uppercase mt-3">Free License</span>
               </div>
            </div>
          )}`;

filesToUpdate.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (targetPattern.test(content)) {
      content = content.replace(targetPattern, professionalWatermark);
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated watermark in ${file}`);
    } else {
      console.log(`Pattern not found in ${file}`);
    }
  }
});
