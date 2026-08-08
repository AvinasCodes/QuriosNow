import { useCallback, useRef, useState, type DragEvent, type ChangeEvent } from 'react';
import { validateFile } from '@/utils/validators';
import { parseFile } from '@/services/parser';
import { useDataStore } from '@/store/useDataStore';
import { useAppStore } from '@/store/useAppStore';
import type { LoadingStage } from '@/types';
import { uid } from '@/lib/utils';
import { saveDatasetToDB, loadDatasetFromDB } from '@/utils/db';
import { FileTypeDetector } from '@/services/FileTypeDetector';
import { RAGService } from '@/services/rag/RAGService';
import { TextExtractor } from '@/services/rag/TextExtractor';

/* ============================================================
   useFileUpload — Drag & Drop + File Input Hook
   ============================================================ */

export function useFileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [loadingStage, setLoadingStage] = useState<LoadingStage>('idle');
  const dragCounter = useRef(0);

  const setDataset = useDataStore((s) => s.setDataset);
  const setLoading = useDataStore((s) => s.setLoading);
  const setView = useAppStore((s) => s.setView);
  const addNotification = useAppStore((s) => s.addNotification);
  const addRecentFile = useAppStore((s) => s.addRecentFile);

  const setFileHandle = useDataStore((s) => s.setFileHandle);

  const processFile = useCallback(
    async (file: File, fileHandle?: any) => {
      setLoadingStage('validating');
      setLoading(true, 'Detecting file type...');
      
      const detection = FileTypeDetector.detect(file);
      
      if (detection.mode === 'unsupported') {
        addNotification('error', `Unsupported format: ${detection.type}`);
        setLoading(false);
        setLoadingStage('idle');
        return;
      }
      
      await delay(500); // Artificial delay to show detection

      if (detection.mode === 'rag') {
        try {
          setLoading(true, `Extracting text from ${detection.type.toUpperCase()}...`);
          const text = await TextExtractor.extract(file, detection.type);
          if (!text.trim()) {
            addNotification('error', 'Could not extract any text from this file.');
            setLoading(false);
            setLoadingStage('idle');
            return;
          }
          setView('rag');
          setLoading(false);
          setLoadingStage('idle');
          await RAGService.processDocument(file, text);
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to read document.';
          addNotification('error', message);
          setLoading(false);
          setLoadingStage('idle');
        }
        return;
      }

      // TABLE MODE
      try {
        // Parse
        setLoadingStage('initializing');
        setLoading(true, 'Initializing parser...');

        await delay(400); // Brief delay for boot sequence feel
        setLoadingStage('parsing');
        setLoading(true, 'Parsing file data...');

        const dataset = await parseFile(file);

        setLoadingStage('detecting-types');
        setLoading(true, 'Detecting column types...');
        await delay(300);

        setLoadingStage('building-table');
        setLoading(true, 'Building data table...');
        await delay(300);

        // Store the dataset and handle
        const datasetId = uid();
        dataset.datasetId = datasetId;
        setDataset(dataset);
        if (fileHandle) {
          setFileHandle(fileHandle);
        }

        try {
          await saveDatasetToDB(datasetId, dataset);
        } catch (e) {
          console.error("Failed to save to DB", e);
        }

        // Add to recent files
        addRecentFile({
          id: datasetId,
          name: file.name,
          size: file.size,
          date: Date.now(),
          rowCount: dataset.info.rowCount,
          colCount: dataset.info.colCount,
        });

        setLoadingStage('ready');
        setLoading(true, 'SYSTEM READY.');
        await delay(500);

        // Switch to table view
        setView('table');
        setLoading(false);
        setLoadingStage('idle');

        addNotification(
          'success',
          `Loaded "${file.name}" — ${dataset.info.rowCount} rows × ${dataset.info.colCount} columns`
        );
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to parse file.';
        addNotification('error', message);
        setLoading(false);
        setLoadingStage('idle');
      }
    },
    [setDataset, setLoading, setView, addNotification, addRecentFile]
  );

  const onDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    setIsDragging(true);
  }, []);

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current = 0;
      setIsDragging(false);

      const item = e.dataTransfer.items[0];
      const file = e.dataTransfer.files[0];
      
      if (item && file) {
        // Attempt to get file system handle from drop
        const getHandle = async () => {
          try {
            if ('getAsFileSystemHandle' in item) {
              const handle = await (item as any).getAsFileSystemHandle();
              if (handle?.kind === 'file') {
                processFile(file, handle);
                return;
              }
            }
          } catch (err) {
            console.error('Failed to get file handle from drop', err);
          }
          processFile(file);
        };
        getHandle();
      }
    },
    [processFile]
  );

  const onFileInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processFile(file);
      }
      // Reset input so the same file can be re-uploaded
      e.target.value = '';
    },
    [processFile]
  );

  const openFilePicker = useCallback(async () => {
    if ('showOpenFilePicker' in window) {
      try {
        const [handle] = await (window as any).showOpenFilePicker({
          types: [
            {
              description: 'Spreadsheets, Documents & Code',
              accept: {
                'text/csv': ['.csv'],
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
                'application/vnd.ms-excel': ['.xls'],
                'text/plain': ['.txt', '.log', '.py', '.js', '.ts', '.java', '.c', '.cpp', '.go', '.rs', '.sh', '.sql', '.json', '.yaml', '.yml', '.toml', '.ini', '.cfg'],
                'text/markdown': ['.md'],
                'application/pdf': ['.pdf'],
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
              },
            },
          ],
          excludeAcceptAllOption: false,
          multiple: false,
        });
        const file = await handle.getFile();
        processFile(file, handle);
      } catch (err) {
        // Ignore AbortError if user cancels
        if ((err as Error).name !== 'AbortError') {
          console.error(err);
        }
      }
    } else {
      // Fallback: trigger hidden input via returning false or handled by caller
      return false;
    }
    return true;
  }, [processFile]);

  const loadFromRecent = useCallback(
    async (id: string, name: string) => {
      setLoadingStage('initializing');
      setLoading(true, 'Loading from memory banks...');

      try {
        await delay(300);
        const dataset = await loadDatasetFromDB(id);
        if (!dataset) {
          throw new Error('Dataset not found in memory.');
        }

        setLoadingStage('building-table');
        setLoading(true, 'Building data table...');
        await delay(300);

        setDataset(dataset);

        setLoadingStage('ready');
        setLoading(true, 'SYSTEM READY.');
        await delay(400);

        setView('table');
        setLoading(false);
        setLoadingStage('idle');

        addNotification(
          'success',
          `Restored "${name}" — ${dataset.info.rowCount} rows × ${dataset.info.colCount} columns`
        );
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to load dataset.';
        addNotification('error', message);
        setLoading(false);
        setLoadingStage('idle');
      }
    },
    [setDataset, setLoading, setView, addNotification]
  );

  return {
    isDragging,
    loadingStage,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDrop,
    onFileInputChange,
    openFilePicker,
    processFile,
    loadFromRecent,
  };
}

/* ============================================================
   Helpers
   ============================================================ */

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
