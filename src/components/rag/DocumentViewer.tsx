import { useRagStore } from '@/store/useRagStore';
import { motion } from 'framer-motion';
import { VscFile, VscSymbolNamespace } from 'react-icons/vsc';

/* ============================================================
   DocumentViewer — Retro document display with chunk highlights
   ============================================================ */

export function DocumentViewer() {
  const activeDocument = useRagStore((s) => s.activeDocument);
  const text = useRagStore((s) => s.activeDocumentText);
  const chunks = useRagStore((s) => s.chunks);

  if (!activeDocument) {
    return (
      <div className="h-full flex items-center justify-center text-[var(--crt-muted)] font-mono text-xs">
        <div className="text-center">
          <VscFile size={32} className="mx-auto mb-3 opacity-30" />
          <p>NO DOCUMENT LOADED</p>
        </div>
      </div>
    );
  }

  // Format file size
  const sizeStr = activeDocument.size < 1024
    ? `${activeDocument.size} B`
    : activeDocument.size < 1048576
      ? `${(activeDocument.size / 1024).toFixed(1)} KB`
      : `${(activeDocument.size / 1048576).toFixed(1)} MB`;

  return (
    <div className="h-full flex flex-col">
      {/* ── Document Header ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="shrink-0 p-3 border-b border-[var(--crt-border)]"
        style={{ background: 'rgba(5, 8, 6, 0.6)' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <VscFile size={14} className="text-[var(--crt-amber)]" />
          <h2 className="text-xs font-mono tracking-widest text-[var(--crt-amber)] truncate">
            {activeDocument.name}
          </h2>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-mono text-[var(--crt-muted)]">
          <span>SIZE: {sizeStr}</span>
          <span>CHUNKS: {activeDocument.chunkCount}</span>
          <span className="text-[var(--crt-green)]">
            ● {activeDocument.indexStatus.toUpperCase()}
          </span>
        </div>
      </motion.div>

      {/* ── Document Content ─────────────────────────── */}
      <div
        className="flex-1 overflow-auto p-4 custom-scrollbar"
        style={{ background: 'rgba(5, 8, 6, 0.4)' }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Line numbers + content */}
          <div className="flex gap-4">
            <div className="hidden md:flex flex-col text-right font-mono text-[10px] text-[var(--crt-muted)]/30 select-none leading-relaxed pt-[1px]">
              {text.split('\n').slice(0, 500).map((_, i) => (
                <span key={i}>{String(i + 1).padStart(4, ' ')}</span>
              ))}
            </div>
            <pre className="whitespace-pre-wrap font-mono text-xs text-gray-400 leading-relaxed flex-1 break-words">
              {text}
            </pre>
          </div>
        </motion.div>
      </div>

      {/* ── Footer ───────────────────────────────────── */}
      <div
        className="shrink-0 px-3 py-1.5 border-t border-[var(--crt-border)] flex items-center gap-3 text-[10px] font-mono text-[var(--crt-muted)]"
        style={{ background: 'rgba(5, 8, 6, 0.6)' }}
      >
        <VscSymbolNamespace size={10} />
        <span>{text.split('\n').length} LINES</span>
        <span>•</span>
        <span>{text.length.toLocaleString()} CHARS</span>
      </div>
    </div>
  );
}
