import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  // "accent" buttons carry white text, so they use --accent-action (#B4451A), not the
  // brighter decorative --accent (#E8612C), which is not a reliable text-safe background.
  accent: 'bg-accent-action text-accent-action-foreground hover:bg-accent-action/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline: 'border border-input bg-surface text-foreground hover:bg-muted',
  ghost: 'text-foreground hover:bg-muted',
};

const sizes: Record<Size, string> = {
  // Restrained corners: buttons round at ~4px (rounded-sm), cards at ~6px (rounded-md).
  sm: 'h-9 rounded-sm px-3 text-sm',
  md: 'h-10 rounded-sm px-4 text-sm',
  lg: 'h-12 rounded-sm px-6 text-base',
};

/** Class string for the button styling - use on `<Link>` and other elements too. */
export function buttonClasses(variant: Variant = 'primary', size: Size = 'md', className?: string): string {
  return cn(base, variants[variant], sizes[size], className);
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, type = 'button', ...props }, ref) => (
    <button ref={ref} type={type} className={buttonClasses(variant, size, className)} {...props} />
  ),
);
Button.displayName = 'Button';
