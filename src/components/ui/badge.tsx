import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", // Changed rounded-full to rounded-md, adjusted padding
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        destructive_secondary: // New variant for destructive but less prominent
          "border-transparent bg-destructive/10 text-destructive hover:bg-destructive/20",
        outline: "text-foreground border-border", // Ensure outline uses border color
        outline_primary: // New variant for primary outline
          "text-primary border-primary/50 hover:bg-primary/10",
        outline_secondary: // New variant for secondary outline
          "text-secondary-foreground border-secondary hover:bg-secondary/20",
        subtle: // New subtle variant
          "border-transparent bg-muted text-muted-foreground hover:bg-muted/80",
        success: // New success variant
          "border-transparent bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20",
        warning: // New warning variant
          "border-transparent bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
