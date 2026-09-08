const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

// Add rzpCustomerId to Company
if (!schema.includes('rzpCustomerId')) {
  schema = schema.replace(
    /model Company \{[\s\S]*?gstin\s+String\?/g,
    `$&
  rzpCustomerId    String?   @unique`
  );
}

// Add WebhookEvent model
if (!schema.includes('model WebhookEvent')) {
  schema += `

model WebhookEvent {
  id          String   @id @default(cuid())
  eventId     String   @unique
  type        String
  processedAt DateTime @default(now())
}
`;
}

fs.writeFileSync('prisma/schema.prisma', schema, 'utf8');
