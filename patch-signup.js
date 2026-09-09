const fs = require('fs');
let code = fs.readFileSync('app/sign-up/page.tsx', 'utf8');

// Inject the strength checks inside the component
code = code.replace(/const handleChange = \(e: React.ChangeEvent<HTMLInputElement \| HTMLSelectElement>\) => \{/, `const has8Chars = formData.password.length >= 8;
  const hasNumber = /\\d/.test(formData.password);
  const passwordsMatch = formData.password.length > 0 && formData.password === formData.confirmPassword;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {`);

// Inject the visual feedback under the password grid
const visualFeedback = `
                  <div className="mt-2 space-y-1.5 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2 text-xs">
                      {has8Chars ? <CheckCircle2 size={14} className="text-emerald-500" /> : <div className="w-3.5 h-3.5 rounded-full border border-zinc-300 dark:border-zinc-700" />}
                      <span className={has8Chars ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-500"}>At least 8 characters</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {hasNumber ? <CheckCircle2 size={14} className="text-emerald-500" /> : <div className="w-3.5 h-3.5 rounded-full border border-zinc-300 dark:border-zinc-700" />}
                      <span className={hasNumber ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-500"}>Contains a number</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {passwordsMatch ? <CheckCircle2 size={14} className="text-emerald-500" /> : <div className="w-3.5 h-3.5 rounded-full border border-zinc-300 dark:border-zinc-700" />}
                      <span className={passwordsMatch ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-500"}>Passwords match</span>
                    </div>
                  </div>
`;

code = code.replace(/<\/button>\s*<\/div>\s*<\/div>\s*<button onClick=\{handleSendOtp\}/, `</button>
                    </div>
                  </div>${visualFeedback}
                  <button onClick={handleSendOtp}`);

code = code.replace(/if \(formData.password.length < 8\) return toast.error\('Password must be at least 8 characters'\)/, `if (!has8Chars) return toast.error('Password must be at least 8 characters')
      if (!hasNumber) return toast.error('Password must contain at least one number')`);

fs.writeFileSync('app/sign-up/page.tsx', code, 'utf8');
