const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/new/InvoiceForm.tsx', 'utf8');

// Insert useEffect for modal scroll lock
const search = `  const [enableRoundOff, setEnableRoundOff] = useState(existingInvoice ? existingInvoice.roundOff !== 0 : true)`;
const replace = `  const [enableRoundOff, setEnableRoundOff] = useState(existingInvoice ? existingInvoice.roundOff !== 0 : true)

  useEffect(() => {
    if (isProductModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isProductModalOpen]);`;

content = content.replace(search, replace);
fs.writeFileSync('app/app/invoices/new/InvoiceForm.tsx', content, 'utf8');
