import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-dark-green mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            "flex h-11 w-full rounded-xl border border-blush-pink/30 bg-white px-4 py-2 text-base text-dark-green placeholder:text-soft-gray/60 focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green transition-colors",
            error && "border-deep-rose focus:ring-deep-rose/50",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-deep-rose">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
