const fs = require('fs');
let taskContent = fs.readFileSync('C:/Users/gulab/.gemini/antigravity/brain/e11942d6-1434-4b68-ab63-66c85d35b1d8/task.md', 'utf8');

taskContent = taskContent.replace(
  '- [ ] **Tenant Isolation & Security Audit**\n  - [ ] Verify users cannot access other tenants\' invoices/clients via URL/API manipulation.',
  '- [x] **Tenant Isolation & Security Audit**\n  - [x] Verify users cannot access other tenants\' invoices/clients via URL/API manipulation.'
);

fs.writeFileSync('C:/Users/gulab/.gemini/antigravity/brain/e11942d6-1434-4b68-ab63-66c85d35b1d8/task.md', taskContent, 'utf8');
