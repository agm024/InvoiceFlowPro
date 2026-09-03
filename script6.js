const fs = require('fs');
const path = 'app/app/invoices/[id]/InvoiceActionsDropdown.tsx';
let content = fs.readFileSync(path, 'utf8');

const injection = `  const executeSendReminder = async () => {
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
  }

  return (`;

content = content.replace("  return (", injection);

fs.writeFileSync(path, content, 'utf8');
