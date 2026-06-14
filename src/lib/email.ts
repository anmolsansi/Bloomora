interface EmailData {
  to: string;
  from?: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendEmail(data: EmailData): Promise<{ success: boolean; error?: string }> {
  // Stub: In production, this would use Resend
  console.log("Email stub - would send:", {
    to: data.to,
    from: data.from || "bloomora@bloomora.app",
    subject: data.subject,
  });
  console.log("HTML preview:", data.html.slice(0, 200) + "...");

  // Simulate successful send
  return { success: true };
}

export function generateBouquetEmailHtml(params: {
  recipientName: string;
  senderName: string;
  message: string;
  bouquetUrl: string;
  deliveryNote?: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Georgia, serif; background: #FFF9F1; padding: 40px; text-align: center; }
        .card { background: white; border-radius: 16px; padding: 40px; max-width: 500px; margin: 0 auto; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        h1 { color: #263D2B; font-size: 28px; }
        .message { color: #8C8C8C; font-size: 16px; line-height: 1.6; margin: 20px 0; }
        .sender { color: #C95F73; font-style: italic; font-size: 18px; }
        .btn { display: inline-block; background: #55735A; color: white; padding: 12px 32px; border-radius: 24px; text-decoration: none; font-weight: bold; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>A bouquet was made for you!</h1>
        <p class="message">Dear ${params.recipientName},</p>
        <p class="message">${params.message}</p>
        <p class="sender">With love,<br>${params.senderName}</p>
        ${params.deliveryNote ? `<p style="color: #8C8C8C; font-size: 14px; margin-top: 20px;">${params.deliveryNote}</p>` : ""}
        <a href="${params.bouquetUrl}" class="btn">Open Your Bouquet</a>
      </div>
    </body>
    </html>
  `;
}
