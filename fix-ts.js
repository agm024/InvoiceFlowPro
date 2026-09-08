const fs = require('fs');
let profile = fs.readFileSync('app/app/settings/profile-actions.ts', 'utf8');

profile = profile.replace(
  /const debitNotes = await tx\.debitNote\.findMany\(\{ where: \{ companyId \}, select: \{ id: true \} \}\);\s*const debitNoteIds = debitNotes\.map\(d => d\.id\);\s*await tx\.debitNoteItem\.deleteMany\(\{ where: \{ debitNoteId: \{ in: debitNoteIds \} \} \}\);/,
  `// Debit notes don't have separate items in this schema apparently`
);

profile = profile.replace(
  /const posTransactions = await tx\.posTransaction\.findMany\(\{ where: \{ companyId \}, select: \{ id: true \} \}\);\s*const posTxIds = posTransactions\.map\(p => p\.id\);\s*await tx\.posTransactionItem\.deleteMany\(\{ where: \{ transactionId: \{ in: posTxIds \} \} \}\);/,
  ``
);

profile = profile.replace(
  /await tx\.posTransaction\.deleteMany\(\{ where: \{ companyId \} \}\);/,
  ``
);

fs.writeFileSync('app/app/settings/profile-actions.ts', profile, 'utf8');
