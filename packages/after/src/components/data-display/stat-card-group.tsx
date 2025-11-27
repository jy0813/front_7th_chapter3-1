import * as React from "react"

import { cn } from "@/lib/utils"

export interface StatCardGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {}

function StatCardGroup({
  className,
  children,
  ...props
}: StatCardGroupProps) {
  return (
    <div
      data-slot="stat-card-group"
      className={cn("stat-card-group", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { StatCardGroup }
