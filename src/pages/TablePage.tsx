import { Toolbar } from '@/components/table/Toolbar';
import { DataTable } from '@/components/table/DataTable';
import { InfoPanel } from '@/components/table/InfoPanel';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useDataStore } from '@/store/useDataStore';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

/* ============================================================
   TablePage — Data grid view with toolbar and info panel
   ============================================================ */

export function TablePage() {
  const dataset = useDataStore((s) => s.dataset);
  const [isMaximized, setIsMaximized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Register keyboard shortcuts
  useKeyboardShortcuts();

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsMaximized(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleMaximize = async () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        try {
          await containerRef.current.requestFullscreen();
        } catch (e) {
          console.error('Failed to enter fullscreen:', e);
          setIsMaximized(true); // Fallback to CSS fullscreen
        }
      } else {
        setIsMaximized(true); // Fallback if API unavailable
      }
    } else {
      try {
        await document.exitFullscreen();
      } catch (e) {
        console.error('Failed to exit fullscreen:', e);
        setIsMaximized(false);
      }
    }
  };

  if (!dataset) return null;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={
        isMaximized
          ? 'fixed inset-0 z-[200] bg-[var(--crt-bg)] flex flex-col'
          : 'flex flex-col h-[calc(100vh-48px)]'
      }
    >
      {/* Maximized header bar */}
      {isMaximized && (
        <div className="maximize-header">
          <div className="maximize-header-left">
            <img src="/icon.png" alt="QuriosNow Logo" className="w-6 h-6 rounded" />
            <span className="font-pixel text-[9px] text-crt-green glow-green tracking-wider">
              QuriosNow
            </span>
            <span className="maximize-separator">│</span>
            <span className="maximize-filename">{dataset.info.fileName}</span>
          </div>
          <div className="maximize-header-right">
            <span className="maximize-stat">
              <span className="text-crt-green">{dataset.rows.length.toLocaleString()}</span> rows
            </span>
            <span className="maximize-separator">│</span>
            <span className="maximize-stat">
              <span className="text-crt-green">{dataset.info.colCount}</span> cols
            </span>
            <button onClick={toggleMaximize} className="maximize-exit-btn" title="Exit Fullscreen">
              ✕ EXIT
            </button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="px-3 pt-3 toolbar-container">
        <Toolbar isMaximized={isMaximized} toggleMaximize={toggleMaximize} />
      </div>

      {/* Main area: table + panel */}
      <div className="flex flex-1 overflow-hidden px-3 pb-3 gap-2 table-main-area">
        {/* Table */}
        <div className="flex-1 min-w-0">
          <DataTable />
        </div>

        {/* Info Panel — visible on desktop, hidden on small screens */}
        <div className="info-panel-wrapper">
          <InfoPanel />
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar />
    </motion.div>
  );
}

/* ============================================================
   StatusBar — Bottom status indicator
   ============================================================ */

function StatusBar() {
  const dataset = useDataStore((s) => s.dataset);
  const selectedRows = useDataStore((s) => s.selectedRows);
  const editHistory = useDataStore((s) => s.editHistory);

  if (!dataset) return null;

  return (
    <div className="h-6 bg-[var(--crt-secondary)] border-t border-[var(--crt-border)] px-4 flex items-center gap-4 font-mono text-[10px] text-crt-muted">
      <span className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--crt-green)] animate-glow-pulse" />
        READY
      </span>
      <span>│</span>
      <span>
        <span className="text-crt-green">{dataset.info.rowCount.toLocaleString()}</span> rows
      </span>
      <span>│</span>
      <span>
        <span className="text-crt-green">{dataset.info.colCount}</span> cols
      </span>
      {selectedRows.length > 0 && (
        <>
          <span>│</span>
          <span>
            <span className="text-crt-amber">{selectedRows.length}</span> selected
          </span>
        </>
      )}
      {editHistory.length > 0 && (
        <>
          <span>│</span>
          <span>
            <span className="text-crt-blue">{editHistory.length}</span> edits
          </span>
        </>
      )}
      <div className="flex-1" />
      <span className="text-crt-muted">
        {dataset.info.fileName}
      </span>
    </div>
  );
}
