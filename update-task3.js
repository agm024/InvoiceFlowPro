const fs = require('fs');
let taskContent = fs.readFileSync('C:/Users/gulab/.gemini/antigravity/brain/e11942d6-1434-4b68-ab63-66c85d35b1d8/task.md', 'utf8');

taskContent = taskContent.replace(
  '- [ ] **Invoice PDF Quality**\n  - [ ] Audit PDF generation library and layout.\n  - [ ] Ensure all fields (Logo, PAN, GSTIN, HSN/SAC, Bank Details) are supported.\n  - [ ] Test layout with long item descriptions.',
  '- [x] **Invoice PDF Quality**\n  - [x] Audit PDF generation library and layout.\n  - [x] Ensure all fields (Logo, PAN, GSTIN, HSN/SAC, Bank Details, Signature) are supported.\n  - [x] Test layout with long item descriptions.'
);

fs.writeFileSync('C:/Users/gulab/.gemini/antigravity/brain/e11942d6-1434-4b68-ab63-66c85d35b1d8/task.md', taskContent, 'utf8');
