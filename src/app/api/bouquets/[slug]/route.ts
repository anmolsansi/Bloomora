import { NextResponse } from "next/server";
import { bouquetStore } from "../route";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const bouquet = bouquetStore.get(slug);

    if (!bouquet) {
      return NextResponse.json(
        { error: "Bouquet not found" },
        { status: 404 }
      );
    }

    // Return bouquet data (read-only for recipient)
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
