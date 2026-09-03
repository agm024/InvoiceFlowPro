const fs = require('fs');
const path = 'app/app/invoices/[id]/InvoiceActionsDropdown.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add import
content = content.replace("import { toast } from 'react-hot-toast'", "import { toast } from 'react-hot-toast'\nimport ConfirmationModal from '@/components/ConfirmationModal'");

// Add modalState
content = content.replace("const [isSendingInvoice, setIsSendingInvoice] = useState(false)", "const [isSendingInvoice, setIsSendingInvoice] = useState(false)\n  const [modalState, setModalState] = useState<{ isOpen: boolean, type: 'reminder' | 'send' | null }>({ isOpen: false, type: null })");

// Replace window.confirm occurrences
const regex1 = /if \(!window\.confirm\(`Are you sure you want to send a payment reminder to \$\{clientEmail\}\?`\)\) return;/g;
const regex2 = /if \(!window\.confirm\(`Are you sure you want to send this invoice to \$\{clientEmail\}\?`\)\) return;/g;
content = content.replace(regex1, "setModalState({ isOpen: true, type: 'reminder' }); return;");
content = content.replace(regex2, "setModalState({ isOpen: true, type: 'send' }); return;");

// Fix !clientEmail TS error
content = content.replace(/sendPaymentReminder\(clientEmail, clientName/g, "sendPaymentReminder(clientEmail!, clientName");
content = content.replace(/sendInvoiceEmail\(clientEmail, clientName/g, "sendInvoiceEmail(clientEmail!, clientName");

// Add execute methods
const methods = `  const executeSendReminder = async () => {
    setIsSendingReminder(true)
    const { sendPaymentReminder } = await import('@/app/actions/email')
    const formattedAmount = '₹ ' + total.toFixed(2)
    const res = await sendPaymentReminder(clientEmail!, clientName, invoiceNumber, invoiceId, formattedAmount)
    if (res.success) {
      toast.success('Reminder sent successfully!')
    } else {
      toast.error('Failed to send reminder.')
    }
    setIsSendingReminder(false)
  }

  const executeSendInvoice = async () => {
    setIsSendingInvoice(true)
    const { sendInvoiceEmail } = await import('@/app/actions/email')
    const formattedAmount = '₹ ' + total.toFixed(2)
    const res = await sendInvoiceEmail(clientEmail!, clientName, invoiceNumber, invoiceId, formattedAmount)
    if (res.success) {
      toast.success('Invoice sent successfully!')
      if (status === 'draft') {
        await updateInvoiceStatus(invoiceId, 'sent')
      }
    } else {
      toast.error('Failed to send invoice.')
    }
    setIsSendingInvoice(false)
  }

  return (`;
content = content.replace("  return (", methods);

// Add Modal element
const modalElement = `      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, type: null })}
        onConfirm={modalState.type === 'reminder' ? executeSendReminder : executeSendInvoice}
        title={modalState.type === 'reminder' ? 'Send Payment Reminder' : 'Send Invoice Email'}
        message={modalState.type === 'reminder' 
          ? \`Are you sure you want to send a payment reminder to \${clientEmail}?\` 
          : \`Are you sure you want to send this invoice to \${clientEmail}?\`}
        confirmText="Send Email"
        cancelText="Cancel"
      />
    </div>
  )
}`;
content = content.replace("    </div>\n  )\n}", modalElement);

fs.writeFileSync(path, content, 'utf8');
