const fs = require('fs');
const path = 'app/app/invoices/[id]/InvoiceActionsDropdown.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace("import { toast } from 'react-hot-toast'", "import { toast } from 'react-hot-toast'\nimport ConfirmationModal from '@/components/ConfirmationModal'");

content = content.replace("const [isSendingReminder, setIsSendingReminder] = useState(false)", "const [isSendingReminder, setIsSendingReminder] = useState(false)\n  const [modalState, setModalState] = useState({ isOpen: false, type: null })");

// Use regex to avoid exact string matching issues
content = content.replace(/const handleSendReminder = async \(\) => \{[\s\S]*?setIsOpen\(false\)\n  \}/, `const handleSendReminder = () => {
    if (!clientEmail) {
      toast.error('Client has no email address.')
      return
    }
    setModalState({ isOpen: true, type: 'reminder' })
    setIsOpen(false)
  }

  const executeSendReminder = async () => {
    setIsSendingReminder(true)
    const { sendPaymentReminder } = await import('@/app/actions/email')
    const formattedAmount = '₹ ' + total.toFixed(2)
    const res = await sendPaymentReminder(clientEmail, clientName, invoiceNumber, invoiceId, formattedAmount)
    if (res.success) {
      toast.success('Reminder sent successfully!')
    } else {
      toast.error('Failed to send reminder.')
    }
    setIsSendingReminder(false)
  }`);

content = content.replace(/const handleSendInvoice = async \(\) => \{[\s\S]*?setIsOpen\(false\)\n  \}/, `const handleSendInvoice = () => {
    if (!clientEmail) {
      toast.error('Client has no email address.')
      return
    }
    setModalState({ isOpen: true, type: 'send' })
    setIsOpen(false)
  }

  const executeSendInvoice = async () => {
    setIsSendingInvoice(true)
    const { sendInvoiceEmail } = await import('@/app/actions/email')
    const formattedAmount = '₹ ' + total.toFixed(2)
    const res = await sendInvoiceEmail(clientEmail, clientName, invoiceNumber, invoiceId, formattedAmount)
    if (res.success) {
      toast.success('Invoice sent successfully!')
      if (status === 'draft') {
        await updateInvoiceStatus(invoiceId, 'sent')
      }
    } else {
      toast.error('Failed to send invoice.')
    }
    setIsSendingInvoice(false)
  }`);

content = content.replace("    </div>\n  )\n}", `      <ConfirmationModal
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
}`);

fs.writeFileSync(path, content, 'utf8');
