import { motion, AnimatePresence } from 'framer-motion';
import { useRagStore } from '@/store/useRagStore';
import { ProcessingProgress } from '@/components/rag/ProcessingProgress';
import { DocumentViewer } from '@/components/rag/DocumentViewer';
import { ChatPanel } from '@/components/rag/ChatPanel';
import { useState } from 'react';

/* ============================================================
   RagPage — Document Intelligence Workspace
   ============================================================ */

export function RagPage() {
  const isLoading = useRagStore((s) => s.isLoading);
  const loadingStage = useRagStore((s) => s.loadingStage);
  const activeDocument = useRagStore((s) => s.activeDocument);
  const [activeTab, setActiveTab] = useState<'doc' | 'chat'>('chat');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="h-[calc(100vh-48px)] flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #060a07 0%, #0B0F0C 30%, #0d110e 100%)' }}
    >
      {/* ── Document Status Bar ─────────────────────────── */}
      {activeDocument && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="shrink-0 px-4 py-2 border-b border-[var(--crt-border)] flex items-center gap-3 text-xs font-mono"
          style={{ background: 'rgba(5, 8, 6, 0.8)' }}
        >
          <span className="text-[var(--crt-amber)] tracking-widest">DOCUMENT:</span>
          <span className="text-[var(--crt-green)] truncate max-w-[200px]">{activeDocument.name}</span>
          <span className="text-[var(--crt-muted)]">•</span>
          <span className="text-[var(--crt-muted)]">{activeDocument.chunkCount} CHUNKS</span>
          <span className="text-[var(--crt-muted)]">•</span>
          <span className="text-[var(--crt-green)]">
            {activeDocument.indexStatus === 'indexed' ? '● INDEXED' : '○ PENDING'}
          </span>
          <div className="flex-1" />
          <div className="hidden md:flex items-center gap-1 text-[var(--crt-muted)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--crt-green)] animate-pulse" />
            <span>LOCAL PROCESSING</span>
          </div>
        </motion.div>
      )}

      {/* ── Content Area ────────────────────────────────── */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-full flex items-center justify-center p-4"
            >
              <ProcessingProgress stage={loadingStage} />
            </motion.div>
          ) : (
            <motion.div
              key="workspace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col"
            >
              {/* Mobile Tabs */}
              <div className="md:hidden flex border-b border-[var(--crt-border)] shrink-0">
                <button
                  onClick={() => setActiveTab('doc')}
                  className={`flex-1 py-2.5 text-xs font-mono tracking-widest transition-all ${
                    activeTab === 'doc'
                      ? 'text-[var(--crt-green)] border-b-2 border-[var(--crt-green)] bg-[var(--crt-green)]/5'
                      : 'text-[var(--crt-muted)] hover:text-[var(--crt-green)]/60'
                  }`}
                >
                  DOCUMENT
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 py-2.5 text-xs font-mono tracking-widest transition-all ${
                    activeTab === 'chat'
                      ? 'text-[var(--crt-amber)] border-b-2 border-[var(--crt-amber)] bg-[var(--crt-amber)]/5'
                      : 'text-[var(--crt-muted)] hover:text-[var(--crt-amber)]/60'
                  }`}
                >
                  AI TERMINAL
                </button>
              </div>

              {/* Desktop: side-by-side / Mobile: tab content */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Document Viewer */}
                <div className={`md:w-[45%] h-full overflow-hidden flex flex-col ${
                  activeTab === 'doc' ? 'flex' : 'hidden md:flex'
                }`}>
                  <DocumentViewer />
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px bg-[var(--crt-border)] relative">
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-8 bg-[#0B0F0C] border border-[var(--crt-border)] rounded-sm flex items-center justify-center">
                    <div className="w-0.5 h-3 bg-[var(--crt-muted)] rounded-full" />
                  </div>
                </div>

                {/* Chat Panel */}
                <div className={`md:flex-1 h-full overflow-hidden flex flex-col ${
                  activeTab === 'chat' ? 'flex' : 'hidden md:flex'
                }`}>
                  <ChatPanel />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
