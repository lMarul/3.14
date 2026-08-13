import * as React from "react";
import { cn } from "./utils";

interface InputProps extends React.ComponentProps<"input"> {
  label?: string;
}

function Input({ className, type, label, id, ...props }: InputProps) {
  // Generate a random ID if none is provided, to link label and input
  const generatedId = React.useId();
  const inputId = id || generatedId;

  if (label) {
    return (
      <div className="relative group">
        <input
          type={type}
          id={inputId}
          placeholder=" "
          data-slot="input"
          className={cn(
            "peer file:text-foreground text-[#1a1a1a] placeholder:text-transparent selection:bg-[#8a181a]/20 selection:text-[#8a181a] border-gray-200 focus:border-[#8a181a] flex h-14 w-full min-w-0 rounded-xl border px-4 pt-4 pb-1 text-base bg-white transition-all duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm shadow-sm focus:shadow-md focus:ring-1 focus:ring-[#8a181a]/10",
            className
          )}
          {...props}
        />
        <label
          htmlFor={inputId}
          className="absolute left-4 top-4 text-gray-500 text-base transition-all duration-200 -translate-y-0 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-3 peer-focus:text-xs peer-focus:text-[#8a181a] peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:text-xs pointer-events-none"
        >
          {label}
        </label>
      </div>
    );
  }

  return (
    <input
      type={type}
      id={id}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input flex h-12 w-full min-w-0 rounded-xl border px-4 py-2 text-base bg-white transition-all duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-[#8a181a] focus-visible:ring-1 focus-visible:ring-[#8a181a]/20 shadow-sm focus:shadow-md",
        className
      )}
      {...props}
    />
  );
}

export { Input };
