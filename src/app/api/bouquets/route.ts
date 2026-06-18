import { NextResponse } from "next/server";
import { z } from "zod";
import { generateSlug } from "@/lib/slug";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { SelectedFlower, ArrangementData, StyleData } from "@/types/bouquet";

const VALID_STYLES = [
  "romantic",
  "wild_garden",
  "classic",
  "minimal",
  "bright",
  "soft_pastel",
  "elegant",
] as const;
const VALID_GREENERY = [
  "soft_garden",
  "trailing",
  "structured",
  "wild",
] as const;
const VALID_SHAPES = [
  "round",
  "cascading",
  "hand_tied",
  "presentation",
] as const;
const VALID_WRAPPERS = [
  "soft_pink",
  "kraft",
  "white_satin",
  "garden_green",
] as const;
const VALID_RIBBONS = [
  "rose",
  "cream",
  "sage",
  "gold",
  "lavender",
  "navy",
] as const;
const VALID_BACKGROUNDS = [
  "warm_cream",
  "soft_blush",
  "sage_garden",
  "twilight",
] as const;
const VALID_CARD_STYLES = [
  "floral_border",
  "minimal",
  "vintage",
  "modern",
] as const;

const selectedFlowerSchema = z.object({
  flowerId: z.string().min(1, "Invalid flower data"),
  count: z.number().int().min(1, "Invalid flower count").max(10, "Invalid flower count"),
  color: z.string().min(1, "Invalid flower color"),
});

const arrangementSchema = z.object({
  style: z.enum(VALID_STYLES, { message: "Invalid arrangement style" }),
  positions: z.array(
    z.object({
      flowerId: z.string().min(1),
      x: z.number(),
      y: z.number(),
      scale: z.number().positive(),
      rotation: z.number(),
      layer: z.number().int(),
    })
  ),
  greeneryStyle: z.enum(VALID_GREENERY, { message: "Invalid greenery style" }),
  bouquetShape: z.enum(VALID_SHAPES, { message: "Invalid bouquet shape" }),
  fullness: z
    .number()
    .min(0.3, "Invalid fullness value")
    .max(1, "Invalid fullness value"),
});

const styleSchema = z.object({
  wrapper: z.enum(VALID_WRAPPERS, { message: "Invalid wrapper style" }),
  ribbon: z.enum(VALID_RIBBONS, { message: "Invalid ribbon style" }),
  background: z.enum(VALID_BACKGROUNDS, { message: "Invalid background style" }),
  cardStyle: z.enum(VALID_CARD_STYLES, { message: "Invalid card style" }),
});

const optionalEmailSchema = z
  .string()
  .trim()
  .email("Invalid email")
  .optional()
  .or(z.literal(""));

const createBouquetSchema = z
  .object({
    selectedFlowers: z
      .array(selectedFlowerSchema)
      .min(1, "At least one flower is required")
      .refine(
        (flowers) => flowers.reduce((sum, flower) => sum + flower.count, 0) <= 15,
        "Maximum 15 flowers allowed"
      ),
    arrangementData: arrangementSchema,
    styleData: styleSchema,
    recipientName: z
      .string()
      .trim()
      .min(1, "Recipient name is required")
      .max(50, "Recipient name must be 50 characters or less"),
    senderName: z
      .string()
      .trim()
      .max(50, "Sender name must be 50 characters or less")
      .optional()
      .default(""),
    message: z
      .string()
      .trim()
      .min(1, "Message is required")
      .max(500, "Message must be 500 characters or less"),
    occasion: z.string().trim().max(100).optional().or(z.literal("")),
    recipientEmail: optionalEmailSchema,
    senderEmail: optionalEmailSchema,
    deliveryMethod: z.enum(["email", "link"]).optional().nullable(),
  })
  .refine(
    (data) => data.deliveryMethod !== "email" || Boolean(data.recipientEmail),
    {
      message: "Recipient email is required for email delivery",
      path: ["recipientEmail"],
    }
  );

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

type StoredBouquet = NonNullable<ReturnType<typeof bouquetStore.get>>;

function toStoredBouquet(bouquetData: {
  id: string;
  slug: string;
  recipient_name: string;
  sender_name: string;
  recipient_email: string | null;
  sender_email: string | null;
  message: string;
  occasion: string | null;
  selected_flowers: SelectedFlower[];
  arrangement_data: ArrangementData;
  style_data: StyleData;
  delivery_method: string | null;
  email_sent_at: string | null;
  created_at: string;
  updated_at: string;
}): StoredBouquet {
  return {
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
  };
}

function saveBouquetInMemory(
  slug: string,
  bouquetData: Parameters<typeof toStoredBouquet>[0]
) {
  bouquetStore.set(slug, toStoredBouquet(bouquetData));
}

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

    const supabase = getSupabaseAdmin();

    if (supabase) {
      const { error } = await supabase.from("bouquets").insert(bouquetData);
      if (error) {
        console.error("Supabase error:", error);
        saveBouquetInMemory(slug, bouquetData);
      }
    } else {
      // Fallback to in-memory storage (development only)
      saveBouquetInMemory(slug, bouquetData);
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
