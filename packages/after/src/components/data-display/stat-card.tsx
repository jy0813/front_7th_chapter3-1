import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const statCardVariants = cva(
  "stat-card-base",
  {
    variants: {
      variant: {
        primary: "stat-card-primary",
        success: "stat-card-success",
        warning: "stat-card-warning",
        destructive: "stat-card-destructive",
        neutral: "stat-card-neutral",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
)

const statValueVariants = cva(
  "typo-stat-value",
  {
    variants: {
      variant: {
        primary: "stat-value-primary",
        success: "stat-value-success",
        warning: "stat-value-warning",
        destructive: "stat-value-destructive",
        neutral: "stat-value-neutral",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
)

export interface StatCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statCardVariants> {
  label: string
  value: string | number
}

function StatCard({
  className,
  variant,
  label,
  value,
  ...props
}: StatCardProps) {
  return (
    <div
      data-slot="stat-card"
      className={cn(statCardVariants({ variant, className }))}
      {...props}
    >
      <div className="typo-stat-label">{label}</div>
      <div className={cn(statValueVariants({ variant }))}>{value}</div>
    </div>
  )
}

export { StatCard, statCardVariants }
