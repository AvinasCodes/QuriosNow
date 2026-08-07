import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

/* ============================================================
   GlowText — Text with CRT glow + optional typing animation
   ============================================================ */

interface GlowTextProps {
  text: string;
  /** Glow color */
  color?: 'green' | 'amber' | 'blue';
  /** Enable typing animation */
  typing?: boolean;
  /** Typing speed in ms per character */
  typingSpeed?: number;
  /** Tag to render */
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'div';
  className?: string;
  /** Callback when typing finishes */
  onComplete?: () => void;
}

export function GlowText({
  text,
  color = 'green',
  typing = false,
  typingSpeed = 40,
  as: Tag = 'span',
  className,
  onComplete,
}: GlowTextProps) {
  const [displayText, setDisplayText] = useState(typing ? '' : text);
  const [showCursor, setShowCursor] = useState(typing);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!typing) {
      setDisplayText(text);
      return;
    }

    setDisplayText('');
    setShowCursor(true);
    let i = 0;

    const interval = setInterval(() => {
      i++;
      setDisplayText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        onCompleteRef.current?.();
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [text, typing, typingSpeed]);

  const glowClass =
    color === 'green' ? 'glow-green text-crt-green' :
    color === 'amber' ? 'glow-amber text-crt-amber' :
    'glow-blue text-crt-blue';

  return (
    <Tag className={cn(glowClass, className)}>
      {displayText}
      {showCursor && (
        <span className="animate-blink ml-0.5">▌</span>
      )}
    </Tag>
  );
}
