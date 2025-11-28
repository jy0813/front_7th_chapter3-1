import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // 기본 스타일: btn-base 유틸리티 + 추가 Tailwind 클래스
  "btn-base typo-btn-md focus-ring focus-visible:focus-ring-visible [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // btn-* 유틸리티 사용
        primary: 'btn-primary hover:btn-primary-hover',
        destructive: 'btn-destructive hover:btn-destructive-hover',
        secondary: 'btn-secondary hover:btn-secondary-hover',
        success: 'btn-success hover:btn-success-hover',
        outline: 'btn-outline hover:btn-outline-hover',
        ghost: 'btn-ghost hover:btn-ghost-hover',
        link: 'btn-link hover:btn-link-hover',
      },
      size: {
        // 레거시 호환: padding-btn-* + typo-btn-* 유틸리티 사용
        sm: 'padding-btn-sm typo-btn-sm',
        md: 'padding-btn-md typo-btn-md',
        lg: 'padding-btn-lg typo-btn-lg',
        // 아이콘 버튼 (Tailwind 기반)
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
      fullWidth: {
        true: 'btn-fullwidth',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

function Button({
  className,
  variant,
  size,
  fullWidth,
  asChild = false,
  disabled,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      disabled={disabled}
      className={cn(
        buttonVariants({ variant, size, fullWidth, className }),
        disabled && 'btn-disabled',
      )}
      {...props}
    />
  );
}

export { Button };
