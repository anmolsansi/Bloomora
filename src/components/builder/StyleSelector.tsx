"use client";

import { cn } from "@/lib/utils";

interface StyleOption<T extends string = string> {
  id: T;
  label: string;
  color?: string;
}

interface StyleSelectorProps<T extends string = string> {
  label: string;
  options: readonly StyleOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function StyleSelector<T extends string>({
  label,
  options,
  value,
  onChange,
}: StyleSelectorProps<T>) {
  return (
    <div>
      <h3 className="text-sm font-medium text-dark-green mb-3">{label}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors",
              value === option.id
                ? "bg-sage-green text-cream"
                : "bg-blush-pink/10 text-dark-green hover:bg-blush-pink/20"
            )}
          >
            {option.color && (
              <span
                className={cn("w-4 h-4 rounded-full", option.color)}
              />
            )}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
