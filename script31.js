const fs = require('fs');
let content = fs.readFileSync('app/app/settings/profile-actions.ts', 'utf8');

content = content.replace(
  'import { requireCompany } from "@/lib/auth-context"',
  'import { requireCompany, requireWriteAccess } from "@/lib/auth-context"'
);

content = content.replace(
  'export async function deleteAccountAction() {',
  'export async function deleteAccountAction() {\n  await requireWriteAccess()'
);

content = content.replace(
  'export async function changePasswordAction(formData: FormData) {',
  'export async function changePasswordAction(formData: FormData) {\n  await requireWriteAccess()'
);

fs.writeFileSync('app/app/settings/profile-actions.ts', content, 'utf8');
