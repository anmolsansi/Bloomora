"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBouquet } from "@/lib/store";
import { StyleSelector } from "@/components/builder/StyleSelector";
import { BouquetCanvas } from "@/components/builder/BouquetCanvas";
import { Button } from "@/components/ui/Button";

const wrapperOptions = [
  { id: "soft_pink", label: "Soft Pink", color: "bg-blush-pink" },
  { id: "kraft", label: "Kraft Brown", color: "bg-warm-brown" },
  { id: "white_satin", label: "White Satin", color: "bg-white border" },
  { id: "garden_green", label: "Garden Green", color: "bg-sage-green" },
] as const;

const ribbonOptions = [
  { id: "rose", label: "Rose", color: "bg-deep-rose" },
  { id: "cream", label: "Cream", color: "bg-cream border" },
  { id: "sage", label: "Sage", color: "bg-sage-green" },
  { id: "gold", label: "Gold", color: "bg-yellow-500" },
  { id: "lavender", label: "Lavender", color: "bg-purple-300" },
  { id: "navy", label: "Navy", color: "bg-blue-900" },
] as const;

const backgroundOptions = [
  { id: "warm_cream", label: "Warm Cream", color: "bg-cream" },
  { id: "soft_blush", label: "Soft Blush", color: "bg-blush-pink/30" },
  { id: "sage_garden", label: "Sage Garden", color: "bg-sage-green/20" },
  { id: "twilight", label: "Twilight", color: "bg-blue-100" },
] as const;

const cardStyleOptions = [
  { id: "floral_border", label: "Floral Border" },
  { id: "minimal", label: "Minimal" },
  { id: "vintage", label: "Vintage" },
  { id: "modern", label: "Modern" },
] as const;

export default function CustomizePage() {
  const router = useRouter();
  const { state, dispatch } = useBouquet();

  useEffect(() => {
    if (state.arrangement.positions.length === 0) {
      router.replace("/create/arrange");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStyle = (updates: Partial<typeof state.style>) => {
    dispatch({ type: "SET_STYLE", style: { ...state.style, ...updates } });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-dark-green mb-2">
            Customize Your Bouquet
          </h1>
          <p className="text-soft-gray">
            Choose wrapping, ribbon, and background styles
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <BouquetCanvas />
          </div>

          <div className="lg:col-span-1 space-y-6">
            <StyleSelector
              label="Wrapping Paper"
              options={wrapperOptions}
              value={state.style.wrapper}
              onChange={(v) => updateStyle({ wrapper: v })}
            />

            <StyleSelector
              label="Ribbon Color"
              options={ribbonOptions}
              value={state.style.ribbon}
              onChange={(v) => updateStyle({ ribbon: v })}
            />

            <StyleSelector
              label="Background"
              options={backgroundOptions}
              value={state.style.background}
              onChange={(v) => updateStyle({ background: v })}
            />

            <StyleSelector
              label="Card Style"
              options={cardStyleOptions}
              value={state.style.cardStyle}
              onChange={(v) => updateStyle({ cardStyle: v })}
            />
          </div>
        </div>

        <div className="flex justify-between items-center mt-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/create/arrange")}
          >
            Back
          </Button>
          <Button onClick={() => router.push("/create/message")}>
            Continue to Message
          </Button>
        </div>
      </div>
    </div>
  );
}
