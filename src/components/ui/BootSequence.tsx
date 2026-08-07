import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BOOT_MESSAGES } from '@/constants';
import { cn } from '@/lib/utils';

/* ============================================================
   BootSequence — CRT boot animation with terminal text
   ============================================================ */

interface BootSequenceProps {
  /** Called when boot sequence finishes */
  onComplete: () => void;
  /** Custom messages to display */
  messages?: readonly string[];
  /** Speed per line in ms */
  lineDelay?: number;
}

export function BootSequence({
  onComplete,
  messages = BOOT_MESSAGES,
  lineDelay = 120,
}: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleLines(i);

      // Auto-scroll
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }

      if (i >= messages.length) {
        clearInterval(interval);
        setTimeout(onComplete, 600);
      }
    }, lineDelay);

    return () => clearInterval(interval);
  }, [messages, lineDelay, onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="fixed inset-0 z-[9997] flex items-center justify-center"
        style={{ background: 'var(--crt-bg)' }}
      >
        <div
          ref={containerRef}
          className={cn(
            'w-full max-w-2xl max-h-[70vh] overflow-y-auto p-8',
            'font-mono text-sm leading-relaxed'
          )}
        >
          {messages.slice(0, visibleLines).map((line, i) => (
            <div
              key={i}
              className={cn(
                'animate-fade-in-up',
                line.includes('OK')
                  ? 'text-crt-green'
                  : line.includes('READY')
                    ? 'text-crt-green glow-green font-bold'
                    : line.startsWith('>')
                      ? 'text-crt-green animate-blink'
                      : line.startsWith('  >')
                        ? 'text-crt-amber'
                        : 'text-crt-muted'
              )}
            >
              {line || '\u00A0'}
            </div>
          ))}

          {/* Progress bar */}
          <div className="mt-4 flex items-center gap-2 text-crt-green text-xs">
            <span>[</span>
            <div className="flex-1 h-2 bg-[var(--crt-secondary)] border border-[var(--crt-border)] rounded-sm overflow-hidden">
              <div
                className="h-full transition-all duration-200"
                style={{
                  width: `${(visibleLines / messages.length) * 100}%`,
                  background: 'var(--crt-green)',
                  boxShadow: '0 0 8px var(--crt-green-glow)',
                }}
              />
            </div>
            <span>]</span>
            <span className="w-10 text-right">
              {Math.round((visibleLines / messages.length) * 100)}%
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
