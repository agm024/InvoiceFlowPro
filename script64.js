const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/actions.ts', 'utf8');

const search = `    const calculatedSubTotal = data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const calculatedTaxTotal = data.items.reduce((sum, item) => sum + item.tax, 0)
    
    let discountAmount = 0
    if (data.discountType === 'FLAT') {
      discountAmount = data.discountValue
    } else if (data.discountType === 'PERCENTAGE') {
      discountAmount = calculatedSubTotal * (data.discountValue / 100)
    }
    
    const totalBeforeRoundOff = calculatedSubTotal - discountAmount + calculatedTaxTotal`;

const replacement = `    const calculatedSubTotal = data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    
    let discountAmount = 0
    if (data.discountType === 'FLAT') {
      discountAmount = data.discountValue
    } else if (data.discountType === 'PERCENTAGE') {
      discountAmount = calculatedSubTotal * (data.discountValue / 100)
    }

    const discountRatio = calculatedSubTotal > 0 ? (discountAmount / calculatedSubTotal) : 0;
    const rawTaxTotal = data.items.reduce((sum, item) => sum + item.tax, 0);
    const calculatedTaxTotal = rawTaxTotal * (1 - discountRatio);
    
    const totalBeforeRoundOff = calculatedSubTotal - discountAmount + calculatedTaxTotal`;

content = content.replace(search, replacement); // Replace in createInvoice
content = content.replace(search, replacement); // Replace in updateInvoice

// Also need to scale the tax saved on the InvoiceItem!
const itemMapSearch = `items: {
            create: data.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              tax: item.tax
            }))
          }`;
const itemMapReplacement = `items: {
            create: data.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              tax: item.tax * (1 - discountRatio)
            }))
          }`;
content = content.replace(itemMapSearch, itemMapReplacement);
content = content.replace(itemMapSearch, itemMapReplacement);

fs.writeFileSync('app/app/invoices/actions.ts', content, 'utf8');
