import { NextResponse } from "next/server";
import { bouquetStore } from "../../route";
import { sendEmail, generateBouquetEmailHtml } from "@/lib/email";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const bouquet = bouquetStore.get(slug);

    if (!bouquet) {
      return NextResponse.json(
        { error: "Bouquet not found" },
        { status: 404 }
      );
    }

    const { recipientEmail, senderEmail, deliveryNote } = body;

    if (!recipientEmail) {
      return NextResponse.json(
        { error: "Recipient email is required" },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const bouquetUrl = `${appUrl}/bouquet/${slug}`;

    const emailHtml = generateBouquetEmailHtml({
      recipientName: bouquet.recipientName,
      senderName: bouquet.senderName,
      message: bouquet.message,
      bouquetUrl,
      deliveryNote,
    });

    const result = await sendEmail({
      to: recipientEmail,
      from: senderEmail,
      subject: `A bouquet was made for you, ${bouquet.recipientName}! 💐`,
      html: emailHtml,
      text: `A bouquet was made for you! Open it here: ${bouquetUrl}`,
    });

    if (result.success) {
      // Update email sent timestamp
      bouquet.emailSentAt = new Date().toISOString();
      bouquetStore.set(slug, bouquet);

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: result.error || "Failed to send email" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
