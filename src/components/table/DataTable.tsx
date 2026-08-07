import { useCallback, useMemo, useRef, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type {
  ColDef,
  CellValueChangedEvent,
  SelectionChangedEvent,
  GridReadyEvent,
  GridApi,
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import { useDataStore } from '@/store/useDataStore';
import { DataType } from '@/types';
import { cn } from '@/lib/utils';

/* ============================================================
   DataTable — AG Grid powered data table
   ============================================================ */

export function DataTable() {
  const dataset = useDataStore((s) => s.dataset);
  const quickFilter = useDataStore((s) => s.quickFilter);
  const updateCell = useDataStore((s) => s.updateCell);
  const setSelectedRows = useDataStore((s) => s.setSelectedRows);
  const gridRef = useRef<AgGridReact>(null);
  const gridApiRef = useRef<GridApi | null>(null);

  /** Build column definitions from metadata */
  const columnDefs = useMemo<ColDef[]>(() => {
    if (!dataset) return [];

    return dataset.columns.map((col) => {
      const base: ColDef = {
        field: col.field,
        headerName: col.field,
        editable: true,
        sortable: true,
        filter: true,
        resizable: true,
        minWidth: 100,
        flex: 1,
        headerTooltip: `${col.field} (${col.detectedType})`,
        cellStyle: getCellStyle(col.detectedType),
      };

      // Type-specific configurations
      switch (col.detectedType) {
        case DataType.Integer:
        case DataType.Float:
          base.filter = 'agNumberColumnFilter';
          base.type = 'numericColumn';
          break;
        case DataType.Date:
          base.filter = 'agDateColumnFilter';
          break;
        case DataType.Boolean:
          base.cellRenderer = BooleanCellRenderer;
          break;
        case DataType.Email:
          base.cellRenderer = EmailCellRenderer;
          break;
        case DataType.URL:
          base.cellRenderer = UrlCellRenderer;
          break;
        default:
          base.filter = 'agTextColumnFilter';
      }

      return base;
    });
  }, [dataset]);

  /** Handle cell value changes */
  const onCellValueChanged = useCallback(
    (event: CellValueChangedEvent) => {
      if (event.rowIndex !== null && event.rowIndex !== undefined) {
        updateCell(event.rowIndex, event.colDef.field!, event.newValue);
      }
    },
    [updateCell]
  );

  /** Handle selection changes */
  const onSelectionChanged = useCallback(
    (event: SelectionChangedEvent) => {
      const api = event.api;
      const selectedNodes = api.getSelectedNodes();
      const indices = selectedNodes
        .map((node) => node.rowIndex)
        .filter((i): i is number => i !== null && i !== undefined);
      setSelectedRows(indices);
    },
    [setSelectedRows]
  );

  /** Store grid API on ready */
  const onGridReady = useCallback((event: GridReadyEvent) => {
    gridApiRef.current = event.api;
    event.api.sizeColumnsToFit();
    if (quickFilter) {
      event.api.setGridOption('quickFilterText', quickFilter);
    }
  }, [quickFilter]);

  /** Sync quick filter to grid API */
  useEffect(() => {
    if (gridApiRef.current) {
      gridApiRef.current.setGridOption('quickFilterText', quickFilter);
    }
  }, [quickFilter]);

  if (!dataset) return null;

  return (
    <div
      className={cn(
        'ag-theme-quartz-dark w-full h-full',
        'border border-[var(--crt-border)] rounded-md overflow-hidden'
      )}
    >
      <AgGridReact
        ref={gridRef}
        rowData={dataset.rows}
        columnDefs={columnDefs}
        defaultColDef={{
          editable: true,
          sortable: true,
          filter: true,
          resizable: true,
          minWidth: 80,
        }}
        quickFilterText={quickFilter}
        rowSelection="multiple"
        onSelectionChanged={onSelectionChanged}
        onCellValueChanged={onCellValueChanged}
        onGridReady={onGridReady}
        pagination={true}
        paginationPageSize={50}
        paginationPageSizeSelector={[25, 50, 100, 250, 500]}
        animateRows={true}
        enableCellTextSelection={true}
        suppressRowClickSelection={false}
        rowHeight={36}
        headerHeight={40}
      />
    </div>
  );
}

/* ============================================================
   Cell Renderers
   ============================================================ */

function BooleanCellRenderer(params: { value: unknown }) {
  const originalVal = String(params.value ?? '');
  const val = originalVal.toLowerCase().trim();
  const isTrue = ['true', 'yes', '1', 'y', 't'].includes(val);
  const isFalse = ['false', 'no', '0', 'n', 'f'].includes(val);

  if (isTrue) {
    return (
      <span className="inline-flex items-center gap-1 text-crt-green text-xs">
        <span className="w-2 h-2 rounded-full bg-[var(--crt-green)]" />
        YES
      </span>
    );
  }
  if (isFalse) {
    return (
      <span className="inline-flex items-center gap-1 text-crt-danger text-xs">
        <span className="w-2 h-2 rounded-full bg-[var(--crt-danger)]" />
        NO
      </span>
    );
  }
  return <span className="text-crt-muted text-xs">{originalVal}</span>;
}

function EmailCellRenderer(params: { value: unknown }) {
  const val = String(params.value ?? '');
  return (
    <span className="text-crt-blue text-xs underline decoration-dotted underline-offset-2 cursor-pointer">
      {val}
    </span>
  );
}

function UrlCellRenderer(params: { value: unknown }) {
  const val = String(params.value ?? '');
  return (
    <a
      href={val.startsWith('http') ? val : `https://${val}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-crt-blue text-xs underline decoration-dotted underline-offset-2 hover:text-crt-green transition-colors"
      onClick={(e) => e.stopPropagation()}
    >
      {val}
    </a>
  );
}

/* ============================================================
   Helpers
   ============================================================ */

function getCellStyle(type: DataType): Record<string, string> {
  switch (type) {
    case DataType.Integer:
    case DataType.Float:
      return { color: 'var(--crt-amber)', fontVariantNumeric: 'tabular-nums' };
    case DataType.Boolean:
      return {};
    case DataType.Date:
      return { color: 'var(--crt-blue)' };
    case DataType.Email:
    case DataType.URL:
      return { color: 'var(--crt-blue)' };
    case DataType.Phone:
      return { color: 'var(--crt-amber)' };
    default:
      return { color: 'var(--crt-white)' };
  }
}
