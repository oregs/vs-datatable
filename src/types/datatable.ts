import type { filterFns } from '@/utils/filterFns'
import { type Ref, type ComputedRef } from 'vue'
/**
 * VsDataTable Types and Interfaces
 */

export interface Column<T = any> {
  label: string
  field: keyof T & string
  width?: string
  sortable?: boolean
  isKey?: boolean
  filter?: {
    type: FilterType
    operators?: string[]
    asyncOptions?: () => Promise<string[]>
    filterFn?: (cellValue: any, filterValue: any, row: Record<string, any>) => boolean
    filterKey?: string
    custom?: string
    // options?: string[]
    // operators?: FilterOperator[]
  }
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
export type FilterType = 'text' | 'multi-select' | 'number-range' | 'date-range' | 'custom'

export interface BaseFilter {
  type: FilterType
}

export interface FilterOperator {
  value: string
  label: string
}

export interface TextFilter extends BaseFilter {
  type: 'text'
  value?: string
  operator?:
    | 'contains'
    | 'doesNotContains'
    | 'equals'
    | 'doesNotEqual'
    | 'startsWith'
    | 'endsWith'
    | 'empty'
    | 'notEmpty'
}

export interface MultiSelectFilter extends BaseFilter {
  type: 'multi-select'
  operator?: 'in' | 'notIn'
  value?: string[]
}

export interface NumberRangeFilter extends BaseFilter {
  type: 'number-range'
  operator?: 'equals' | 'notEqual' | 'greaterThan' | 'lessThan' | 'between' | 'empty' | 'notEmpty'
  value?: number | null
  min?: number | null
  max?: number | null
}

export interface DateRangeFilter extends BaseFilter {
  type: 'date-range'
  operator?: 'between' | 'equals' | 'notEqual' | 'before' | 'after' | 'empty' | 'notEmpty'
  value?: string | null
  start?: string | null
  end?: string | null
}

export interface CustomFilter extends BaseFilter {
  type: 'custom'
  operator?: string
  value?: any
  filterKey?: keyof typeof filterFns
  filterFn?: (cellValue: any, filterValue: any, row?: any) => boolean
  custom: string,
}

export type ColumnFilter =
  | TextFilter
  | MultiSelectFilter
  | NumberRangeFilter
  | DateRangeFilter
  | CustomFilter

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
  rowsPerPage?: number
  rowKey?: string | ((item: any, index: number) => string | number)
  expanded?: (string | number)[]
  expandable?: boolean
  accordion?: boolean
}

export interface DataTableEmits {
  // Pagination & server
  (event: 'update:serverItemsLength', value: number | undefined): void
  (event: 'update:serverOptions', value: ServerOptions): void
  (event: 'pageUpdated', value: number): void
  
  // Search / typing
  (event: 'inputTyped', value: string): void
  
  // Sorting
  (event: 'update:sort', value: Sort[]): void
  (event: 'sortChanged', payload: { sort: Sort[] }): void
  
  // Selection
  (event: 'update:itemSelected', value: any[]): void
  (event: 'rowSelected', row: any, index: number): void
  (event: 'rowDeselected', row: any, index: number): void
  (event: 'allRowsSelected', rows: any[]): void
  
   // Row interaction
  (event: 'rowClick', row: any, index: number): void

  // Table lifecycle
  (event: 'tableBeforeMount'): void
  (event: 'tableMounted'): void
  (event: 'tableUnmounted'): void

  // Data lifecycle
  (event: 'dataLoaded', data: any[]): void
  (event: 'dataError', error: any): void

  // Expansion
  (event: 'update:expanded', value: (string | number)[]): void
  (event: 'expandRow', payload: ExpandEventPayload): void
  (event: 'collapseRow', payload: CollapseEventPayload): void

  // Filtering
  (event: 'filterChange', payload: Record<string, ColumnFilter>): void
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
