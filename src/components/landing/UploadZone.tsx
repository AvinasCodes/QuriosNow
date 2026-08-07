import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useFileUpload } from '@/hooks/useFileUpload';
import { RetroWindow } from '@/components/ui/RetroWindow';
import { RetroButton } from '@/components/ui/RetroButton';
import { VscCloudUpload, VscFile } from 'react-icons/vsc';
import { cn } from '@/lib/utils';

/* ============================================================
   UploadZone — Drag & drop / file input upload area
   ============================================================ */

export function UploadZone() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    isDragging,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDrop,
    onFileInputChange,
    openFilePicker,
  } = useFileUpload();

  return (
    <section className="max-w-2xl mx-auto px-4 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <RetroWindow title="file_upload.exe">
          <div
            onDragEnter={onDragEnter}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={cn(
              'border-2 border-dashed rounded-lg p-10 text-center',
              'transition-all duration-200 cursor-pointer',
              isDragging
                ? 'border-[var(--crt-green)] bg-[rgba(57,255,20,0.06)] box-glow-green'
                : 'border-[var(--crt-border)] hover:border-[var(--crt-green-dim)] hover:bg-[rgba(57,255,20,0.02)]'
            )}
            onClick={async (e) => {
              const handled = await openFilePicker();
              if (!handled) fileInputRef.current?.click();
            }}
            role="button"
            tabIndex={0}
            aria-label="Upload file area"
          >
            {/* Icon */}
            <div className="flex justify-center mb-4">
              {isDragging ? (
                <VscFile className="text-crt-green animate-glow-pulse" size={40} />
              ) : (
                <VscCloudUpload className="text-crt-muted" size={40} />
              )}
            </div>

            {/* Text */}
            <p className="font-mono text-sm text-crt-green mb-2">
              {isDragging
                ? '> DROP FILE TO LOAD...'
                : '> DRAG & DROP FILE HERE'}
            </p>
            <p className="font-mono text-xs text-crt-muted mb-6">
              or click to browse files
            </p>

            {/* Upload button */}
            <RetroButton
              variant="filled-green"
              icon={<VscCloudUpload size={14} />}
              onClick={async (e) => {
                e.stopPropagation();
                const handled = await openFilePicker();
                if (!handled) fileInputRef.current?.click();
              }}
            >
              Select File
            </RetroButton>

            {/* Supported formats */}
            <div className="mt-6 flex items-center justify-center gap-3 font-mono text-[10px] text-crt-muted">
              <span className="px-2 py-0.5 border border-[var(--crt-border)] rounded">.CSV</span>
              <span className="px-2 py-0.5 border border-[var(--crt-border)] rounded">.XLSX</span>
              <span className="px-2 py-0.5 border border-[var(--crt-border)] rounded">.XLS</span>
              <span className="text-crt-muted">Max 100MB</span>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={onFileInputChange}
            className="hidden"
            id="upload-file-input"
          />
        </RetroWindow>
      </motion.div>
    </section>
  );
}
