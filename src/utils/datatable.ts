/**
 * VsDataTable Utility Functions
 */

import type { Column, Sort } from '@/types/datatable'

/**
 * Get nested value from object using dot notation
 * @param obj - The object to traverse
 * @param path - The path to the value (e.g., 'user.profile.name')
 * @returns The value at the path or empty string
 */
export function getValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => acc?.[key], obj) ?? ''
}

/**
 * Get row key for identification
 * @param item - The row item
 * @param index - The row index
 * @param rowKey - The row key field or function
 * @returns The unique key for the row
 */
export function getRowKey(
  item: any, 
  index: number, 
  rowKey: string | ((item: any, index: number) => string | number) = 'id'
): string | number {
  if (typeof rowKey === 'function') {
    return rowKey(item, index)
  }
  return item[rowKey] || index
}

/**
 * Check if a row is selected
 * @param item - The row item to check
 * @param selectedItems - Array of selected items
 * @param rowKey - The row key field or function
 * @returns True if the row is selected
 */
export function isRowSelected(
  item: any, 
  selectedItems: any[], 
  rowKey: string | ((item: any, index: number) => string | number) = 'id'
): boolean {
  return selectedItems.some(selected => 
    getRowKey(selected, -1, rowKey) === getRowKey(item, -1, rowKey)
  )
}

/**
 * Calculate total columns including checkbox column
 * @param columns - Array of column definitions
 * @param hasCheckbox - Whether checkbox column is present
 * @returns Total number of columns
 */
export function calculateTotalColumns(columns: Column[], hasCheckbox: boolean): number {
  return columns.length + (hasCheckbox ? 1 : 0)
}

/**
 * Sort array of objects by multiple criteria
 * @param array - Array to sort
 * @param sortCriteria - Array of sort criteria
 * @returns Sorted array
 */
export function sortArray(array: any[], sortCriteria: Sort[]): any[] {
  if (!sortCriteria.length) return array

  const getNested = (obj: any, path: string) =>
    path.split('.').reduce((acc, key) => acc?.[key], obj) ?? ''

  return [...array].sort((a, b) => {
    for (const { field, order } of sortCriteria) {
      const aValue = getNested(a, field)
      const bValue = getNested(b, field)

      if (aValue === bValue) continue
      if (order === 'asc') return aValue > bValue ? 1 : -1
      return aValue < bValue ? 1 : -1
    }
    return 0
  })
}

/**
 * Generic paginate function
 * @param rows - Array of sorted rows
 * @param page - Current page
 * @param rowsPerPage - Number of rows per page
 * @returns Object with start and end indices
 */
export function paginateRows<T>(
  rows: T[],
  page: number,
  rowsPerPage?: number
): T[] {
  if (!rowsPerPage) return rows
  const start = (page - 1) * rowsPerPage
  const end = start + rowsPerPage
  return rows.slice(start, end)
}

/**
 * Calculate record range for pagination display
 * @param page - Current page number
 * @param rowsPerPage - Number of rows per page
 * @param totalRecords - Total number of records
 * @returns Object with start and end indices
 */
export function calculateRecordRange(
  page: number, 
  rowsPerPage: number, 
  totalRecords: number
): { start: number; end: number } {
  const start = (page - 1) * rowsPerPage + 1
  const end = Math.min(page * rowsPerPage, totalRecords)
  return { start, end }
}

/**
 * Validate column configuration
 * @param columns - Array of column definitions
 * @returns Array of validation errors
 */
export function validateColumns(columns: Column[]): string[] {
  const errors: string[] = []
  
  if (!Array.isArray(columns)) {
    errors.push('Columns must be an array')
    return errors
  }
  
  if (columns.length === 0) {
    errors.push('At least one column is required')
    return errors
  }
  
  columns.forEach((column, index) => {
    if (!column.label) {
      errors.push(`Column ${index}: label is required`)
    }
    if (!column.field) {
      errors.push(`Column ${index}: field is required`)
    }
    if (column.width && !/^\d+%?$/.test(column.width)) {
      errors.push(`Column ${index}: width must be a number or percentage`)
    }
  })
  
  return errors
}

/**
 * Generate unique table ID
 * @param prefix - Prefix for the ID
 * @returns Unique table ID
 */
export function generateTableId(prefix: string = 'vs-table'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Check if server-side mode is active
 * @param serverOptions - Server options object
 * @returns True if server-side mode is active
 */
export function isServerMode(serverOptions: any): boolean {
  return serverOptions !== null && serverOptions !== undefined
}

/**
 * Deep clone an object
 * @param obj - Object to clone
 * @returns Cloned object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as any
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any
  if (typeof obj === 'object') {
    const clonedObj = {} as any
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  return obj
}

/**
 * Calculate total pages
 * @param totalRecords - total records
 * @param rowsPerPage - rows per page
 * @returns total number of pages
 */
export function calcTotalPages(totalRecords: number, rowsPerPage: number): number {
  return Math.ceil(totalRecords / rowsPerPage)
}

/**
 * Filter
 * @param totalRecords - total records
 * @param rowsPerPage - rows per page
 * @returns total number of pages
 */
export function filterRowsByQuery<T extends Record<string, any>>(
  resultRows: T[],
  query: string,
  columns?: (keyof T)[]
): T[] {
  if (!query || query.trim() === "") return resultRows;

  const lowerQuery = query.toLowerCase();

  return resultRows.filter(row => {
    // if columns are specified, only search those
    if (columns && columns.length > 0) {
      return columns.some(col =>
        String(row[col] ?? "").toLowerCase().includes(lowerQuery)
      );
    }

    // otherwise search across all fields in row
    return (Object.values(row) as unknown[]).some(value =>
      String(value ?? "").toLowerCase().includes(lowerQuery)
    );
  });
}
