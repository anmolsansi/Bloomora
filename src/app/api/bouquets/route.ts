import { NextResponse } from "next/server";
import { generateSlug } from "@/lib/slug";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { SelectedFlower, ArrangementData, StyleData } from "@/types/bouquet";

const VALID_STYLES = ["romantic", "wild_garden", "classic", "minimal", "bright", "soft_pastel", "elegant"];
const VALID_GREENERY = ["soft_garden", "trailing", "structured", "wild"];
const VALID_SHAPES = ["round", "cascading", "hand_tied", "presentation"];
const VALID_WRAPPERS = ["soft_pink", "kraft", "white_satin", "garden_green"];
const VALID_RIBBONS = ["rose", "cream", "sage", "gold", "lavender", "navy"];
const VALID_BACKGROUNDS = ["warm_cream", "soft_blush", "sage_garden", "twilight"];
const VALID_CARD_STYLES = ["floral_border", "minimal", "vintage", "modern"];

interface CreateBouquetRequest {
  selectedFlowers: SelectedFlower[];
  arrangementData: ArrangementData;
  styleData: StyleData;
  recipientName: string;
  senderName: string;
  message: string;
  occasion?: string;
  recipientEmail?: string;
  senderEmail?: string;
  deliveryMethod?: string;
}

// In-memory fallback store
const bouquetStore = new Map<
  string,
  {
    id: string;
    slug: string;
    recipientName: string;
    senderName: string;
    recipientEmail: string | null;
    senderEmail: string | null;
    message: string;
    occasion: string | null;
    selectedFlowers: SelectedFlower[];
    arrangementData: ArrangementData;
    styleData: StyleData;
    deliveryMethod: string | null;
    emailSentAt: string | null;
    createdAt: string;
    updatedAt: string;
  }
>();

export async function POST(request: Request) {
  try {
    const body: CreateBouquetRequest = await request.json();

    if (!body.recipientName || !body.message) {
      return NextResponse.json(
        { error: "Recipient name and message are required" },
        { status: 400 }
      );
    }

    if (body.recipientName.length > 100) {
      return NextResponse.json(
        { error: "Recipient name must be 100 characters or less" },
        { status: 400 }
      );
    }

    if (body.message.length > 500) {
      return NextResponse.json(
        { error: "Message must be 500 characters or less" },
        { status: 400 }
      );
    }

    if (body.senderName && body.senderName.length > 100) {
      return NextResponse.json(
        { error: "Sender name must be 100 characters or less" },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.selectedFlowers) || body.selectedFlowers.length === 0) {
      return NextResponse.json(
        { error: "At least one flower is required" },
        { status: 400 }
      );
    }

    if (body.selectedFlowers.length > 15) {
      return NextResponse.json(
        { error: "Maximum 15 flowers allowed" },
        { status: 400 }
      );
    }

    for (const flower of body.selectedFlowers) {
      if (!flower.flowerId || typeof flower.flowerId !== "string") {
        return NextResponse.json(
          { error: "Invalid flower data" },
          { status: 400 }
        );
      }
      if (!flower.color || typeof flower.color !== "string") {
        return NextResponse.json(
          { error: "Invalid flower color" },
          { status: 400 }
        );
      }
      if (typeof flower.count !== "number" || flower.count < 1 || flower.count > 10) {
        return NextResponse.json(
          { error: "Invalid flower count" },
          { status: 400 }
        );
      }
    }

    if (body.arrangementData) {
      if (!VALID_STYLES.includes(body.arrangementData.style)) {
        return NextResponse.json({ error: "Invalid arrangement style" }, { status: 400 });
      }
      if (!VALID_GREENERY.includes(body.arrangementData.greeneryStyle)) {
        return NextResponse.json({ error: "Invalid greenery style" }, { status: 400 });
      }
      if (!VALID_SHAPES.includes(body.arrangementData.bouquetShape)) {
        return NextResponse.json({ error: "Invalid bouquet shape" }, { status: 400 });
      }
      if (typeof body.arrangementData.fullness !== "number" || body.arrangementData.fullness < 0.3 || body.arrangementData.fullness > 1) {
        return NextResponse.json({ error: "Invalid fullness value" }, { status: 400 });
      }
    }

    if (body.styleData) {
      if (!VALID_WRAPPERS.includes(body.styleData.wrapper)) {
        return NextResponse.json({ error: "Invalid wrapper style" }, { status: 400 });
      }
      if (!VALID_RIBBONS.includes(body.styleData.ribbon)) {
        return NextResponse.json({ error: "Invalid ribbon style" }, { status: 400 });
      }
      if (!VALID_BACKGROUNDS.includes(body.styleData.background)) {
        return NextResponse.json({ error: "Invalid background style" }, { status: 400 });
      }
      if (!VALID_CARD_STYLES.includes(body.styleData.cardStyle)) {
        return NextResponse.json({ error: "Invalid card style" }, { status: 400 });
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (body.recipientEmail && !emailRegex.test(body.recipientEmail)) {
      return NextResponse.json({ error: "Invalid recipient email" }, { status: 400 });
    }
    if (body.senderEmail && !emailRegex.test(body.senderEmail)) {
      return NextResponse.json({ error: "Invalid sender email" }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const slug = generateSlug();
    const now = new Date().toISOString();

    const bouquetData = {
      id,
      slug,
      recipient_name: body.recipientName,
      sender_name: body.senderName,
      recipient_email: body.recipientEmail || null,
      sender_email: body.senderEmail || null,
      message: body.message,
      occasion: body.occasion || null,
      selected_flowers: body.selectedFlowers,
      arrangement_data: body.arrangementData,
      style_data: body.styleData,
      delivery_method: body.deliveryMethod || null,
      email_sent_at: null,
      created_at: now,
      updated_at: now,
    };

    const supabase = getSupabaseAdmin();

    if (supabase) {
      const { error } = await supabase.from("bouquets").insert(bouquetData);
      if (error) {
        console.error("Supabase error:", error);
        return NextResponse.json(
          { error: "Failed to save bouquet" },
          { status: 500 }
        );
      }
    } else {
      // Fallback to in-memory storage
      bouquetStore.set(slug, {
        ...bouquetData,
        recipientName: bouquetData.recipient_name,
        senderName: bouquetData.sender_name,
        recipientEmail: bouquetData.recipient_email,
        senderEmail: bouquetData.sender_email,
        occasion: bouquetData.occasion,
        selectedFlowers: bouquetData.selected_flowers,
        arrangementData: bouquetData.arrangement_data,
        styleData: bouquetData.style_data,
        deliveryMethod: bouquetData.delivery_method,
        emailSentAt: bouquetData.email_sent_at,
        createdAt: bouquetData.created_at,
        updatedAt: bouquetData.updated_at,
      });
    }

    return NextResponse.json({ slug, id });
  } catch (error) {
    console.error("Failed to create bouquet:", error);
    return NextResponse.json(
      { error: "Failed to create bouquet" },
      { status: 500 }
    );
  }
}

export { bouquetStore };
