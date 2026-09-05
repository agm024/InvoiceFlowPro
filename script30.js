const fs = require('fs');
let content = fs.readFileSync('app/app/settings/MyProfileClient.tsx', 'utf8');

content = content.replace("import { toast } from 'react-hot-toast'", "import { toast } from 'react-hot-toast'\nimport { signOut } from 'next-auth/react'");

content = content.replace("window.location.href = '/'", "signOut({ callbackUrl: '/' })");

fs.writeFileSync('app/app/settings/MyProfileClient.tsx', content, 'utf8');
