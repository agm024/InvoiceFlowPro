const fs = require('fs');
let code = fs.readFileSync('app/sign-in/actions.ts', 'utf8');

const importStatement = `import { checkRateLimit, clearRateLimit } from '@/lib/rate-limit'\n`;
code = importStatement + code;

code = code.replace(/export async function signInAction\(formData: FormData\) \{/, `export async function signInAction(formData: FormData) {
  const rl = await checkRateLimit('signin', 5, 5 * 60 * 1000); // 5 attempts per 5 mins
  if (!rl.success) return { error: \`Too many login attempts. Try again in \${rl.resetInSeconds} seconds.\` };
`);

// Clear rate limit on successful login? Wait, signIn throws redirect error on success, so we might not be able to clear it easily here unless we do it BEFORE signIn
code = code.replace(/await signIn\('credentials'/, `await clearRateLimit('signin');\n    await signIn('credentials'`);

code = code.replace(/export async function signInWithGoogleAction\(\) \{/, `export async function signInWithGoogleAction() {
  const rl = await checkRateLimit('signin-google', 10, 5 * 60 * 1000);
  if (!rl.success) throw new Error(\`Too many login attempts. Try again in \${rl.resetInSeconds} seconds.\`);
`);

fs.writeFileSync('app/sign-in/actions.ts', code, 'utf8');
