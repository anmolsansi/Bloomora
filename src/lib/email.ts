import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY || "";
const fromEmail =
  process.env.RESEND_FROM_EMAIL || "Bloomora <onboarding@resend.dev>";

interface EmailData {
  to: string;
  from?: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendEmail(
  data: EmailData
): Promise<{ success: boolean; error?: string }> {
  if (!resendApiKey) {
    console.warn("Resend API key not configured. Email not sent.");
    console.log("Would send email:", {
      to: data.to,
      subject: data.subject,
    });
    return {
      success: false,
      error: "Resend API key not configured. Email was not sent.",
    };
  }

  try {
    const resend = new Resend(resendApiKey);

    await resend.emails.send({
      from: data.from || fromEmail,
      to: data.to,
      subject: data.subject,
      html: data.html,
      text: data.text,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function generateBouquetEmailHtml(params: {
  recipientName: string;
  senderName: string;
  message: string;
  bouquetUrl: string;
  deliveryNote?: string;
}): string {
  const safeRecipient = escapeHtml(params.recipientName);
  const safeMessage = escapeHtml(params.message);
  const safeSender = escapeHtml(params.senderName);
  const safeNote = params.deliveryNote ? escapeHtml(params.deliveryNote) : "";
  const safeUrl = escapeHtml(params.bouquetUrl);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>A bouquet was made for you!</title>
    </head>
    <body style="margin:0;padding:0;background-color:#FFF9F1;font-family:Georgia,'Times New Roman',serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFF9F1;padding:40px 20px;">
        <tr>
          <td align="center">
            <table role="presentation" width="500" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
              <!-- Header accent -->
              <tr>
                <td style="height:6px;background:linear-gradient(90deg,#C95F73,#55735A);"></td>
              </tr>
              <tr>
                <td style="padding:40px 40px 20px;text-align:center;">
                  <p style="margin:0 0 8px;font-size:14px;color:#8C8C8C;letter-spacing:1px;text-transform:uppercase;">Bloomora</p>
                  <h1 style="margin:0 0 16px;font-size:28px;color:#263D2B;font-weight:bold;">A bouquet was made for you!</h1>
                  <div style="width:60px;height:2px;background:#C95F73;margin:0 auto 24px;border-radius:1px;"></div>
                </td>
              </tr>
              <!-- Message content -->
              <tr>
                <td style="padding:0 40px;">
                  <p style="margin:0 0 16px;font-size:16px;color:#555;line-height:1.6;">Dear ${safeRecipient},</p>
                  <p style="margin:0 0 16px;font-size:16px;color:#555;line-height:1.6;">${safeMessage}</p>
                  ${safeNote ? `<p style="margin:16px 0;padding:12px 16px;background:#FFF9F1;border-radius:8px;font-size:14px;color:#8C8C8C;font-style:italic;border-left:3px solid #C95F73;">${safeNote}</p>` : ""}
                  <p style="margin:24px 0 0;font-size:16px;color:#C95F73;font-style:italic;">With love,<br>${safeSender}</p>
                </td>
              </tr>
              <!-- CTA button -->
              <tr>
                <td style="padding:32px 40px 16px;text-align:center;">
                  <a href="${safeUrl}" style="display:inline-block;background:#55735A;color:#ffffff;padding:14px 36px;border-radius:28px;text-decoration:none;font-weight:bold;font-size:16px;letter-spacing:0.5px;">Open Your Bouquet</a>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding:16px 40px 32px;text-align:center;">
                  <p style="margin:0;font-size:12px;color:#aaa;">Sent with care via Bloomora</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
