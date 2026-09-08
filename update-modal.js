const fs = require('fs');
let modal = fs.readFileSync('app/portal/[portalToken]/SignatureModal.tsx', 'utf8');
modal = modal.replace('hover:bg-zinc-800 dark:hover:bg-zinc-200', 'hover:bg-primary-hover');
fs.writeFileSync('app/portal/[portalToken]/SignatureModal.tsx', modal, 'utf8');
