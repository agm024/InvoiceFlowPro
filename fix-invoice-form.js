const fs = require('fs');

let form = fs.readFileSync('app/app/invoices/new/InvoiceForm.tsx', 'utf8');

if (!form.includes('backdrop-blur-sm')) {
  form = form.replace(
    /<form onSubmit=\{handleSubmit\}/,
    `{isSubmitting && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4 shadow-lg"></div>
          <p className="text-lg font-bold text-zinc-900 dark:text-white animate-pulse">Processing Document...</p>
        </div>
      )}
      <form onSubmit={handleSubmit}`
  );
  fs.writeFileSync('app/app/invoices/new/InvoiceForm.tsx', form, 'utf8');
}
