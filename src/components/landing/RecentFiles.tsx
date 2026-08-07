import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { RetroWindow } from '@/components/ui/RetroWindow';
import { formatBytes, formatDate } from '@/lib/utils';
import { VscFile, VscTable } from 'react-icons/vsc';
import { useFileUpload } from '@/hooks/useFileUpload';

/* ============================================================
   RecentFiles — Previously uploaded files list
   ============================================================ */

export function RecentFiles() {
  const recentFiles = useAppStore((s) => s.recentFiles);
  const addNotification = useAppStore((s) => s.addNotification);
  const { loadFromRecent } = useFileUpload();

  if (recentFiles.length === 0) return null;

  return (
    <section className="max-w-2xl mx-auto px-4 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <RetroWindow title="recent_files.log">
          <div className="space-y-1">
            {/* Header */}
            <div className="flex items-center gap-3 text-[10px] font-mono text-crt-muted uppercase tracking-wider pb-2 border-b border-[var(--crt-border)]">
              <span className="flex-1">File Name</span>
              <span className="w-16 text-right">Size</span>
              <span className="w-20 text-right">Rows × Cols</span>
              <span className="w-20 text-right">Opened</span>
            </div>

            {recentFiles.map((file, i) => (
              <div
                key={`${file.name}-${i}`}
                className="flex items-center gap-3 py-2 px-1 rounded hover:bg-[rgba(57,255,20,0.04)] transition-colors font-mono text-xs cursor-pointer group"
                onClick={() => {
                  if (file.id) {
                    loadFromRecent(file.id, file.name);
                  } else {
                    addNotification('warning', 'This older recent file cannot be loaded directly. Please upload it again.');
                  }
                }}
              >
                {/* Icon */}
                <span className="text-crt-green">
                  {file.name.endsWith('.csv') ? (
                    <VscFile size={14} />
                  ) : (
                    <VscTable size={14} />
                  )}
                </span>

                {/* Name */}
                <span className="flex-1 text-crt-white truncate group-hover:text-crt-green transition-colors">
                  {file.name}
                </span>

                {/* Size */}
                <span className="w-16 text-right text-crt-muted">
                  {formatBytes(file.size)}
                </span>

                {/* Dimensions */}
                <span className="w-20 text-right text-crt-amber">
                  {file.rowCount}×{file.colCount}
                </span>

                {/* Date */}
                <span className="w-20 text-right text-crt-muted">
                  {formatDate(file.date)}
                </span>
              </div>
            ))}
          </div>
        </RetroWindow>
      </motion.div>
    </section>
  );
}
