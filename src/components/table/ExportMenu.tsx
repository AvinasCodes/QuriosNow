import { useEffect, useRef } from 'react';
import { useDataStore } from '@/store/useDataStore';
import { useAppStore } from '@/store/useAppStore';
import { exportData } from '@/utils/exporters';
import type { ExportFormat } from '@/types';
import { VscFile, VscTable, VscJson } from 'react-icons/vsc';

/* ============================================================
   ExportMenu — Dropdown for export options
   ============================================================ */

interface ExportMenuProps {
  onClose: () => void;
}

export function ExportMenu({ onClose }: ExportMenuProps) {
  const dataset = useDataStore((s) => s.dataset);
  const addNotification = useAppStore((s) => s.addNotification);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const handleExport = (format: ExportFormat) => {
    if (!dataset) return;

    const baseName = dataset.info.fileName.replace(/\.[^.]+$/, '');

    try {
      exportData(dataset.rows, baseName, format);
      addNotification('success', `Exported as ${format.toUpperCase()} successfully.`);
    } catch {
      addNotification('error', `Failed to export as ${format.toUpperCase()}.`);
    }
    onClose();
  };

  const formats: { format: ExportFormat; label: string; icon: React.ReactNode }[] = [
    { format: 'csv', label: 'CSV (.csv)', icon: <VscFile size={14} /> },
    { format: 'xlsx', label: 'Excel (.xlsx)', icon: <VscTable size={14} /> },
    { format: 'json', label: 'JSON (.json)', icon: <VscJson size={14} /> },
  ];

  return (
    <div
      ref={menuRef}
      className="absolute top-full right-0 mt-1 z-50 retro-window min-w-[180px] animate-window-open"
    >
      <div className="retro-window-titlebar text-[9px]">
        export_as
      </div>
      <div className="p-1">
        {formats.map(({ format, label, icon }) => (
          <button
            key={format}
            onClick={() => handleExport(format)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded font-mono text-xs text-crt-white hover:bg-[rgba(57,255,20,0.08)] hover:text-crt-green transition-colors text-left"
          >
            <span className="text-crt-muted">{icon}</span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
