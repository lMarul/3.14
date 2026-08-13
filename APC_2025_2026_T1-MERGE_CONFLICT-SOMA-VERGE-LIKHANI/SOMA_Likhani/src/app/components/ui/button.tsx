import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[0.75rem] text-sm font-semibold transition-all duration-300 ease-out outline-none disabled:pointer-events-none disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-[#8a181a] text-white shadow-md hover:-translate-y-[2px] hover:shadow-lg active:scale-[0.98] active:shadow-sm active:translate-y-0",
        destructive:
          "bg-destructive text-white shadow-md hover:-translate-y-[2px] hover:shadow-lg active:scale-[0.98] active:shadow-sm active:translate-y-0",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:-translate-y-[2px] hover:shadow-md active:scale-[0.98] active:shadow-sm active:translate-y-0",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:-translate-y-[2px] hover:shadow-md active:scale-[0.98] active:shadow-sm active:translate-y-0",
        ghost: "hover:bg-accent hover:text-accent-foreground active:scale-[0.98]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 py-3 has-[>svg]:px-4",
        sm: "h-10 rounded-[0.5rem] px-4 has-[>svg]:px-3",
        lg: "h-14 rounded-[1rem] px-8 text-base has-[>svg]:px-6",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
