const fs = require('fs');

// Fix InvoiceForm
let invoice = fs.readFileSync('app/app/invoices/new/InvoiceForm.tsx', 'utf8');
invoice = invoice.replace('hover:bg-zinc-800 dark:hover:bg-zinc-100', 'hover:bg-primary-hover');
fs.writeFileSync('app/app/invoices/new/InvoiceForm.tsx', invoice, 'utf8');

// Fix ExpensesClient
let exp = fs.readFileSync('app/app/expenses/ExpensesClient.tsx', 'utf8');
exp = exp.replace(/bg-green-600 text-white/g, 'bg-primary text-primary-foreground');
exp = exp.replace(/hover:bg-green-700/g, 'hover:bg-primary-hover');
fs.writeFileSync('app/app/expenses/ExpensesClient.tsx', exp, 'utf8');
