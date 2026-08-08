import { motion } from 'framer-motion';

/* ============================================================
   ProcessingProgress — Retro Boot Sequence
   ============================================================ */

const STAGES = [
  { key: 'chunking', label: 'READING & CHUNKING DOCUMENT', pct: 30 },
  { key: 'embedding', label: 'GENERATING EMBEDDINGS', pct: 65 },
  { key: 'indexing', label: 'BUILDING VECTOR INDEX', pct: 90 },
  { key: 'ready', label: 'DOCUMENT READY', pct: 100 },
];

export function ProcessingProgress({ stage }: { stage: string }) {
  const currentIdx = STAGES.findIndex((s) => s.key === stage);
  const progress = currentIdx >= 0 ? STAGES[currentIdx]!.pct : 10;
  const currentLabel = currentIdx >= 0 ? STAGES[currentIdx]!.label : 'INITIALIZING SYSTEM...';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      {/* Terminal Window */}
      <div
        className="border border-[var(--crt-border)] overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #0a0e0b 0%, #050806 100%)',
          boxShadow: '0 0 40px rgba(57,255,20,0.05), 0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Title Bar */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--crt-border)] bg-[#080c09]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <span className="text-[10px] font-mono text-[var(--crt-muted)] tracking-widest ml-2">
            QURIOSNOW — DOCUMENT PROCESSOR
          </span>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 font-mono text-xs">
          {/* Stage checklist */}
          {STAGES.map((s, i) => {
            const isDone = currentIdx > i;
            const isActive = currentIdx === i;
            return (
              <motion.div
                key={s.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: isDone || isActive ? 1 : 0.3, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                className="flex items-center gap-2"
              >
                <span className={`w-4 text-center ${isDone ? 'text-[var(--crt-green)]' : isActive ? 'text-[var(--crt-amber)] animate-pulse' : 'text-[var(--crt-muted)]'}`}>
                  {isDone ? '✓' : isActive ? '▸' : '○'}
                </span>
                <span className={`tracking-wider ${isDone ? 'text-[var(--crt-green)]/70' : isActive ? 'text-[var(--crt-amber)]' : 'text-[var(--crt-muted)]'}`}>
                  {s.label}
                </span>
              </motion.div>
            );
          })}

          {/* Progress Bar */}
          <div className="pt-3 border-t border-[var(--crt-border)]/50">
            <div className="flex justify-between mb-1.5">
              <span className="text-[var(--crt-muted)]">{currentLabel}</span>
              <span className="text-[var(--crt-green)]">{progress}%</span>
            </div>
            <div className="h-2 bg-[#0a0e0b] border border-[var(--crt-border)]/50 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full"
                style={{
                  background: 'linear-gradient(90deg, var(--crt-green-dim), var(--crt-green))',
                  boxShadow: '0 0 10px var(--crt-green-glow)',
                }}
              />
            </div>
          </div>

          {/* Ready Message */}
          {progress === 100 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-[var(--crt-amber)] text-center pt-2"
            >
              ▸ SYSTEM READY — LOADING WORKSPACE...
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
