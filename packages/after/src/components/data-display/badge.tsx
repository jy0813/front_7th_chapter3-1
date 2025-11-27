import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  // 기본 스타일: badge-base 유틸리티 + 추가 스타일
  "badge-base typo-badge-md focus-ring focus-visible:focus-ring-visible transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        // 레거시 호환: badge-* 유틸리티 사용
        primary: "badge-primary",
        secondary: "badge-secondary",
        success: "badge-success",
        destructive: "badge-destructive",
        warning: "badge-warning",
        info: "badge-info",
        // outline variant (Tailwind 기반)
        outline: "border border-border text-foreground",
      },
      size: {
        // 레거시 호환: padding-badge-* + typo-badge-* 유틸리티 사용
        sm: "padding-badge-sm typo-badge-sm",
        md: "padding-badge-md typo-badge-md",
        lg: "padding-badge-lg typo-badge-lg",
      },
      pill: {
        true: "badge-pill",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

function Badge({
  className,
  variant,
  size,
  pill,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size, pill }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
