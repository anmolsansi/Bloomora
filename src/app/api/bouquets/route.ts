import { NextResponse } from "next/server";
import { generateSlug } from "@/lib/slug";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
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

    const supabase = getSupabase();

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
