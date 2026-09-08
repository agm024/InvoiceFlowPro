const fs = require('fs');
let profile = fs.readFileSync('app/app/settings/profile-actions.ts', 'utf8');

profile = profile.replace(
  /await tx\.user\.deleteMany\(\{ where: \{ companyId \} \}\)/,
  `// Delete all child tables explicitly to avoid PostgreSQL foreign key RESTRICT violations
      // Delete deep relations first
      const invoices = await tx.invoice.findMany({ where: { companyId }, select: { id: true } });
      const invoiceIds = invoices.map(i => i.id);
      await tx.invoiceItem.deleteMany({ where: { invoiceId: { in: invoiceIds } } });
      
      const estimates = await tx.estimate.findMany({ where: { companyId }, select: { id: true } });
      const estimateIds = estimates.map(e => e.id);
      await tx.estimateItem.deleteMany({ where: { estimateId: { in: estimateIds } } });

      const projects = await tx.project.findMany({ where: { companyId }, select: { id: true } });
      const projectIds = projects.map(p => p.id);
      await tx.milestone.deleteMany({ where: { projectId: { in: projectIds } } });
      await tx.projectTask.deleteMany({ where: { projectId: { in: projectIds } } });
      
      const debitNotes = await tx.debitNote.findMany({ where: { companyId }, select: { id: true } });
      const debitNoteIds = debitNotes.map(d => d.id);
      await tx.debitNoteItem.deleteMany({ where: { debitNoteId: { in: debitNoteIds } } });
      
      const posTransactions = await tx.posTransaction.findMany({ where: { companyId }, select: { id: true } });
      const posTxIds = posTransactions.map(p => p.id);
      await tx.posTransactionItem.deleteMany({ where: { transactionId: { in: posTxIds } } });

      // Now we can safely delete the mid-level tables
      await tx.invoice.deleteMany({ where: { companyId } });
      await tx.estimate.deleteMany({ where: { companyId } });
      await tx.product.deleteMany({ where: { companyId } });
      await tx.project.deleteMany({ where: { companyId } });
      await tx.debitNote.deleteMany({ where: { companyId } });
      await tx.posTransaction.deleteMany({ where: { companyId } });
      await tx.contract.deleteMany({ where: { companyId } });
      
      await tx.user.deleteMany({ where: { companyId } })`
);

fs.writeFileSync('app/app/settings/profile-actions.ts', profile, 'utf8');
