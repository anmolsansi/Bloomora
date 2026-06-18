"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBouquet } from "@/lib/store";
import { generatePositions } from "@/lib/arrangement";
import { BouquetCanvas } from "@/components/builder/BouquetCanvas";
import { ArrangementControls } from "@/components/builder/ArrangementControls";
import { Button } from "@/components/ui/Button";

export default function ArrangePage() {
  const router = useRouter();
  const { state, dispatch } = useBouquet();

  useEffect(() => {
    if (state.selectedFlowers.length === 0) {
      router.replace("/create/flowers");
      return;
    }

    if (state.arrangement.positions.length === 0) {
      const positions = generatePositions(
        state.selectedFlowers,
        state.arrangement.bouquetShape,
        state.arrangement.fullness
      );
      dispatch({
        type: "SET_ARRANGEMENT",
        arrangement: { ...state.arrangement, positions },
      });
    }
    // Only run on mount to auto-generate initial arrangement
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRandomize = () => {
    const positions = generatePositions(
      state.selectedFlowers,
      state.arrangement.bouquetShape,
      state.arrangement.fullness
    );
    dispatch({
      type: "SET_ARRANGEMENT",
      arrangement: { ...state.arrangement, positions },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-dark-green mb-2">
            Arrange Your Bouquet
          </h1>
          <p className="text-soft-gray">
            Adjust the style and try different arrangements
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <BouquetCanvas />
          </div>

          <div className="lg:col-span-1">
            <ArrangementControls />
            <Button
              onClick={handleRandomize}
              variant="secondary"
              className="w-full mt-4"
            >
              Try New Arrangement
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center mt-8">
          <Button variant="ghost" onClick={() => router.push("/create/flowers")}>
            Back
          </Button>
          <Button onClick={() => router.push("/create/customize")}>
            Continue to Style
          </Button>
        </div>
      </div>
    </div>
  );
}
