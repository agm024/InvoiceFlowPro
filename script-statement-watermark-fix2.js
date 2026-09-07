const fs = require('fs');
let content = fs.readFileSync('app/statement/[clientId]/page.tsx', 'utf8');

// The closing tags at the end are currently:
//         </div>
//       </div>
//     </div>
//   )
// }
// Which means I have 3 closing divs inside the return.

// Let's count opening and closing divs!
// Actually, let's just do a clean replacement.
content = content.replace(
  /        <\/div>\n        <\/div>\n      <\/div>\n    <\/div>\n  \)\n\}\n$/g,
  `      </div>\n    </div>\n  )\n}\n`
);

// We need to add the `relative z-10` after the watermark and before the statement content starts?
// In page.tsx:
// <div id="statement-content" className="max-w-4xl mx-auto bg-white p-4 md:p-8 relative">
// {isFree && watermark}
// <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-zinc-900 pb-8 mb-8 gap-6">

content = content.replace(
  /<div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-zinc-900 pb-8 mb-8 \n?gap-6">/g,
  `<div className="relative z-10">\n        <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-zinc-900 pb-8 mb-8 gap-6">`
);

content = content.replace(
  /      <\/div>\n    <\/div>\n  \)\n\}\n$/,
  `      </div>\n      </div>\n    </div>\n  )\n}\n`
);

fs.writeFileSync('app/statement/[clientId]/page.tsx', content, 'utf8');
