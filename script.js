const fs = require('fs');
const path = 'app/app/invoices/[id]/SendEmailButton.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace("import { toast } from 'react-hot-toast'", "import { toast } from 'react-hot-toast'\nimport ConfirmationModal from '@/components/ConfirmationModal'");

content = content.replace("const [isSending, setIsSending] = useState(false)", "const [isSending, setIsSending] = useState(false)\n  const [showConfirm, setShowConfirm] = useState(false)");

const oldFunction = `  const handleSendInvoice = async () => {
    if (!clientEmail) {
      toast.error('Client has no email address.')
      return
    }
    
    if (!window.confirm(\`Are you sure you want to send this invoice to \${clientEmail}?\`)) return;

    setIsSending(true)
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
    setIsSending(false)
  }`;

const newFunction = `  const handleSendInvoice = () => {
    if (!clientEmail) {
      toast.error('Client has no email address.')
      return
    }
    setShowConfirm(true)
  }

  const executeSendInvoice = async () => {
    setIsSending(true)
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
    setIsSending(false)
  }`;

content = content.replace(/const handleSendInvoice = async \(\) => \{[\s\S]*?setIsSending\(false\)\n  \}/, newFunction);

content = content.replace("    </button>\n  )\n}", `    </button>\n      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={executeSendInvoice}
        title="Send Invoice Email"
        message={\`Are you sure you want to send this invoice to \${clientEmail}?\`}
        confirmText="Send Email"
        cancelText="Cancel"
      />
    </>
  )
}`);

content = content.replace("<button", "<>\n    <button");

fs.writeFileSync(path, content, 'utf8');
