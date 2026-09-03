const fs = require('fs');
const path = 'app/invite/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace("export default function InvitePage() {", "function InviteContent() {");
content = content.replace("import { useState, useEffect } from 'react'", "import { useState, useEffect, Suspense } from 'react'");

content += `

export default function InvitePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-zinc-400" /></div>}>
      <InviteContent />
    </Suspense>
  )
}
`;

fs.writeFileSync(path, content, 'utf8');
