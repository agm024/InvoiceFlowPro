const fs = require('fs');
let taskContent = fs.readFileSync('C:/Users/gulab/.gemini/antigravity/brain/e11942d6-1434-4b68-ab63-66c85d35b1d8/task.md', 'utf8');

taskContent = taskContent.replace(
  '- [ ] **Navigation & Sidebar**\n  - [ ] Restructure sidebar (Overview, Sales, Expenses, Work, Business).',
  '- [x] **Navigation & Sidebar**\n  - [x] Restructure sidebar (Overview, Sales, Expenses, Work, Business).'
);

taskContent = taskContent.replace(
  '- [ ] **Global Create & Search**\n  - [ ] Build Global `+ Create` dropdown menu.\n  - [ ] Build Command Palette / Search (Ctrl+K).',
  '- [x] **Global Create & Search**\n  - [x] Build Global `+ Create` dropdown menu.\n  - [ ] Build Command Palette / Search (Ctrl+K).'
);

taskContent = taskContent.replace(
  '- [ ] **Business Profile**\n  - [ ] Build dedicated Settings page for Business Profile (Legal Name, GSTIN, PAN, Bank Details, Logo).',
  '- [x] **Business Profile**\n  - [x] Build dedicated Settings page for Business Profile (Legal Name, GSTIN, PAN, Bank Details, Logo).'
);

taskContent = taskContent.replace(
  '- [ ] **Dashboard Empty States**\n  - [ ] Add empty states for Cash Flow, Top Clients, and Active Projects charts.',
  '- [x] **Dashboard Empty States**\n  - [x] Add empty states for Cash Flow, Top Clients, and Active Projects charts.'
);

taskContent = taskContent.replace(
  '- [ ] **Status Badges & History**\n  - [ ] Unify status badges (Paid, Sent, Pending, Overdue, Draft).\n  - [ ] Add Invoice Audit/History trail.',
  '- [x] **Status Badges & History**\n  - [x] Unify status badges (Paid, Sent, Pending, Overdue, Draft).\n  - [ ] Add Invoice Audit/History trail.'
);

fs.writeFileSync('C:/Users/gulab/.gemini/antigravity/brain/e11942d6-1434-4b68-ab63-66c85d35b1d8/task.md', taskContent, 'utf8');
