const fs = require('fs');

const filesToUpdate = [
  'app/app/invoices/[id]/page.tsx',
  'app/pay/[id]/invoice/page.tsx',
  'app/statement/[clientId]/page.tsx'
];

const exactWatermark = `{isFree && (
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
        )}`;

const exactWatermark2 = `{isFree && (
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
          )}`;

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
    
    // Quick and dirty whitespace-agnostic replacement
    const pattern = /\{isFree && \(\s*<div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center overflow-hidden z-0 select-none opacity-\[0\.04\]">\s*\{Array\.from\(\{ length: 6 \}\)\.map\(\(_, i\) => \(\s*<div key=\{i\} className="flex gap-16 whitespace-nowrap -rotate-45 mb-32">\s*\{Array\.from\(\{ length: 4 \}\)\.map\(\(_, j\) => \(\s*<span key=\{j\} className="text-4xl md:text-6xl font-black text-black">\s*CREATED WITH INVOICEFLOWPRO\s*<\/span>\s*\)\)\}\s*<\/div>\s*\)\)\}\s*<\/div>\s*\)\}/;
    
    if (pattern.test(content)) {
      content = content.replace(pattern, professionalWatermark);
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated watermark in ${file}`);
    } else {
      console.log(`Pattern not found in ${file}`);
    }
  }
});
