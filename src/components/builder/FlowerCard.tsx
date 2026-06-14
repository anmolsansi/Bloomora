"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { Flower } from "@/types/bouquet";

interface FlowerCardProps {
  flower: Flower;
  count: number;
  onSelect: () => void;
  disabled?: boolean;
}

export function FlowerCard({
  flower,
  count,
  onSelect,
  disabled,
}: FlowerCardProps) {
  const isSelected = count > 0;

  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        "relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-200 hover:scale-105",
        isSelected
          ? "border-sage-green bg-sage-green/5 shadow-md"
          : "border-blush-pink/20 bg-white hover:border-blush-pink/40",
        disabled && "opacity-50 cursor-not-allowed hover:scale-100"
      )}
    >
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-sage-green text-cream rounded-full flex items-center justify-center text-xs font-bold">
          {count}
        </div>
      )}

      <div className="w-16 h-16 mb-2 relative">
        <Image
          src={`/flowers/${flower.id}.svg`}
          alt={flower.name}
          fill
          className="object-contain"
        />
      </div>

      <span className="text-sm font-medium text-dark-green text-center">
        {flower.name}
      </span>

      <Badge variant="secondary" className="mt-1 text-xs">
        {flower.category}
      </Badge>
    </button>
  );
}
