const fs = require('fs');

let invoicePdfPage = fs.readFileSync('app/pay/[id]/invoice/page.tsx', 'utf8');

const targetBlock = `{invoice.taxTotal > 0 && invoice.invoiceType === 'REGULAR' && (
                  <div className="flex justify-between py-2 text-sm">
                    <span className="font-semibold text-zinc-600">Total Tax</span>
                    <span className="font-bold">{getCurrencySymbol(invoice.currency)} {invoice.taxTotal.toFixed(2)}</span>
                  </div>
                )}`;

const newBlock = `{invoice.taxTotal > 0 && invoice.invoiceType === 'REGULAR' && (
                  (() => {
                    const companyGstPrefix = companySettings?.gstin?.substring(0,2) || companySettings?.stateCode || '27';
                    const clientGstPrefix = invoice.client?.gstin?.substring(0,2) || invoice.client?.stateCode || '27';
                    const isIntraState = companyGstPrefix === clientGstPrefix;
                    
                    if (isIntraState) {
                       return (
                         <>
                           <div className="flex justify-between py-2 text-sm">
                             <span className="font-semibold text-zinc-600">CGST</span>
                             <span className="font-bold">{getCurrencySymbol(invoice.currency)} {(invoice.taxTotal / 2).toFixed(2)}</span>
                           </div>
                           <div className="flex justify-between py-2 text-sm">
                             <span className="font-semibold text-zinc-600">SGST</span>
                             <span className="font-bold">{getCurrencySymbol(invoice.currency)} {(invoice.taxTotal / 2).toFixed(2)}</span>
                           </div>
                         </>
                       );
                    } else {
                       return (
                         <div className="flex justify-between py-2 text-sm">
                           <span className="font-semibold text-zinc-600">IGST</span>
                           <span className="font-bold">{getCurrencySymbol(invoice.currency)} {invoice.taxTotal.toFixed(2)}</span>
                         </div>
                       );
                    }
                  })()
                )}`;

if (invoicePdfPage.includes('<span className="font-semibold text-zinc-600">Total Tax</span>')) {
   invoicePdfPage = invoicePdfPage.replace(targetBlock, newBlock);
   fs.writeFileSync('app/pay/[id]/invoice/page.tsx', invoicePdfPage, 'utf8');
   console.log("Updated Tax block in PDF view");
} else {
   console.log("Could not find the target block.");
}

