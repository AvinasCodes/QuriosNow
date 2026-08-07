import { useRef, useState } from 'react';
import { useDataStore } from '@/store/useDataStore';
import { useAppStore } from '@/store/useAppStore';
import { RetroButton } from '@/components/ui/RetroButton';
import { ExportMenu } from './ExportMenu';
import { saveDataToFile } from '@/utils/exporters';
import { saveDatasetToDB } from '@/utils/db';
import {
  VscSearch,
  VscAdd,
  VscTrash,
  VscDiscard,
  VscRedo,
  VscExport,
  VscSettingsGear,
  VscCopy,
  VscScreenFull,
  VscScreenNormal,
  VscSave,
} from 'react-icons/vsc';

/* ============================================================
   Toolbar — Top toolbar for table actions
   ============================================================ */

export function Toolbar({
  isMaximized,
  toggleMaximize,
}: {
  isMaximized?: boolean;
  toggleMaximize?: () => void;
}) {
  const dataset = useDataStore((s) => s.dataset);
  const setFileHandle = useDataStore((s) => s.setFileHandle);
  const quickFilter = useDataStore((s) => s.quickFilter);
  const setQuickFilter = useDataStore((s) => s.setQuickFilter);
  const addRow = useDataStore((s) => s.addRow);
  const deleteRows = useDataStore((s) => s.deleteRows);
  const duplicateRows = useDataStore((s) => s.duplicateRows);
  const undo = useDataStore((s) => s.undo);
  const redo = useDataStore((s) => s.redo);
  const selectedRows = useDataStore((s) => s.selectedRows);
  const editHistory = useDataStore((s) => s.editHistory);
  const redoStack = useDataStore((s) => s.redoStack);
  const togglePanel = useAppStore((s) => s.togglePanel);
  const isPanelOpen = useAppStore((s) => s.isPanelOpen);
  const addNotification = useAppStore((s) => s.addNotification);
  const addRecentFile = useAppStore((s) => s.addRecentFile);

  const [showExport, setShowExport] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const handleDelete = () => {
    if (selectedRows.length === 0) {
      addNotification('warning', 'Select rows first to delete.');
      return;
    }
    deleteRows(selectedRows);
    addNotification('success', `Deleted ${selectedRows.length} row(s).`);
  };

  const handleDuplicate = () => {
    if (selectedRows.length === 0) {
      addNotification('warning', 'Select rows first to duplicate.');
      return;
    }
    duplicateRows(selectedRows);
    addNotification('success', `Duplicated ${selectedRows.length} row(s).`);
  };

  const handleSave = async () => {
    if (!dataset) {
      addNotification('warning', 'No dataset loaded to save.');
      return;
    }
    try {
      // Save to file system
      const handle = await saveDataToFile(dataset.rows, dataset.info.fileName, dataset.fileHandle);
      setFileHandle(handle);

      // Persist to IndexedDB so recent files data stays updated
      if (dataset.datasetId) {
        const updatedDataset = { ...dataset, fileHandle: handle };
        await saveDatasetToDB(dataset.datasetId, updatedDataset);

        // Update the recent files list entry with new row count & timestamp
        addRecentFile({
          id: dataset.datasetId,
          name: dataset.info.fileName,
          size: dataset.info.fileSize,
          date: Date.now(),
          rowCount: dataset.rows.length,
          colCount: dataset.info.colCount,
        });
      }

      addNotification('success', 'File saved successfully.');
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        addNotification('info', 'Save cancelled.');
        return;
      }
      addNotification('error', 'Save failed: ' + (err?.message || String(err)));
    }
  };

  return (
    <div className="flex items-center gap-2 p-3 bg-[var(--crt-secondary)] border border-[var(--crt-border)] rounded-md mb-2 flex-wrap">
      {/* Search */}
      <div className="flex items-center gap-1.5 bg-[var(--crt-bg)] border border-[var(--crt-border)] rounded px-2 py-1 flex-1 min-w-[180px] max-w-sm focus-within:border-[var(--crt-green)] focus-within:shadow-[0_0_8px_var(--crt-green-glow)] transition-all">
        <VscSearch className="text-crt-muted flex-shrink-0" size={14} />
        <input
          ref={searchRef}
          type="text"
          value={quickFilter}
          onChange={(e) => setQuickFilter(e.target.value)}
          placeholder="> search..."
          className="bg-transparent border-none outline-none font-mono text-xs text-crt-green flex-1 placeholder:text-[var(--crt-muted)] caret-[var(--crt-green)]"
          id="toolbar-search"
        />
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-[var(--crt-border)] hidden sm:block" />

      {/* Row Actions */}
      <RetroButton variant="green" size="sm" icon={<VscAdd size={13} />} onClick={addRow}>
        <span className="hidden lg:inline">Add Row</span>
      </RetroButton>

      <RetroButton
        variant="danger"
        size="sm"
        icon={<VscTrash size={13} />}
        onClick={handleDelete}
        disabled={selectedRows.length === 0}
      >
        <span className="hidden lg:inline">Delete</span>
        {selectedRows.length > 0 && (
          <span className="text-[10px] opacity-70">({selectedRows.length})</span>
        )}
      </RetroButton>

      <RetroButton
        variant="amber"
        size="sm"
        icon={<VscCopy size={13} />}
        onClick={handleDuplicate}
        disabled={selectedRows.length === 0}
      >
        <span className="hidden lg:inline">Duplicate</span>
      </RetroButton>

      {/* Divider */}
      <div className="w-px h-6 bg-[var(--crt-border)] hidden sm:block" />

      {/* Undo / Redo */}
      <RetroButton
        variant="ghost"
        size="sm"
        icon={<VscDiscard size={13} />}
        onClick={undo}
        disabled={editHistory.length === 0}
        title="Undo (Ctrl+Z)"
      >
        <span className="hidden xl:inline">Undo</span>
      </RetroButton>

      <RetroButton
        variant="ghost"
        size="sm"
        icon={<VscRedo size={13} />}
        onClick={redo}
        disabled={redoStack.length === 0}
        title="Redo (Ctrl+Y)"
      >
        <span className="hidden xl:inline">Redo</span>
      </RetroButton>

      {/* Divider */}
      <div className="w-px h-6 bg-[var(--crt-border)] hidden sm:block" />

      {/* Save & Export */}
      <RetroButton
        variant="filled-green"
        size="sm"
        icon={<VscSave size={13} />}
        onClick={handleSave}
        title="Save File (Ctrl+S)"
      >
        <span className="hidden lg:inline">Save</span>
      </RetroButton>

      <div className="relative">
        <RetroButton
          variant="blue"
          size="sm"
          icon={<VscExport size={13} />}
          onClick={() => setShowExport((v) => !v)}
        >
          <span className="hidden lg:inline">Export</span>
        </RetroButton>
        {showExport && (
          <ExportMenu onClose={() => setShowExport(false)} />
        )}
      </div>

      {/* Settings / Panel Toggle */}
      {!isMaximized && (
        <RetroButton
          variant="ghost"
          size="sm"
          icon={<VscSettingsGear size={13} />}
          onClick={togglePanel}
          title={isPanelOpen ? 'Hide Info Panel' : 'Show Info Panel'}
        >
          <span className="hidden xl:inline">Info</span>
        </RetroButton>
      )}

      {/* Maximize Toggle */}
      {toggleMaximize && (
        <RetroButton
          variant="ghost"
          size="sm"
          icon={isMaximized ? <VscScreenNormal size={13} /> : <VscScreenFull size={13} />}
          onClick={toggleMaximize}
          title={isMaximized ? 'Restore Table' : 'Maximize Table'}
        >
          <span className="hidden xl:inline">{isMaximized ? 'Restore' : 'Maximize'}</span>
        </RetroButton>
      )}
    </div>
  );
}
