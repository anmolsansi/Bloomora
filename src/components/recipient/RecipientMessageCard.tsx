"use client";

import { cn } from "@/lib/utils";

interface RecipientMessageCardProps {
  bouquet: {
    recipientName: string;
    senderName: string;
    message: string;
    occasion: string | null;
    styleData: {
      cardStyle: string;
    };
  };
}

const cardStyles = {
  floral_border: "border-4 border-double border-blush-pink",
  minimal: "border border-blush-pink/30",
  vintage: "border-2 border-warm-brown/30 bg-cream/50",
  modern: "border-l-4 border-sage-green",
};

export function RecipientMessageCard({ bouquet }: RecipientMessageCardProps) {
  const { styleData } = bouquet;

  return (
    <div
      className={cn(
        "rounded-2xl bg-white p-8 shadow-lg min-h-[300px] flex flex-col",
        cardStyles[styleData.cardStyle as keyof typeof cardStyles]
      )}
    >
      <div className="flex-1">
        <p className="text-lg font-serif text-dark-green mb-4">
          Dear {bouquet.recipientName},
        </p>

        <p className="text-soft-gray leading-relaxed whitespace-pre-wrap">
          {bouquet.message}
        </p>
      </div>

      <div className="mt-8 pt-4 border-t border-blush-pink/20">
        <p className="font-serif text-dark-green italic">With love,</p>
        <p className="font-serif text-deep-rose font-medium mt-1">
          {bouquet.senderName}
        </p>
      </div>

      {bouquet.occasion && (
        <div className="mt-4 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-blush-pink/20 text-xs text-deep-rose">
            {bouquet.occasion}
          </span>
        </div>
      )}
    </div>
  );
}
