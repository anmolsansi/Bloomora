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
  disabled?: boolean;
  index?: number;
}

export function FlowerCard({
  flower,
  count,
  onSelect,
  disabled,
  index = 0,
}: FlowerCardProps) {
  const isSelected = count > 0;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        "relative flex flex-col items-center p-4 rounded-2xl border-2 transition-colors",
        isSelected
          ? "border-sage-green bg-sage-green/5 shadow-md"
          : "border-blush-pink/20 bg-white hover:border-blush-pink/40",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-sage-green text-cream rounded-full flex items-center justify-center text-xs font-bold"
        >
          {count}
        </motion.div>
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
    </motion.button>
  );
}
