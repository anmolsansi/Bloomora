import { NextResponse } from "next/server";
import { z } from "zod";
import { generateSlug } from "@/lib/slug";
import { getSupabase } from "@/lib/supabase";
import type { SelectedFlower, ArrangementData, StyleData } from "@/types/bouquet";

const selectedFlowerSchema = z.object({
  flowerId: z.string().min(1),
  count: z.number().int().min(1).max(15),
  color: z.string().min(1),
});

const createBouquetSchema = z.object({
  selectedFlowers: z.array(selectedFlowerSchema).min(1).max(50),
  arrangementData: z.object({
    style: z.enum(["romantic", "wild_garden", "classic", "minimal", "bright", "soft_pastel", "elegant"]),
    positions: z.array(z.object({
      flowerId: z.string(),
      x: z.number(),
      y: z.number(),
      scale: z.number(),
      rotation: z.number(),
      layer: z.number(),
    })).min(1),
    greeneryStyle: z.enum(["soft_garden", "trailing", "structured", "wild"]),
    bouquetShape: z.enum(["round", "cascading", "hand_tied", "presentation"]),
    fullness: z.number().min(0).max(1),
  }),
  styleData: z.object({
    wrapper: z.enum(["soft_pink", "kraft", "white_satin", "garden_green"]),
    ribbon: z.enum(["rose", "cream", "sage", "gold", "lavender", "navy"]),
    background: z.enum(["warm_cream", "soft_blush", "sage_garden", "twilight"]),
    cardStyle: z.enum(["floral_border", "minimal", "vintage", "modern"]),
  }),
  recipientName: z.string().min(1).max(50),
  senderName: z.string().min(1).max(50),
  message: z.string().min(1).max(500),
  occasion: z.string().max(50).optional(),
  recipientEmail: z.string().email().optional(),
  senderEmail: z.string().email().optional(),
  deliveryMethod: z.enum(["email", "link"]).optional(),
});

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
    const body = await request.json();
    const parsed = createBouquetSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || "Invalid request body" },
        { status: 400 }
      );
    }

    const data = parsed.data;

    if (data.deliveryMethod === "email" && !data.recipientEmail) {
      return NextResponse.json(
        { error: "Recipient email is required for email delivery" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    if (!supabase && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Database not configured. Cannot save bouquet in production." },
        { status: 500 }
      );
    }

    const id = crypto.randomUUID();
    const slug = generateSlug();
    const now = new Date().toISOString();

    const bouquetData = {
      id,
      slug,
      recipient_name: data.recipientName,
      sender_name: data.senderName,
      recipient_email: data.recipientEmail || null,
      sender_email: data.senderEmail || null,
      message: data.message,
      occasion: data.occasion || null,
      selected_flowers: data.selectedFlowers,
      arrangement_data: data.arrangementData,
      style_data: data.styleData,
      delivery_method: data.deliveryMethod || null,
      email_sent_at: null,
      created_at: now,
      updated_at: now,
    };

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
      // Fallback to in-memory storage (development only)
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
