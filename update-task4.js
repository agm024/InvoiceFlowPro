const fs = require('fs');
let taskContent = fs.readFileSync('C:/Users/gulab/.gemini/antigravity/brain/e11942d6-1434-4b68-ab63-66c85d35b1d8/task.md', 'utf8');

taskContent = taskContent.replace(
  '- [ ] **Invoice Creation Flow**\n  - [ ] Audit and streamline `app/app/invoices/new/page.tsx`.\n  - [ ] Ensure step-by-step logic (Customer -> Details -> Items -> Tax -> Preview -> Save/Send).\n  - [ ] Optimize for "first invoice in 60 seconds".',
  '- [x] **Invoice Creation Flow**\n  - [x] Audit and streamline `app/app/invoices/new/page.tsx`.\n  - [x] Ensure step-by-step logic (Customer -> Details -> Items -> Tax -> Preview -> Save/Send).\n  - [x] Optimize for "first invoice in 60 seconds".'
);

fs.writeFileSync('C:/Users/gulab/.gemini/antigravity/brain/e11942d6-1434-4b68-ab63-66c85d35b1d8/task.md', taskContent, 'utf8');
