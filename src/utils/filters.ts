import type { ColumnFilter } from '@/types/datatable'

export function createFilter(type: ColumnFilter['type']): ColumnFilter {
  switch (type) {
    case 'text':
      return { type, value: '', operator: 'contains' }
    case 'multi-select':
      return { type, value: [] } // ✅ always array
    case 'number-range':
      return { type, min: null, max: null }
    case 'date-range':
      return { type, start: null, end: null }
    default:
      return { type } as ColumnFilter
  }
}


export function ensureFilter(
  existing: ColumnFilter | undefined,
  type: ColumnFilter["type"]
): ColumnFilter {
  const defaults = createFilter(type)
  return { ...defaults, ...existing }
}