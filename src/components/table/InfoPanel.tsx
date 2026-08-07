import { motion, AnimatePresence } from 'framer-motion';
import { useDataStore } from '@/store/useDataStore';
import { useAppStore } from '@/store/useAppStore';
import { RetroWindow } from '@/components/ui/RetroWindow';
import { formatBytes } from '@/lib/utils';
import { DataType } from '@/types';
import {
  VscTable,
  VscSymbolNumeric,
  VscFile,
  VscWarning,
  VscCopy,
  VscChevronRight,
} from 'react-icons/vsc';

/* ============================================================
   InfoPanel — Right-side dataset info panel
   ============================================================ */

export function InfoPanel() {
  const dataset = useDataStore((s) => s.dataset);
  const isPanelOpen = useAppStore((s) => s.isPanelOpen);

  if (!dataset) return null;

  const { info, columns } = dataset;

  // Group columns by detected type
  const typeGroups = columns.reduce<Record<string, number>>(
    (acc, col) => {
      acc[col.detectedType] = (acc[col.detectedType] ?? 0) + 1;
      return acc;
    },
    {}
  );

  const typeColorMap: Record<string, string> = {
    [DataType.String]: 'text-crt-white',
    [DataType.Integer]: 'text-crt-amber',
    [DataType.Float]: 'text-crt-amber',
    [DataType.Boolean]: 'text-crt-green',
    [DataType.Date]: 'text-crt-blue',
    [DataType.Email]: 'text-crt-blue',
    [DataType.URL]: 'text-crt-blue',
    [DataType.Phone]: 'text-crt-amber',
  };

  return (
    <AnimatePresence>
      {isPanelOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="flex-shrink-0 overflow-hidden h-full"
        >
          <div className="w-[280px] h-full flex flex-col min-h-0">
            <RetroWindow title="sys_info.dat" bodyClassName="p-0 flex-1 overflow-hidden min-h-0 flex flex-col" className="h-full flex flex-col min-h-0">
              <div className="divide-y divide-[var(--crt-border)] overflow-y-auto flex-1 min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {/* File Info */}
                <div className="p-4 space-y-3">
                  <SectionLabel icon={<VscFile size={12} />} label="FILE" />
                  <InfoRow label="Name" value={info.fileName} />
                  <InfoRow label="Size" value={formatBytes(info.fileSize)} />
                </div>

                {/* Data Stats */}
                <div className="p-4 space-y-3">
                  <SectionLabel icon={<VscTable size={12} />} label="DATA" />
                  <InfoRow
                    label="Rows"
                    value={info.rowCount.toLocaleString()}
                    valueClass="text-crt-green"
                  />
                  <InfoRow
                    label="Columns"
                    value={info.colCount.toLocaleString()}
                    valueClass="text-crt-green"
                  />
                </div>

                {/* Detected Types */}
                <div className="p-4 space-y-3">
                  <SectionLabel icon={<VscSymbolNumeric size={12} />} label="TYPES" />
                  {Object.entries(typeGroups).map(([type, count]) => (
                    <InfoRow
                      key={type}
                      label={type}
                      value={String(count)}
                      valueClass={typeColorMap[type] ?? 'text-crt-white'}
                    />
                  ))}
                </div>

                {/* Quality */}
                <div className="p-4 space-y-3">
                  <SectionLabel icon={<VscWarning size={12} />} label="QUALITY" />
                  <InfoRow
                    label="Missing"
                    value={info.totalMissingValues.toLocaleString()}
                    valueClass={
                      info.totalMissingValues > 0 ? 'text-crt-amber' : 'text-crt-green'
                    }
                  />
                  <InfoRow
                    label="Duplicates"
                    value={info.duplicateRows.toLocaleString()}
                    valueClass={
                      info.duplicateRows > 0 ? 'text-crt-amber' : 'text-crt-green'
                    }
                  />
                </div>

                {/* Columns List */}
                <div className="p-4 space-y-2">
                  <SectionLabel icon={<VscCopy size={12} />} label="COLUMNS" />
                  <div className="max-h-48 overflow-y-auto space-y-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {columns.map((col) => (
                      <div
                        key={col.field}
                        className="flex items-center gap-2 font-mono text-[10px] py-1"
                      >
                        <VscChevronRight className="text-crt-green flex-shrink-0" size={10} />
                        <span className="text-crt-white truncate flex-1">{col.field}</span>
                        <span className={`${typeColorMap[col.detectedType] ?? 'text-crt-muted'} flex-shrink-0`}>
                          {col.detectedType}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </RetroWindow>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

/* ============================================================
   Sub-components
   ============================================================ */

function SectionLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 font-mono text-[10px] text-crt-muted uppercase tracking-[0.15em]">
      {icon}
      {label}
    </div>
  );
}

function InfoRow({
  label,
  value,
  valueClass = 'text-crt-white',
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between font-mono text-xs">
      <span className="text-crt-muted">{label}</span>
      <span className={`${valueClass} truncate max-w-[150px] text-right`} title={value}>
        {value}
      </span>
    </div>
  );
}
