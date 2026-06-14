"use client";

import Image from "next/image";

interface RecipientBouquetProps {
  bouquet: {
    selectedFlowers: { flowerId: string; count: number; color: string }[];
    arrangementData: {
      positions: {
        flowerId: string;
        x: number;
        y: number;
        scale: number;
        rotation: number;
        layer: number;
      }[];
      greeneryStyle: string;
    };
    styleData: {
      wrapper: string;
      ribbon: string;
    };
  };
}

export function RecipientBouquet({ bouquet }: RecipientBouquetProps) {
  const { arrangementData, styleData } = bouquet;

  return (
    <div className="relative bg-white rounded-2xl border border-blush-pink/20 overflow-hidden aspect-square shadow-lg">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream to-blush-pink/10" />

      {/* Wrapping paper base */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2">
        <div className="absolute inset-0 bg-warm-brown/20 rounded-t-full" />
        <div className="absolute inset-x-4 bottom-0 h-1/2 bg-warm-brown/30 rounded-t-full" />
      </div>

      {/* Greenery layer */}
      {arrangementData.greeneryStyle === "soft_garden" && (
        <div className="absolute bottom-[40%] left-1/2 -translate-x-1/2 w-3/4 h-1/3 opacity-40">
          <Image src="/flowers/lavender.svg" alt="" fill className="object-contain" />
        </div>
      )}

      {/* Flowers */}
      {arrangementData.positions.map((pos, index) => (
        <div
          key={`${pos.flowerId}-${index}`}
          className="absolute w-20 h-20"
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
      ))}

      {/* Ribbon */}
      <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 w-16 h-4">
        <div className="w-full h-full bg-deep-rose rounded-full shadow-sm" />
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-6 h-8 bg-deep-rose/80 rounded-b-full" />
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-6 h-8 bg-deep-rose/80 rounded-b-full" />
      </div>
    </div>
  );
}
