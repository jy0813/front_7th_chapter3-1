import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const textareaVariants = cva(
  // 기본 스타일: textarea-base + typo-textarea 유틸리티
  "textarea-base typo-textarea focus-ring focus:textarea-focus focus-visible:focus-ring-visible aria-invalid:textarea-error disabled:textarea-disabled",
  {
    variants: {
      fieldWidth: {
        // field-width-* 유틸리티 사용 (Input, Select, Textarea 공통)
        sm: "field-width-sm",
        md: "field-width-md",
        lg: "field-width-lg",
        full: "field-width-full",
      },
    },
    defaultVariants: {
      fieldWidth: "full",
    },
  }
)

function Textarea({
  className,
  fieldWidth,
  ...props
}: React.ComponentProps<"textarea"> & VariantProps<typeof textareaVariants>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(textareaVariants({ fieldWidth }), className)}
      {...props}
    />
  )
}

export { Textarea, textareaVariants }
