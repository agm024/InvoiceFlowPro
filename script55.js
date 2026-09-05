const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/new/InvoiceForm.tsx', 'utf8');

// Add isSubmitting state
content = content.replace(
  '  const [submitAction, setSubmitAction] = useState(\'draft\')',
  '  const [submitAction, setSubmitAction] = useState(\'draft\')\n  const [isSubmitting, setIsSubmitting] = useState(false)'
);

// Add to handleSubmit
content = content.replace(
  '  const handleSubmit = async (e: React.FormEvent) => {\n    e.preventDefault()',
  '  const handleSubmit = async (e: React.FormEvent) => {\n    e.preventDefault()\n    if (isSubmitting) return;\n    setIsSubmitting(true)'
);

// Reset isSubmitting on error
content = content.replace(
  '    } else {\n      toast.error(res.error || \'Error saving document\')\n    }',
  '    } else {\n      toast.error(res.error || \'Error saving document\')\n      setIsSubmitting(false)\n    }'
);

// Disable buttons if isSubmitting is true
// For Save Draft button
content = content.replace(
  '                onClick={() => setSubmitAction(\'draft\')}',
  '                onClick={() => setSubmitAction(\'draft\')}\n                disabled={isSubmitting}'
);

// For Save & Print button
content = content.replace(
  '                onClick={() => setSubmitAction(\'sent_and_print\')}',
  '                onClick={() => setSubmitAction(\'sent_and_print\')}\n                disabled={isSubmitting}'
);

// For mobile Draft button
content = content.replace(
  'onClick={() => setSubmitAction(\'draft\')} className="flex-1 bg-zinc-100',
  'onClick={() => setSubmitAction(\'draft\')} disabled={isSubmitting} className="flex-1 bg-zinc-100'
);

// For mobile Issue Now button
content = content.replace(
  'onClick={() => setSubmitAction(\'sent\')} className="flex-[1.5] bg-zinc-900',
  'onClick={() => setSubmitAction(\'sent\')} disabled={isSubmitting} className="flex-[1.5] bg-zinc-900'
);

fs.writeFileSync('app/app/invoices/new/InvoiceForm.tsx', content, 'utf8');
