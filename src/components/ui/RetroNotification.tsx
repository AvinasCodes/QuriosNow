import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import { VscClose } from 'react-icons/vsc';
import type { NotificationType } from '@/types';

/* ============================================================
   RetroNotification — CRT-styled popup notifications
   ============================================================ */

const typeConfig: Record<NotificationType, { border: string; glow: string; label: string; icon: string }> = {
  success: {
    border: 'border-[var(--crt-green)]',
    glow: 'box-glow-green',
    label: 'text-crt-green',
    icon: '✓',
  },
  warning: {
    border: 'border-[var(--crt-amber)]',
    glow: 'box-glow-amber',
    label: 'text-crt-amber',
    icon: '⚠',
  },
  error: {
    border: 'border-[var(--crt-danger)]',
    glow: '',
    label: 'text-crt-danger',
    icon: '✕',
  },
  info: {
    border: 'border-[var(--crt-blue)]',
    glow: 'box-glow-blue',
    label: 'text-crt-blue',
    icon: 'ℹ',
  },
};

export function NotificationContainer() {
  const notifications = useAppStore((s) => s.notifications);
  const removeNotification = useAppStore((s) => s.removeNotification);

  return (
    <div className="fixed top-16 right-4 z-[9998] flex flex-col gap-2 w-[380px] max-w-[calc(100vw-2rem)]">
      <AnimatePresence>
        {notifications.map((n) => {
          const config = typeConfig[n.type];
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'retro-window border',
                config.border,
                config.glow
              )}
            >
              <div className="retro-window-titlebar">
                <div className="retro-window-controls">
                  <span className="retro-window-dot retro-window-dot--red" />
                  <span className="retro-window-dot retro-window-dot--yellow" />
                  <span className="retro-window-dot retro-window-dot--green" />
                </div>
                <span className={cn('flex-1 uppercase', config.label)}>
                  {n.type}
                </span>
                <button
                  onClick={() => removeNotification(n.id)}
                  className="text-[var(--crt-muted)] hover:text-[var(--crt-white)] transition-colors"
                  aria-label="Close notification"
                >
                  <VscClose size={14} />
                </button>
              </div>
              <div className="retro-window-body py-3 px-4">
                <div className="flex items-start gap-3">
                  <span className={cn('text-lg', config.label)}>
                    {config.icon}
                  </span>
                  <p className="font-mono text-xs leading-relaxed text-[var(--crt-white)]">
                    {n.message}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
