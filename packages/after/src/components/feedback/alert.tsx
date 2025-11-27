import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Info, CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';
import { Button } from '@/components/inputs/button';

const alertVariants = cva('alert-base', {
  variants: {
    variant: {
      info: 'alert-info',
      success: 'alert-success',
      warning: 'alert-warning',
      error: 'alert-destructive',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
});

interface AlertProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof alertVariants> {
  title?: string;
  onClose?: () => void;
  showIcon?: boolean;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  title,
  onClose,
  showIcon = true,
  className,
  ...props
}) => {
  const getIcon = () => {
    const iconProps = { className: 'typo-alert-icon', strokeWidth: 1 };

    switch (variant) {
      case 'info':
        return <Info {...iconProps} />;
      case 'success':
        return <CheckCircle2 {...iconProps} />;
      case 'warning':
        return <AlertTriangle {...iconProps} />;
      case 'error':
        return <XCircle {...iconProps} />;
      default:
        return <Info {...iconProps} />;
    }
  };

  return (
    <div
      className={cn(alertVariants({ variant }), className)}
      role="alert"
      {...props}
    >
      {showIcon && <div className="shrink-0">{getIcon()}</div>}
      <div className="flex-1">
        {title && <div className="typo-alert-title">{title}</div>}
        <div className="typo-alert-body">{children}</div>
      </div>
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="ml-auto shrink-0"
          aria-label="Close alert"
        >
          <X className="size-5" strokeWidth={1} />
        </Button>
      )}
    </div>
  );
};
