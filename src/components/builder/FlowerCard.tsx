"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { Flower } from "@/types/bouquet";

interface FlowerCardProps {
  flower: Flower;
  count: number;
  onSelect: () => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
  disabled?: boolean;
  index?: number;
}

export function FlowerCard({
  flower,
  count,
  onSelect,
  onIncrement,
  onDecrement,
  disabled,
  index = 0,
}: FlowerCardProps) {
  const isSelected = count > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      className={cn(
        "relative flex flex-col items-center p-4 rounded-2xl border-2 transition-colors",
        isSelected
          ? "border-sage-green bg-sage-green/5 shadow-md"
          : "border-blush-pink/20 bg-white hover:border-blush-pink/40",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {isSelected && onIncrement && onDecrement && (
        <div className="absolute -top-2 -right-2 flex items-center gap-0.5 bg-sage-green text-cream rounded-full">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDecrement();
            }}
            className="w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-sage-green/80 rounded-full transition-colors"
            aria-label={`Decrease ${flower.name} quantity`}
          >
            -
          </button>
          <span className="w-5 text-center text-xs font-bold">{count}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onIncrement();
            }}
            className="w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-sage-green/80 rounded-full transition-colors"
            aria-label={`Increase ${flower.name} quantity`}
          >
            +
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={onSelect}
        disabled={disabled}
        className="flex flex-col items-center w-full"
      >
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
    </motion.div>
  );
}
