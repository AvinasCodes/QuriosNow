import { cn } from '@/lib/utils';

/* ============================================================
   RetroProgressBar — ASCII-style progress indicator
   ============================================================ */

interface RetroProgressBarProps {
  /** Progress value 0-100 */
  value: number;
  /** Width in characters (for ASCII style) */
  width?: number;
  className?: string;
  label?: string;
}

export function RetroProgressBar({
  value,
  width = 30,
  className,
  label,
}: RetroProgressBarProps) {
  const filled = Math.round((value / 100) * width);
  const empty = width - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);

  return (
    <div className={cn('font-mono text-xs', className)}>
      {label && (
        <div className="text-crt-muted mb-1">{label}</div>
      )}
      <div className="flex items-center gap-2">
        <span className="text-crt-green glow-green">
          [{bar}]
        </span>
        <span className="text-crt-amber w-10 text-right">
          {Math.round(value)}%
        </span>
      </div>
    </div>
  );
}
