import { type Ref, type ComputedRef } from 'vue'
/**
 * VsDataTable Types and Interfaces
 */

export interface Column <T = any> {
  label: string
  field: keyof T & string;
  width?: string
  sortable?: boolean
  isKey?: boolean
  filter?: {
    type: FilterType;
    options?: string[];
    operators?: FilterOperator[];
  };
}

export interface Sort {
  field: string
  order: 'asc' | 'desc'
  priority?: number
}

export interface ServerOptions {
  page: number
  rowsPerPage: number
  sort?: Sort[]
  [key: string]: any
}

export interface Row {
  id: string | number
  [key: string]: any
}

export interface ExpandEventPayload<Row = any> {
  row: Row
  index: number
  rowId: string | number
}

export interface CollapseEventPayload<Row = any> {
  row: Row
  index: number
  rowId: string | number
}

// Column Filter Types
export type FilterType =
  | "text"
  | "multi-select"
  | "number-range"
  | "date-range"
  | "custom";

export interface FilterOperator {
  value: string;
  label: string;
}

export interface TextFilter {
  type: "text";
  value?: string;
  operator?: "contains" | "equals" | "startsWith" | "endsWith"
}

export interface MultiSelectFilter {
  type: "multi-select";
  value?: string[];
}

export interface NumberRangeFilter {
  type: "number-range";
  min?: number | null;
  max?: number | null;
}

export interface DateRangeFilter {
  type: "date-range";
  start?: string | null; // ISO string
  end?: string | null;
}

export type ColumnFilter =
  | TextFilter
  | MultiSelectFilter
  | NumberRangeFilter
  | DateRangeFilter

export type FilterMap = Record<string, ColumnFilter | undefined>

export interface DataTableProps {
  rows?: Row[]
  itemSelected?: any[] | null
  tablename?: string
  sort?: Sort[]
  serverItemsLength?: number
  serverOptions?: ServerOptions | null
  showHeader?: boolean
  headerText?: string
  loading?: boolean
  columns: Column[]
  tableClass?: string | string[] | Record<string, any>
  rowClass?: string | string[] | Record<string, any>
  showFooter?: boolean
  containerClass?: string | string[] | Record<string, any>
  headerClass?: string | string[] | Record<string, any>
  cellClass?: string | string[] | Record<string, any>
  showSearch?: boolean
  searchClass?: string | string[] | Record<string, any>
  searchPlaceholder?: string
  paginationClass?: string | string[] | Record<string, any>
  loadingText?: string
  noDataText?: string
  noDataDescription?: string
  entriesText?: string
  maxVisiblePages?: number
  rowsPerPage?:number
  rowKey?: string | ((item: any, index: number) => string | number)
  expanded?: (string | number)[]
  expandable?: boolean
  accordion?: boolean
}

export interface DataTableEmits {
  (event: 'update:itemSelected', value: any[]): void
  (event: 'update:serverItemsLength', value: number | undefined): void
  (event: 'update:serverOptions', value: ServerOptions): void
  (event: 'update:sort', value: Sort[]): void
  (event: 'input-typed', value: string): void
  (event: 'page-updated', value: number): void
  (event: 'sort-changed', payload: { sort: Sort[] }): void
  (event: 'row-click', row: any, index: number): void
  (event: 'row-selected', row: any, index: number): void
  (event: 'row-deselected', row: any, index: number): void
  (event: 'all-rows-selected', rows: any[]): void
  (event: 'table:mounted'): void
  (event: 'table:unmounted'): void
  (event: 'table:before-mount'): void
  (event: 'data-loaded', data: any[]): void
  (event: 'data-error', error: any): void
  (event: "update:expanded", value: (string | number)[]): void
  (event: 'expand-row', payload: ExpandEventPayload): void
  (event: 'collapse-row', payload: CollapseEventPayload): void
}

export interface RecordRange {
  start: number
  end: number
}

export interface SortHelpers {
  isColumnSorted: (field: string) => boolean
  getSortPriority: (field: string) => number | null
  getSortOrder: (field: string) => string | null
  handleSort: (field: string, event: MouseEvent) => void
}

export interface PaginationHelpers {
  page: Ref<number>
  totalRecords: Ref<number>
  recordRange: ComputedRef<RecordRange>
  handlePageChange: (newPage: number) => void
}

export interface SelectionHelpers {
  selectedItems: ComputedRef<any[]>
  isItemSelectedControlled: ComputedRef<boolean>
  isAllChecked: ComputedRef<boolean>
  isSomeChecked: ComputedRef<boolean>
  toggleRow: (row: any, index: number) => void
  toggleAll: (event: Event) => void
}

export interface SearchHelpers {
  searchQuery: Ref<string>
  onInputTyped: (value: string) => void
}

// Re-export for convenience
export type { Ref, ComputedRef } from 'vue'
