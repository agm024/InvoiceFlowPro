const fs = require('fs');
let content = fs.readFileSync('lib/auth-context.ts', 'utf8');

const search = `export async function requireWriteAccess() {
  const user = await getCurrentUser()
  if (user.isImpersonating && !user.writeAllowed) {
    throw new Error('Write operations are blocked during read-only impersonation.')
  }
}`;

const replacement = `export async function requireWriteAccess() {
  const user = await getCurrentUser()
  if (user.isImpersonating && !user.writeAllowed) {
    throw new Error('Write operations are blocked during read-only impersonation.')
  }
  if (user.role === 'member') {
    const dbUser = await prisma.user.findUnique({ where: { id: user.id }, include: { customRole: true } });
    if (!dbUser || !dbUser.customRole || dbUser.customRole.permissions === '[]' || !dbUser.customRole.permissions) {
      throw new Error('You do not have write access. Contact your administrator.');
    }
  }
}`;

content = content.replace(search, replacement);
fs.writeFileSync('lib/auth-context.ts', content, 'utf8');
