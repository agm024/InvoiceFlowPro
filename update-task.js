const fs = require('fs');
let taskContent = fs.readFileSync('C:/Users/gulab/.gemini/antigravity/brain/e11942d6-1434-4b68-ab63-66c85d35b1d8/task.md', 'utf8');

taskContent = taskContent.replace(
  '- [ ] **Email Delivery (Zeptomail)**\n  - [ ] Verify Zeptomail integration.\n  - [ ] Improve error boundaries and success messages ("Invoice sent successfully to X").',
  '- [x] **Email Delivery (Zeptomail)**\n  - [x] Verify Zeptomail integration.\n  - [x] Improve error boundaries and success messages ("Invoice sent successfully to X").'
);

// Also check GST & Tax Logic Validation since we did that via Script earlier
taskContent = taskContent.replace(
  '- [ ] **GST & Tax Logic Validation**\n  - [ ] Verify Intra-state vs Inter-state calculations (CGST+SGST vs IGST).\n  - [ ] Verify 0% GST and Exempt item support.\n  - [ ] Verify rounding logic.',
  '- [x] **GST & Tax Logic Validation**\n  - [x] Verify Intra-state vs Inter-state calculations (CGST+SGST vs IGST).\n  - [x] Verify 0% GST and Exempt item support.\n  - [x] Verify rounding logic.'
);

fs.writeFileSync('C:/Users/gulab/.gemini/antigravity/brain/e11942d6-1434-4b68-ab63-66c85d35b1d8/task.md', taskContent, 'utf8');
