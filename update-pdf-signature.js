const fs = require('fs');

let invoicePdfPage = fs.readFileSync('app/pay/[id]/invoice/page.tsx', 'utf8');

// 1. Add PAN
invoicePdfPage = invoicePdfPage.replace(
  '{companySettings?.gstin && <p className="text-sm font-medium mt-1">GSTIN: {companySettings.gstin}</p>}',
  '{companySettings?.gstin && <p className="text-sm font-medium mt-1">GSTIN: {companySettings.gstin}</p>}\n                {companySettings?.panNo && <p className="text-sm font-medium mt-1">PAN: {companySettings.panNo}</p>}'
);

// 2. Add Signature area at the bottom
// Let's find the closing div of the content
// Look for "{invoice.notes &&" or the end of the file.
const signatureArea = `
            {/* Signature Area */}
            <div className="mt-16 pt-8 flex justify-end">
              <div className="text-center w-64">
                <div className="border-b-2 border-zinc-300 mb-2 h-16"></div>
                <p className="text-sm font-bold text-zinc-900">Authorized Signatory</p>
                <p className="text-xs text-zinc-500 mt-1">{companySettings?.brandName || companySettings?.companyName}</p>
              </div>
            </div>
`;

if (invoicePdfPage.includes('</div>\n        </div>\n      </div>\n    )\n  }')) {
   invoicePdfPage = invoicePdfPage.replace(
     '</div>\n        </div>\n      </div>\n    )\n  }',
     signatureArea + '\n          </div>\n        </div>\n      </div>\n    )\n  }'
   );
} else if (invoicePdfPage.includes('</div>\n        </div>\n      </div>\n    )\n}')) {
   invoicePdfPage = invoicePdfPage.replace(
     '</div>\n        </div>\n      </div>\n    )\n}',
     signatureArea + '\n          </div>\n        </div>\n      </div>\n    )\n}'
   );
} else {
   // Fallback, just insert before the last 3 closing divs
   invoicePdfPage = invoicePdfPage.replace(
     /          <\/div>\s*<\/div>\s*<\/div>\s*\)\s*\}\s*$/g,
     signatureArea + '\n          </div>\n        </div>\n      </div>\n    )\n  }'
   );
}

fs.writeFileSync('app/pay/[id]/invoice/page.tsx', invoicePdfPage, 'utf8');
