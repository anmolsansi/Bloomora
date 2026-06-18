"use client";

import Image from "next/image";
import { useBouquet } from "@/lib/store";
import { cn } from "@/lib/utils";

const backgroundClassMap: Record<string, string> = {
  warm_cream: "from-cream to-blush-pink/10",
  soft_blush: "from-pink-50 to-pink-100",
  sage_garden: "from-sage-green/10 to-sage-green/5",
  twilight: "from-purple-50 to-blue-50",
};

const wrapperClassMap: Record<string, { base: string; inner: string }> = {
  soft_pink: {
    base: "bg-blush-pink/30 rounded-t-full",
    inner: "bg-blush-pink/50 rounded-t-full",
  },
  kraft: {
    base: "bg-warm-brown/20 rounded-t-full",
    inner: "bg-warm-brown/30 rounded-t-full",
  },
  white_satin: {
    base: "bg-white/80 border border-blush-pink/20 rounded-t-full",
    inner: "bg-white rounded-t-full",
  },
  garden_green: {
    base: "bg-sage-green/20 rounded-t-full",
    inner: "bg-sage-green/30 rounded-t-full",
  },
};

const ribbonClassMap: Record<string, string> = {
  rose: "bg-deep-rose",
  cream: "bg-cream border border-warm-brown/20",
  sage: "bg-sage-green",
  gold: "bg-yellow-500",
  lavender: "bg-purple-300",
  navy: "bg-blue-900",
};

export function BouquetCanvas() {
  const { state } = useBouquet();
  const { arrangement, selectedFlowers, style } = state;

  const bgClass = backgroundClassMap[style.background] || backgroundClassMap.warm_cream;
  const wrapper = wrapperClassMap[style.wrapper] || wrapperClassMap.kraft;
  const ribbonClass = ribbonClassMap[style.ribbon] || ribbonClassMap.rose;

  return (
    <div className="relative bg-white rounded-2xl border border-blush-pink/20 overflow-hidden aspect-square max-w-lg mx-auto">
      {/* Background */}
      <div className={cn("absolute inset-0 bg-gradient-to-b", bgClass)} />

      {/* Wrapping paper base */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2">
        <div className={cn("absolute inset-0", wrapper.base)} />
        <div className={cn("absolute inset-x-4 bottom-0 h-1/2", wrapper.inner)} />
      </div>

      {/* Greenery layer */}
      {arrangement.greeneryStyle === "soft_garden" && (
        <div className="absolute bottom-[40%] left-1/2 -translate-x-1/2 w-3/4 h-1/3 opacity-40">
          <Image src="/flowers/lavender.svg" alt="" fill className="object-contain" />
        </div>
      )}
      {arrangement.greeneryStyle === "trailing" && (
        <div className="absolute bottom-[35%] left-1/2 -translate-x-1/2 w-full h-1/4 opacity-30">
          <Image src="/flowers/babys_breath.svg" alt="" fill className="object-contain" />
        </div>
      )}
      {arrangement.greeneryStyle === "wild" && (
        <div className="absolute bottom-[38%] left-1/2 -translate-x-1/2 w-5/6 h-1/3 opacity-35">
          <Image src="/flowers/jasmine.svg" alt="" fill className="object-contain" />
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
        <div className={cn("w-full h-full rounded-full shadow-sm", ribbonClass)} />
        <div className={cn("absolute -right-2 top-1/2 -translate-y-1/2 w-6 h-8 rounded-b-full opacity-80", ribbonClass)} />
        <div className={cn("absolute -left-2 top-1/2 -translate-y-1/2 w-6 h-8 rounded-b-full opacity-80", ribbonClass)} />
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
            <p>Generating your arrangement...</p>
          </div>
        </div>
      )}
    </div>
  );
}
