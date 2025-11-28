import * as React from 'react';
import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { Button } from '@/components/inputs/button';

export type HeaderProps = React.HTMLAttributes<HTMLElement>;

function Header({ className, children, ...props }: HeaderProps) {
  return (
    <header
      data-slot="header"
      className={cn('header-base', className)}
      {...props}
    >
      {children}
    </header>
  );
}

export type HeaderContainerProps = React.HTMLAttributes<HTMLDivElement>;

function HeaderContainer({
  className,
  children,
  ...props
}: HeaderContainerProps) {
  return (
    <div
      data-slot="header-container"
      className={cn('header-container', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export type HeaderSectionProps = React.HTMLAttributes<HTMLDivElement>;

function HeaderSection({ className, children, ...props }: HeaderSectionProps) {
  return (
    <div
      data-slot="header-section"
      className={cn('header-section', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export type HeaderLogoProps = React.HTMLAttributes<HTMLDivElement>;

function HeaderLogo({ className, children, ...props }: HeaderLogoProps) {
  return (
    <div
      data-slot="header-logo"
      className={cn('header-logo', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export type HeaderTitleGroupProps = React.HTMLAttributes<HTMLDivElement>;

function HeaderTitleGroup({
  className,
  children,
  ...props
}: HeaderTitleGroupProps) {
  return (
    <div data-slot="header-title-group" className={className} {...props}>
      {children}
    </div>
  );
}

export type HeaderTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

function HeaderTitle({ className, children, ...props }: HeaderTitleProps) {
  return (
    <h1
      data-slot="header-title"
      className={cn('typo-header-title', className)}
      {...props}
    >
      {children}
    </h1>
  );
}

export type HeaderSubtitleProps = React.HTMLAttributes<HTMLParagraphElement>;

function HeaderSubtitle({
  className,
  children,
  ...props
}: HeaderSubtitleProps) {
  return (
    <p
      data-slot="header-subtitle"
      className={cn('typo-header-subtitle', className)}
      {...props}
    >
      {children}
    </p>
  );
}

export type HeaderUserSectionProps = React.HTMLAttributes<HTMLDivElement>;

function HeaderUserSection({
  className,
  children,
  ...props
}: HeaderUserSectionProps) {
  return (
    <div
      data-slot="header-user-section"
      className={cn('header-user-section', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export type HeaderUserInfoProps = React.HTMLAttributes<HTMLDivElement>;

function HeaderUserInfo({
  className,
  children,
  ...props
}: HeaderUserInfoProps) {
  return (
    <div
      data-slot="header-user-info"
      className={cn('header-user-info', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export type HeaderUserNameProps = React.HTMLAttributes<HTMLDivElement>;

function HeaderUserName({
  className,
  children,
  ...props
}: HeaderUserNameProps) {
  return (
    <div
      data-slot="header-user-name"
      className={cn('typo-header-user-name', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export type HeaderUserEmailProps = React.HTMLAttributes<HTMLDivElement>;

function HeaderUserEmail({
  className,
  children,
  ...props
}: HeaderUserEmailProps) {
  return (
    <div
      data-slot="header-user-email"
      className={cn('typo-header-user-email', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export type HeaderAvatarProps = React.HTMLAttributes<HTMLDivElement>;

function HeaderAvatar({ className, children, ...props }: HeaderAvatarProps) {
  return (
    <div
      data-slot="header-avatar"
      className={cn('header-avatar', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export type HeaderThemeToggleProps = Omit<
  React.ComponentProps<typeof Button>,
  'children'
>;

function HeaderThemeToggle({ className, ...props }: HeaderThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      data-slot="header-theme-toggle"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={className}
      {...props}
    >
      {theme === 'light' ? (
        <Moon className="size-5" />
      ) : (
        <Sun className="size-5" />
      )}
    </Button>
  );
}

export {
  Header,
  HeaderContainer,
  HeaderSection,
  HeaderLogo,
  HeaderTitleGroup,
  HeaderTitle,
  HeaderSubtitle,
  HeaderUserSection,
  HeaderUserInfo,
  HeaderUserName,
  HeaderUserEmail,
  HeaderAvatar,
  HeaderThemeToggle,
};
