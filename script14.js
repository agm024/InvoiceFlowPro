const fs = require('fs');
const emailHelpersContent = `export function wrapInTemplate(htmlContent: string) {
  return \`
    <div style="background-color: #f4f4f5; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #18181b; padding: 32px 40px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">InvoiceFlowPro</h1>
        </div>
        <div style="padding: 40px;">
          \${htmlContent}
        </div>
        <div style="background-color: #fafafa; padding: 24px 40px; text-align: center; border-top: 1px solid #e4e4e7;">
          <p style="color: #a1a1aa; font-size: 13px; margin: 0;">InvoiceFlowPro by SiteRadiant</p>
        </div>
      </div>
    </div>
  \`;
}`;
fs.writeFileSync('lib/email-helpers.ts', emailHelpersContent, 'utf8');

let emailActions = fs.readFileSync('app/actions/email.ts', 'utf8');
emailActions = emailActions.replace(/export function wrapInTemplate\([\s\S]*?\}\n\}/, '');
fs.writeFileSync('app/actions/email.ts', emailActions, 'utf8');

let systemEmailsActions = fs.readFileSync('app/(admin)/app/admin/system/emails/actions.ts', 'utf8');
systemEmailsActions = systemEmailsActions.replace('import { sendEmail, wrapInTemplate } from "@/app/actions/email"', 'import { sendEmail } from "@/app/actions/email"\nimport { wrapInTemplate } from "@/lib/email-helpers"');
fs.writeFileSync('app/(admin)/app/admin/system/emails/actions.ts', systemEmailsActions, 'utf8');
