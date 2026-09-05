const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/new/InvoiceForm.tsx', 'utf8');

content = content.replace(
  "const [submitAction, setSubmitAction] = useState<'sent' | 'draft' | 'sent_and_print' | 'paid'>('draft')",
  "const [submitAction, setSubmitAction] = useState<'sent' | 'draft' | 'sent_and_print' | 'paid'>('draft')\n  const [isSubmitting, setIsSubmitting] = useState(false)"
);

content = content.replace(
  'const handleSubmit = async (e: React.FormEvent) => {\r\n    e.preventDefault()',
  'const handleSubmit = async (e: React.FormEvent) => {\n    e.preventDefault()\n    if (isSubmitting) return;\n    setIsSubmitting(true)'
);
content = content.replace(
  'const handleSubmit = async (e: React.FormEvent) => {\n    e.preventDefault()',
  'const handleSubmit = async (e: React.FormEvent) => {\n    e.preventDefault()\n    if (isSubmitting) return;\n    setIsSubmitting(true)'
);

content = content.replace(
  '} else {\r\n      toast.error(res.error || \'Error saving document\')\r\n    }',
  '} else {\n      toast.error(res.error || \'Error saving document\')\n      setIsSubmitting(false)\n    }'
);
content = content.replace(
  '} else {\n      toast.error(res.error || \'Error saving document\')\n    }',
  '} else {\n      toast.error(res.error || \'Error saving document\')\n      setIsSubmitting(false)\n    }'
);


fs.writeFileSync('app/app/invoices/new/InvoiceForm.tsx', content, 'utf8');
