const fs = require('fs');

const fixMessages = (filePath) => {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace success messages
    content = content.replace(/toast\.success\('Invoice sent successfully!'\)/g, "toast.success(`Invoice sent successfully to ${clientEmail}!`)");
    content = content.replace(/toast\.success\('Reminder sent successfully!'\)/g, "toast.success(`Reminder sent successfully to ${clientEmail}!`)");
    
    // Replace error messages
    content = content.replace(/toast\.error\('Failed to send invoice\.'\)/g, "toast.error('Something went wrong. Try again.')");
    content = content.replace(/toast\.error\('Failed to send reminder\.'\)/g, "toast.error('Something went wrong. Try again.')");

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed messages in ${filePath}`);
}

fixMessages('app/app/invoices/[id]/SendEmailButton.tsx');
fixMessages('app/app/invoices/[id]/InvoiceActionsDropdown.tsx');
fixMessages('app/app/invoices/InvoiceRowActions.tsx');

