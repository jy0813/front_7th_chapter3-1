import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const inputVariants = cva(
  // 기본 스타일: input-base + typo-input 유틸리티
  'input-base typo-input focus-ring focus:input-focus focus-visible:focus-ring-visible aria-invalid:input-error disabled:input-disabled',
  {
    variants: {
      fieldWidth: {
        // field-width-* 유틸리티 사용 (Input, Select, Textarea 공통)
        sm: 'field-width-sm',
        md: 'field-width-md',
        lg: 'field-width-lg',
        full: 'field-width-full',
      },
    },
    defaultVariants: {
      fieldWidth: 'sm',
    },
  },
);

function Input({
  className,
  type,
  fieldWidth,
  ...props
}: React.ComponentProps<'input'> & VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ fieldWidth }), className)}
      {...props}
    />
  );
}

export { Input, inputVariants };
