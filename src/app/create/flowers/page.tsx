"use client";

import { useRouter } from "next/navigation";
import { useBouquet } from "@/lib/store";
import { flowers } from "@/lib/flowers";
import { FlowerCard } from "@/components/builder/FlowerCard";
import { Button } from "@/components/ui/Button";

const MIN_FLOWERS = 6;
const MAX_FLOWERS = 15;

export default function FlowersPage() {
  const router = useRouter();
  const { state, dispatch, totalFlowers } = useBouquet();

  const handleSelectFlower = (flowerId: string) => {
    const existing = state.selectedFlowers.find(
      (f) => f.flowerId === flowerId
    );

    if (existing) {
      if (existing.count > 1) {
        dispatch({
          type: "UPDATE_FLOWER_COUNT",
          flowerId,
          count: existing.count - 1,
        });
      } else {
        dispatch({ type: "REMOVE_FLOWER", flowerId });
      }
    } else {
      if (totalFlowers < MAX_FLOWERS) {
        const flower = flowers.find((f) => f.id === flowerId);
        if (flower) {
          dispatch({
            type: "SELECT_FLOWER",
            flower: {
              flowerId,
              count: 1,
              color: flower.colors[0],
            },
          });
        }
      }
    }
  };

  const getFlowerCount = (flowerId: string) => {
    const selected = state.selectedFlowers.find(
      (f) => f.flowerId === flowerId
    );
    return selected?.count || 0;
  };

  const canProceed = totalFlowers >= MIN_FLOWERS;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-dark-green mb-2">
            Choose Your Flowers
          </h1>
          <p className="text-soft-gray">
            Select {MIN_FLOWERS} to {MAX_FLOWERS} flowers for your bouquet
          </p>
          <div className="mt-4">
            <span className="text-2xl font-bold text-deep-rose">
              {totalFlowers}
            </span>
            <span className="text-soft-gray ml-2">
              / {MAX_FLOWERS} flowers selected
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          {flowers.map((flower) => (
            <FlowerCard
              key={flower.id}
              flower={flower}
              count={getFlowerCount(flower.id)}
              onSelect={() => handleSelectFlower(flower.id)}
              disabled={
                totalFlowers >= MAX_FLOWERS && getFlowerCount(flower.id) === 0
              }
            />
          ))}
        </div>

        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={() => router.push("/")}>
            Back
          </Button>
          <Button
            onClick={() => router.push("/create/arrange")}
            disabled={!canProceed}
          >
            Continue to Arrange
          </Button>
        </div>
      </div>
    </div>
  );
}
