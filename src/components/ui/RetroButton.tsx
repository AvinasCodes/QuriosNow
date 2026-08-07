import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/* ============================================================
   RetroButton — Raised button with glow hover
   ============================================================ */

type ButtonVariant = 'green' | 'blue' | 'amber' | 'danger' | 'filled-green' | 'ghost';
type ButtonSize = 'sm' | 'md';

interface RetroButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  icon?: ReactNode;
}

export function RetroButton({
  variant = 'green',
  size = 'md',
  children,
  icon,
  className,
  ...props
}: RetroButtonProps) {
  return (
    <button
      className={cn(
        'retro-btn',
        `retro-btn--${variant}`,
        size === 'sm' && 'retro-btn--sm',
        className
      )}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
