import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlowText } from '@/components/ui/GlowText';

/* ============================================================
   HeroSection — Landing page hero with CRT typing effect
   ============================================================ */

export function HeroSection() {
  const [taglineDone, setTaglineDone] = useState(false);

  return (
    <section className="relative flex flex-col items-center justify-center text-center py-20 px-4">
      {/* Decorative grid lines */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(var(--crt-green) 1px, transparent 1px), linear-gradient(90deg, var(--crt-green) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10"
      >
        {/* System label */}
        <div className="font-mono text-[10px] sm:text-xs text-crt-muted mb-6 tracking-widest sm:tracking-[0.3em] uppercase whitespace-nowrap overflow-hidden text-clip w-full flex justify-center">
          <span className="sm:hidden">TERMINAL v1.0</span>
          <span className="hidden sm:inline">┌─ TERMINAL v1.0 ─ DATA EXPLORER ─┐</span>
        </div>

        {/* Logo */}
        <h1 className="font-pixel text-2xl sm:text-3xl md:text-4xl text-crt-green glow-green mb-6 tracking-wider">
          QuriosNow
        </h1>

        {/* Tagline with typing effect */}
        <div className="h-10 flex items-center justify-center mb-8">
          <GlowText
            text="Talk to Your Data. Instantly."
            color="amber"
            typing
            typingSpeed={55}
            as="p"
            className="font-terminal text-2xl sm:text-3xl md:text-4xl"
            onComplete={() => setTaglineDone(true)}
          />
        </div>

        {/* Subtitle */}
        {taglineDone && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="font-mono text-sm text-crt-muted max-w-lg mx-auto leading-relaxed"
          >
            Upload CSV or Excel files. Explore, edit, filter, and export
            <br />
            all from your browser. No server required.
          </motion.p>
        )}

        {/* Decorative bottom border */}
        <div className="font-mono text-[10px] sm:text-xs text-crt-muted mt-8 tracking-widest sm:tracking-[0.3em] uppercase hidden sm:block">
          └────────────────────────────────────┘
        </div>
        <div className="font-mono text-[10px] text-crt-muted mt-8 tracking-widest uppercase sm:hidden">
          └──────────────────────┘
        </div>
      </motion.div>
    </section>
  );
}
