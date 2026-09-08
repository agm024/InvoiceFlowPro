const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/new/InvoiceForm.tsx', 'utf8');

const targetBlock = `{invoiceType === 'REGULAR' && (
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-zinc-500 text-sm font-medium">Tax</span>
                    <span className="font-medium text-sm">{currency} {taxTotal.toFixed(2)}</span>
                  </div>
                )}`;

const newBlock = `{invoiceType === 'REGULAR' && (
                  (() => {
                    const companyGstPrefix = companySettings?.gstin?.substring(0,2) || companySettings?.stateCode || '27';
                    const clientGstPrefix = selectedClientData?.gstin?.substring(0,2) || selectedClientData?.stateCode || '27';
                    const isIntraState = companyGstPrefix === clientGstPrefix;
                    
                    if (isIntraState) {
                       return (
                         <>
                           <div className="flex justify-between items-center mb-3">
                             <span className="text-zinc-500 text-sm font-medium">CGST</span>
                             <span className="font-medium text-sm">{currency} {(taxTotal / 2).toFixed(2)}</span>
                           </div>
                           <div className="flex justify-between items-center mb-3">
                             <span className="text-zinc-500 text-sm font-medium">SGST</span>
                             <span className="font-medium text-sm">{currency} {(taxTotal / 2).toFixed(2)}</span>
                           </div>
                         </>
                       );
                    } else {
                       return (
                         <div className="flex justify-between items-center mb-3">
                           <span className="text-zinc-500 text-sm font-medium">IGST</span>
                           <span className="font-medium text-sm">{currency} {taxTotal.toFixed(2)}</span>
                         </div>
                       );
                    }
                  })()
                )}`;

if (content.includes('text-zinc-500 text-sm font-medium">Tax</span>')) {
   content = content.replace(targetBlock, newBlock);
   fs.writeFileSync('app/app/invoices/new/InvoiceForm.tsx', content, 'utf8');
   console.log("Updated Tax block in InvoiceForm");
} else {
   console.log("Could not find the target block.");
}
