'use server'

import { SendMailClient } from 'zeptomail'

const url = "api.zeptomail.in/";
const token = process.env.ZEPTOMAIL_SEND_MAIL_TOKEN;

let client: SendMailClient | null = null;
if (token) {
  client = new SendMailClient({url, token});
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!client) {
    console.error("Zeptomail token not configured");
    return { success: false, error: "Email configuration missing" };
  }

  try {
    const response = await client.sendMail({
      from: {
        address: "noreply@siteradiant.co.in",
        name: "InvoiceFlowPro",
      },
      to: [
        {
          email_address: {
            address: to,
            name: to.split('@')[0] || "Client",
          },
        },
      ],
      subject: subject,
      htmlbody: html,
    });
    
    return { success: true, data: response };
  } catch (error) {
    console.error("Error sending email via Zeptomail:", error);
    return { success: false, error: "Failed to send email" };
  }
}

export async function sendPortalLink(clientEmail: string, clientName: string, portalToken: string) {
  const portalUrl = `https://invoice.siteradiant.co.in/portal/${portalToken}`;
  const html = `
    <div style="background-color: #f4f4f5; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #18181b; padding: 32px 40px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">InvoiceFlowPro</h1>
        </div>
        <div style="padding: 40px;">
          <h2 style="color: #18181b; margin-top: 0; font-size: 20px; font-weight: 600;">Hello ${clientName},</h2>
          <p style="color: #52525b; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            Here is the link to access your dedicated Client Portal. You can view your active projects, estimates, outstanding invoices, and statement of accounts.
          </p>
          <div style="text-align: center; margin: 40px 0 20px 0;">
            <a href="${portalUrl}" style="display: inline-block; background-color: #18181b; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Access Client Portal
            </a>
          </div>
          <p style="color: #71717a; font-size: 13px; text-align: center; margin-top: 20px;">
            Or copy and paste this link in your browser: <br/>
            <a href="${portalUrl}" style="color: #3b82f6;">${portalUrl}</a>
          </p>
        </div>
        <div style="background-color: #fafafa; padding: 24px 40px; text-align: center; border-top: 1px solid #e4e4e7;">
          <p style="color: #a1a1aa; font-size: 13px; margin: 0;">InvoiceFlowPro by SiteRadiant</p>
        </div>
      </div>
    </div>
  `;
  
  return await sendEmail({
    to: clientEmail,
    subject: "Your Client Portal Access - Site Radiant",
    html
  });
}

export async function sendPaymentReminder(clientEmail: string, clientName: string, invoiceNumber: string, invoiceId: string, amount: string) {
  const paymentUrl = `https://invoice.siteradiant.co.in/pay/${invoiceId}`;
  const html = `
    <div style="background-color: #f4f4f5; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #18181b; padding: 32px 40px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">InvoiceFlowPro</h1>
        </div>
        <div style="padding: 40px;">
          <h2 style="color: #18181b; margin-top: 0; font-size: 20px; font-weight: 600;">Hello ${clientName},</h2>
          <p style="color: #52525b; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            This is a friendly reminder that an invoice on your account is currently pending payment.
          </p>
          <div style="background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 8px; padding: 20px; margin-bottom: 32px;">
            <div style="margin-bottom: 12px;">
              <span style="color: #71717a; font-size: 14px; font-weight: 500; display: inline-block; width: 100px;">Invoice No:</span>
              <span style="color: #18181b; font-size: 14px; font-weight: 600;">${invoiceNumber}</span>
            </div>
            <div>
              <span style="color: #71717a; font-size: 14px; font-weight: 500; display: inline-block; width: 100px;">Amount Due:</span>
              <span style="color: #18181b; font-size: 18px; font-weight: 700;">${amount}</span>
            </div>
          </div>
          <div style="text-align: center; margin: 40px 0 20px 0;">
            <a href="${paymentUrl}" style="display: inline-block; background-color: #18181b; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              View & Pay Invoice
            </a>
          </div>
        </div>
        <div style="background-color: #fafafa; padding: 24px 40px; text-align: center; border-top: 1px solid #e4e4e7;">
          <p style="color: #a1a1aa; font-size: 13px; margin: 0;">InvoiceFlowPro by SiteRadiant</p>
        </div>
      </div>
    </div>
  `;
  
  return await sendEmail({
    to: clientEmail,
    subject: `Payment Reminder: Invoice ${invoiceNumber}`,
    html
  });
}

export async function sendInvoiceEmail(clientEmail: string, clientName: string, invoiceNumber: string, invoiceId: string, amount: string, customSubject?: string, customMessage?: string) {
  const paymentUrl = `https://invoice.siteradiant.co.in/pay/${invoiceId}`;
  
  const defaultMessage = `A new invoice has been generated for you and is now available for review and payment.`;
  const messageBody = customMessage ? customMessage.replace(/\n/g, '<br/>') : defaultMessage;
  
  const html = `
    <div style="background-color: #f4f4f5; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #18181b; padding: 32px 40px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">InvoiceFlowPro</h1>
        </div>
        <div style="padding: 40px;">
          <h2 style="color: #18181b; margin-top: 0; font-size: 20px; font-weight: 600;">Hello ${clientName},</h2>
          <p style="color: #52525b; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            ${messageBody}
          </p>
          <div style="background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 8px; padding: 20px; margin-bottom: 32px;">
            <div style="margin-bottom: 12px;">
              <span style="color: #71717a; font-size: 14px; font-weight: 500; display: inline-block; width: 100px;">Invoice No:</span>
              <span style="color: #18181b; font-size: 14px; font-weight: 600;">${invoiceNumber}</span>
            </div>
            <div>
              <span style="color: #71717a; font-size: 14px; font-weight: 500; display: inline-block; width: 100px;">Amount Due:</span>
              <span style="color: #18181b; font-size: 18px; font-weight: 700;">${amount}</span>
            </div>
          </div>
          <div style="text-align: center; margin: 40px 0 20px 0;">
            <a href="${paymentUrl}" style="display: inline-block; background-color: #18181b; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              View & Pay Invoice
            </a>
          </div>
        </div>
        <div style="background-color: #fafafa; padding: 24px 40px; text-align: center; border-top: 1px solid #e4e4e7;">
          <p style="color: #a1a1aa; font-size: 13px; margin: 0;">InvoiceFlowPro by SiteRadiant</p>
        </div>
      </div>
    </div>
  `;
  
  return await sendEmail({
    to: clientEmail,
    subject: customSubject || `Invoice Available: ${invoiceNumber}`,
    html
  });
}
