"use client";

import Image from "next/image";
import { useBouquet } from "@/lib/store";

export function BouquetCanvas() {
  const { state } = useBouquet();
  const { arrangement, selectedFlowers } = state;

  return (
    <div className="relative bg-white rounded-2xl border border-blush-pink/20 overflow-hidden aspect-square max-w-lg mx-auto">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream to-blush-pink/10" />

      {/* Wrapping paper base */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2">
        <div className="absolute inset-0 bg-warm-brown/20 rounded-t-full" />
        <div className="absolute inset-x-4 bottom-0 h-1/2 bg-warm-brown/30 rounded-t-full" />
      </div>

      {/* Greenery layer */}
      {arrangement.greeneryStyle === "soft_garden" && (
        <div className="absolute bottom-[40%] left-1/2 -translate-x-1/2 w-3/4 h-1/3 opacity-40">
          <Image src="/flowers/lavender.svg" alt="" fill className="object-contain" />
        </div>
      )}

      {/* Flowers */}
      {arrangement.positions.map((pos, index) => {
        const flower = selectedFlowers.find(
          (f) => f.flowerId === pos.flowerId
        );
        if (!flower) return null;

        return (
          <div
            key={`${pos.flowerId}-${index}`}
            className="absolute w-20 h-20 transition-transform duration-300"
            style={{
              left: pos.x,
              top: pos.y,
              transform: `rotate(${pos.rotation}deg) scale(${pos.scale})`,
              zIndex: pos.layer,
            }}
          >
            <Image
              src={`/flowers/${pos.flowerId}.svg`}
              alt=""
              fill
              className="object-contain drop-shadow-md"
            />
          </div>
        );
      })}

      {/* Ribbon */}
      <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 w-16 h-4">
        <div className="w-full h-full bg-deep-rose rounded-full shadow-sm" />
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-6 h-8 bg-deep-rose/80 rounded-b-full" />
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-6 h-8 bg-deep-rose/80 rounded-b-full" />
      </div>

      {/* Empty state */}
      {arrangement.positions.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-soft-gray">
            <svg
              className="w-16 h-16 mx-auto mb-4 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <p>Click &quot;Try New Arrangement&quot; to generate</p>
          </div>
        </div>
      )}
    </div>
  );
}
