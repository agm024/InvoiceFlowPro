const fs = require('fs');

const filesToUpdate = [
  'app/app/invoices/[id]/page.tsx',
  'app/pay/[id]/invoice/page.tsx',
  'app/statement/[clientId]/page.tsx'
];

const currentWatermark = `<span className="text-zinc-300 font-bold text-2xl tracking-[0.4em] uppercase mt-3">Free License</span>`;
const newSubtitle = `<span className="text-zinc-300 font-bold text-xl tracking-[0.3em] uppercase mt-3">Invoicing Software</span>`;

filesToUpdate.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes(currentWatermark)) {
      content = content.replace(currentWatermark, newSubtitle);
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated watermark in ${file}`);
    } else {
      console.log(`String not found in ${file}`);
    }
  }
});
