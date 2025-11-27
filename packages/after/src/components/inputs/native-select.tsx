import * as React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// wrapper용 CVA - field-width-* 유틸리티로 너비 제어
const nativeSelectWrapperVariants = cva(
  'group/native-select has-[select:disabled]:opacity-disabled relative inline-flex',
  {
    variants: {
      fieldWidth: {
        sm: 'field-width-sm',
        md: 'field-width-md',
        lg: 'field-width-lg',
        full: 'field-width-full',
      },
    },
    defaultVariants: {
      fieldWidth: 'full',
    },
  },
);

// select 요소용 CVA - 너비는 항상 100%로 wrapper를 채움
const nativeSelectVariants = cva(
  'select-base typo-input focus-ring focus:input-focus focus-visible:focus-ring-visible aria-invalid:input-error disabled:input-disabled w-full pr-9',
);

function NativeSelect({
  className,
  fieldWidth = 'full',
  ...props
}: React.ComponentProps<'select'> &
  VariantProps<typeof nativeSelectWrapperVariants>) {
  return (
    <div
      className={cn(nativeSelectWrapperVariants({ fieldWidth }))}
      data-slot="native-select-wrapper"
    >
      <select
        data-slot="native-select"
        className={cn(nativeSelectVariants(), className)}
        {...props}
      />
      <ChevronDownIcon
        className="text-foreground pointer-events-none absolute top-1/2 right-2.5 size-5 -translate-y-1/2 opacity-70 select-none"
        aria-hidden="true"
        data-slot="native-select-icon"
      />
    </div>
  );
}

function NativeSelectOption({ ...props }: React.ComponentProps<'option'>) {
  return <option data-slot="native-select-option" {...props} />;
}

function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<'optgroup'>) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn(className)}
      {...props}
    />
  );
}

export {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
  nativeSelectVariants,
};
