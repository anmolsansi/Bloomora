import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { bouquetStore } from "../route";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = getSupabaseAdmin();

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

      return NextResponse.json({
        id: data.id,
        slug: data.slug,
        recipientName: data.recipient_name,
        senderName: data.sender_name,
        message: data.message,
        occasion: data.occasion,
        selectedFlowers: data.selected_flowers,
        arrangementData: data.arrangement_data,
        styleData: data.style_data,
        createdAt: data.created_at,
      });
    }

    // Fallback to in-memory storage
    const bouquet = bouquetStore.get(slug);

    if (!bouquet) {
      return NextResponse.json(
        { error: "Bouquet not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: bouquet.id,
      slug: bouquet.slug,
      recipientName: bouquet.recipientName,
      senderName: bouquet.senderName,
      message: bouquet.message,
      occasion: bouquet.occasion,
      selectedFlowers: bouquet.selectedFlowers,
      arrangementData: bouquet.arrangementData,
      styleData: bouquet.styleData,
      createdAt: bouquet.createdAt,
    });
  } catch (error) {
    console.error("Failed to get bouquet:", error);
    return NextResponse.json(
      { error: "Failed to get bouquet" },
      { status: 500 }
    );
  }
}
