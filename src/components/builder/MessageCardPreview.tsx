"use client";

import { useBouquet } from "@/lib/store";
import { cn } from "@/lib/utils";

const cardStyles = {
  floral_border: "border-4 border-double border-blush-pink",
  minimal: "border border-blush-pink/30",
  vintage: "border-2 border-warm-brown/30 bg-cream/50",
  modern: "border-l-4 border-sage-green",
};

export function MessageCardPreview() {
  const { state } = useBouquet();
  const { message, style } = state;

  return (
    <div
      className={cn(
        "rounded-2xl bg-white p-8 shadow-sm min-h-[300px] flex flex-col",
        cardStyles[style.cardStyle]
      )}
    >
      <div className="flex-1">
        {message.recipientName && (
          <p className="text-lg font-serif text-dark-green mb-4">
            Dear {message.recipientName},
          </p>
        )}

        <p className="text-soft-gray leading-relaxed whitespace-pre-wrap">
          {message.message || "Your message will appear here..."}
        </p>
      </div>

      {message.senderName && (
        <div className="mt-8 pt-4 border-t border-blush-pink/20">
          <p className="font-serif text-dark-green italic">
            With love,
          </p>
          <p className="font-serif text-deep-rose font-medium mt-1">
            {message.senderName}
          </p>
        </div>
      )}

      {message.occasion && (
        <div className="mt-4 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-blush-pink/20 text-xs text-deep-rose">
            {message.occasion}
          </span>
        </div>
      )}
    </div>
  );
}
