import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0", // Removed [&_svg]:pointer-events-none as it can be handled by parent if needed
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm", // Added shadow-sm
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm", // Added shadow-sm
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm", // Added shadow-sm
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        subtle: "bg-muted text-muted-foreground hover:bg-muted/80", // New subtle variant
        success: "bg-green-600 text-white hover:bg-green-600/90 shadow-sm", // New success variant
        warning: "bg-amber-500 text-white hover:bg-amber-500/90 shadow-sm", // New warning variant
      },
      size: {
        default: "h-9 px-4 py-2", // Adjusted height to h-9 for default
        xs: "h-7 rounded-md px-2 text-xs", // New xs size
        sm: "h-8 rounded-md px-3", // Adjusted height to h-8 for sm
        lg: "h-10 rounded-md px-8", // Adjusted height to h-10 for lg
        icon: "h-9 w-9", // Adjusted icon size to h-9 w-9
        icon_sm: "h-8 w-8 [&_svg]:size-3.5", // New small icon size
        icon_xs: "h-7 w-7 [&_svg]:size-3", // New extra small icon size
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
