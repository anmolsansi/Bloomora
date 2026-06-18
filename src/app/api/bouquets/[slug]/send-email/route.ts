import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { bouquetStore } from "../../route";
import { sendEmail, generateBouquetEmailHtml } from "@/lib/email";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const supabase = getSupabaseAdmin();

    let bouquet;

    if (supabase) {
      const { data, error } = await supabase
        .from("bouquets")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: "Bouquet not found" },
          { status: 404 }
        );
      }

      bouquet = {
        recipientName: data.recipient_name,
        senderName: data.sender_name,
        message: data.message,
      };
    } else {
      const stored = bouquetStore.get(slug);
      if (!stored) {
        return NextResponse.json(
          { error: "Bouquet not found" },
          { status: 404 }
        );
      }
      bouquet = stored;
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
      subject: `A bouquet was made for you, ${bouquet.recipientName}! 💐`,
      html: emailHtml,
      text: `A bouquet was made for you! Open it here: ${bouquetUrl}`,
    });

    if (result.success) {
      // Update email sent timestamp
      if (supabase) {
        await supabase
          .from("bouquets")
          .update({ email_sent_at: new Date().toISOString() })
          .eq("slug", slug);
      } else {
        const stored = bouquetStore.get(slug);
        if (stored) {
          stored.emailSentAt = new Date().toISOString();
          bouquetStore.set(slug, stored);
        }
      }

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
