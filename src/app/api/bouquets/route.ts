import { NextResponse } from "next/server";
import { generateSlug } from "@/lib/slug";
import type { SelectedFlower, ArrangementData, StyleData } from "@/types/bouquet";

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

// In-memory store for MVP (will be replaced by Supabase)
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

    const id = crypto.randomUUID();
    const slug = generateSlug();
    const now = new Date().toISOString();

    const bouquet = {
      id,
      slug,
      recipientName: body.recipientName,
      senderName: body.senderName,
      recipientEmail: body.recipientEmail || null,
      senderEmail: body.senderEmail || null,
      message: body.message,
      occasion: body.occasion || null,
      selectedFlowers: body.selectedFlowers,
      arrangementData: body.arrangementData,
      styleData: body.styleData,
      deliveryMethod: body.deliveryMethod || null,
      emailSentAt: null,
      createdAt: now,
      updatedAt: now,
    };

    // Store bouquet (in-memory for MVP)
    bouquetStore.set(slug, bouquet);

    // TODO: Save to Supabase when configured
    // const { data, error } = await supabase.from('bouquets').insert(bouquet);

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
