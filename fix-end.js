const fs = require('fs');

let client = fs.readFileSync('app/app/billing/BillingClient.tsx', 'utf8').replace(/\r\n/g, '\n');

client = client.replace("      </div>\n    </div>\n  )\n}", "      </div>\n    </div>\n    </>\n  )\n}");
fs.writeFileSync('app/app/billing/BillingClient.tsx', client, 'utf8');

