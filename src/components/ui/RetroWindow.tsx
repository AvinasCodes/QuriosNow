import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/* ============================================================
   RetroWindow — OS-style panel with title bar & controls
   ============================================================ */

interface RetroWindowProps {
  title: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  /** Hide the window control dots */
  hideControls?: boolean;
  /** Extra element to render in the title bar (right side) */
  titleExtra?: ReactNode;
}

export function RetroWindow({
  title,
  children,
  className,
  bodyClassName,
  hideControls = false,
  titleExtra,
}: RetroWindowProps) {
  return (
    <div className={cn('retro-window animate-window-open', className)}>
      <div className="retro-window-titlebar">
        {!hideControls && (
          <div className="retro-window-controls">
            <span className="retro-window-dot retro-window-dot--red" />
            <span className="retro-window-dot retro-window-dot--yellow" />
            <span className="retro-window-dot retro-window-dot--green" />
          </div>
        )}
        <span className="flex-1">{title}</span>
        {titleExtra}
      </div>
      <div className={cn('retro-window-body', bodyClassName)}>
        {children}
      </div>
    </div>
  );
}
