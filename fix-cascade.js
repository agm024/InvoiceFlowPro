const fs = require('fs');
let code = fs.readFileSync('prisma/schema.prisma', 'utf8');

// Add onDelete: Cascade to InvoiceItem -> Product and EstimateItem -> Product
code = code.replace(/product\s+Product\s+@relation\(fields: \[productId\], references: \[id\]\)/g, `product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)`);

fs.writeFileSync('prisma/schema.prisma', code, 'utf8');
