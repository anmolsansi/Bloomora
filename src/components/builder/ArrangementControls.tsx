"use client";

import { useBouquet } from "@/lib/store";
import { cn } from "@/lib/utils";

const styles = [
  { id: "romantic", label: "Romantic" },
  { id: "wild_garden", label: "Wild Garden" },
  { id: "classic", label: "Classic" },
  { id: "minimal", label: "Minimal" },
  { id: "bright", label: "Bright" },
  { id: "soft_pastel", label: "Soft Pastel" },
  { id: "elegant", label: "Elegant" },
] as const;

const greeneryStyles = [
  { id: "soft_garden", label: "Soft Garden" },
  { id: "trailing", label: "Trailing" },
  { id: "structured", label: "Structured" },
  { id: "wild", label: "Wild" },
] as const;

const shapes = [
  { id: "round", label: "Round" },
  { id: "cascading", label: "Cascading" },
  { id: "hand_tied", label: "Hand-tied" },
  { id: "presentation", label: "Presentation" },
] as const;

export function ArrangementControls() {
  const { state, dispatch } = useBouquet();

  const updateArrangement = (updates: Partial<typeof state.arrangement>) => {
    dispatch({
      type: "SET_ARRANGEMENT",
      arrangement: { ...state.arrangement, ...updates },
    });
  };

  return (
    <div className="space-y-6">
      {/* Style */}
      <div>
        <h3 className="text-sm font-medium text-dark-green mb-3">Style</h3>
        <div className="flex flex-wrap gap-2">
          {styles.map((style) => (
            <button
              key={style.id}
              onClick={() => updateArrangement({ style: style.id })}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm transition-colors",
                state.arrangement.style === style.id
                  ? "bg-sage-green text-cream"
                  : "bg-blush-pink/10 text-dark-green hover:bg-blush-pink/20"
              )}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {/* Shape */}
      <div>
        <h3 className="text-sm font-medium text-dark-green mb-3">Shape</h3>
        <div className="flex flex-wrap gap-2">
          {shapes.map((shape) => (
            <button
              key={shape.id}
              onClick={() => updateArrangement({ bouquetShape: shape.id })}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm transition-colors",
                state.arrangement.bouquetShape === shape.id
                  ? "bg-sage-green text-cream"
                  : "bg-blush-pink/10 text-dark-green hover:bg-blush-pink/20"
              )}
            >
              {shape.label}
            </button>
          ))}
        </div>
      </div>

      {/* Greenery */}
      <div>
        <h3 className="text-sm font-medium text-dark-green mb-3">Greenery</h3>
        <div className="flex flex-wrap gap-2">
          {greeneryStyles.map((g) => (
            <button
              key={g.id}
              onClick={() => updateArrangement({ greeneryStyle: g.id })}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm transition-colors",
                state.arrangement.greeneryStyle === g.id
                  ? "bg-sage-green text-cream"
                  : "bg-blush-pink/10 text-dark-green hover:bg-blush-pink/20"
              )}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fullness */}
      <div>
        <h3 className="text-sm font-medium text-dark-green mb-3">
          Fullness: {Math.round(state.arrangement.fullness * 100)}%
        </h3>
        <input
          type="range"
          min="0.3"
          max="1"
          step="0.1"
          value={state.arrangement.fullness}
          onChange={(e) =>
            updateArrangement({ fullness: parseFloat(e.target.value) })
          }
          className="w-full h-2 bg-blush-pink/20 rounded-lg appearance-none cursor-pointer accent-sage-green"
        />
      </div>
    </div>
  );
}
