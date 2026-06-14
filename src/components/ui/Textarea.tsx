import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  characterCount?: number;
  maxCharacters?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, characterCount, maxCharacters, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-dark-green mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            "flex min-h-[120px] w-full rounded-xl border border-blush-pink/30 bg-white px-4 py-3 text-base text-dark-green placeholder:text-soft-gray/60 focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green transition-colors resize-none",
            error && "border-deep-rose focus:ring-deep-rose/50",
            className
          )}
          ref={ref}
          {...props}
        />
        <div className="flex justify-between items-center mt-1">
          {error && <p className="text-sm text-deep-rose">{error}</p>}
          {maxCharacters && (
            <p
              className={cn(
                "text-sm ml-auto",
                characterCount && characterCount > maxCharacters
                  ? "text-deep-rose"
                  : "text-soft-gray"
              )}
            >
              {characterCount || 0}/{maxCharacters}
            </p>
          )}
        </div>
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
