import { useEffect, useCallback } from 'react';
import { useDataStore } from '@/store/useDataStore';
import { useAppStore } from '@/store/useAppStore';
import { saveDataToFile } from '@/utils/exporters';
import { saveDatasetToDB } from '@/utils/db';

/* ============================================================
   useKeyboardShortcuts
   ============================================================ */

export function useKeyboardShortcuts() {
  const undo = useDataStore((s) => s.undo);
  const redo = useDataStore((s) => s.redo);
  const deleteRows = useDataStore((s) => s.deleteRows);
  const selectedRows = useDataStore((s) => s.selectedRows);
  const dataset = useDataStore((s) => s.dataset);
  const setFileHandle = useDataStore((s) => s.setFileHandle);
  const addNotification = useAppStore((s) => s.addNotification);
  const addRecentFile = useAppStore((s) => s.addRecentFile);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Skip when typing in an input or AG Grid cell
      const target = e.target as HTMLElement;
      const isEditing =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.getAttribute('role') === 'textbox' ||
        target.classList.contains('ag-cell-edit-input');

      if (isEditing && !(e.ctrlKey && e.key === 's')) return;

      // Ctrl+S — Save
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        if (dataset) {
          saveDataToFile(dataset.rows, dataset.info.fileName, dataset.fileHandle)
            .then(async (handle) => {
              setFileHandle(handle);
              // Persist to IndexedDB & update recent files list
              if (dataset.datasetId) {
                await saveDatasetToDB(dataset.datasetId, { ...dataset, fileHandle: handle });
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
            })
            .catch((err) => {
              if ((err as Error).name === 'AbortError') return;
              addNotification('error', 'Save failed: ' + (err as Error).message);
            });
        }
        return;
      }

      // Ctrl+Z — Undo
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      // Ctrl+Y or Ctrl+Shift+Z — Redo
      if (
        (e.ctrlKey && e.key === 'y') ||
        (e.ctrlKey && e.shiftKey && e.key === 'Z')
      ) {
        e.preventDefault();
        redo();
        return;
      }

      // Delete — Delete selected rows
      if (e.key === 'Delete' && selectedRows.length > 0 && dataset) {
        e.preventDefault();
        deleteRows(selectedRows);
        return;
      }
    },
    [undo, redo, deleteRows, selectedRows, dataset, setFileHandle, addNotification, addRecentFile]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
