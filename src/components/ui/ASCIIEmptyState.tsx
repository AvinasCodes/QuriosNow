import { cn } from '@/lib/utils';
import { EMPTY_STATE_ASCII } from '@/constants';

/* ============================================================
   ASCIIEmptyState — Retro ASCII art empty state display
   ============================================================ */

interface ASCIIEmptyStateProps {
  className?: string;
  /** Custom ASCII art to display */
  art?: string;
  /** Additional message below the art */
  message?: string;
}

export function ASCIIEmptyState({
  className,
  art = EMPTY_STATE_ASCII,
  message,
}: ASCIIEmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 select-none',
        className
      )}
    >
      <pre
        className={cn(
          'font-mono text-xs leading-snug text-crt-green glow-green',
          'whitespace-pre text-center'
        )}
      >
        {art}
      </pre>
      {message && (
        <p className="mt-6 font-mono text-sm text-crt-muted animate-glow-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
