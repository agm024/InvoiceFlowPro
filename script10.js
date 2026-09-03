const fs = require('fs');
const path = 'app/sign-up/otp-actions.ts';
let content = fs.readFileSync(path, 'utf8');

const search = `export async function sendOtpAction(email: string) {`;
const replacement = `export async function sendOtpAction(email: string, name?: string) {`;
content = content.replace(search, replacement);

const searchHtml = `  const html = \`
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>Verify your email</h2>
      <p>Your verification code for InvoiceFlowPro is:</p>
      <h1 style="letter-spacing: 5px; font-size: 32px; color: #000;">\${otp}</h1>
      <p>This code will expire in 10 minutes.</p>
    </div>
  \``;

const replacementHtml = `  const clientName = name || email.split('@')[0];
  const html = \`
    <div style="background-color: #f4f4f5; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #18181b; padding: 32px 40px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">InvoiceFlowPro</h1>
        </div>
        <div style="padding: 40px;">
          <h2 style="color: #18181b; margin-top: 0; font-size: 20px; font-weight: 600;">Hello \${clientName},</h2>
          <p style="color: #52525b; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            Thank you for choosing InvoiceFlowPro! Please use the following 6-digit verification code to complete your secure sign-up process:
          </p>
          <div style="background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 8px; padding: 20px; margin-bottom: 32px; text-align: center;">
            <h1 style="letter-spacing: 12px; font-size: 36px; font-weight: 800; color: #18181b; margin: 0;">\${otp}</h1>
          </div>
          <p style="color: #52525b; font-size: 14px; line-height: 1.6; margin-bottom: 8px;">
            This verification code will expire securely in 10 minutes. 
          </p>
          <p style="color: #71717a; font-size: 13px;">
            If you did not request this email, you can safely ignore it.
          </p>
        </div>
        <div style="background-color: #fafafa; padding: 24px 40px; text-align: center; border-top: 1px solid #e4e4e7;">
          <p style="color: #a1a1aa; font-size: 13px; margin: 0;">InvoiceFlowPro by SiteRadiant</p>
        </div>
      </div>
    </div>
  \``;

content = content.replace(searchHtml, replacementHtml);

const searchEmailCall = `  await sendEmail({
    to: email,
    subject: "Your InvoiceFlowPro Verification Code",
    html
  })`;
const replacementEmailCall = `  await sendEmail({
    to: email,
    toName: clientName,
    subject: "Your InvoiceFlowPro Verification Code",
    html
  })`;
content = content.replace(searchEmailCall, replacementEmailCall);

fs.writeFileSync(path, content, 'utf8');
