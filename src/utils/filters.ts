import type { ColumnFilter } from '@/types/datatable'

/**
 * Returns a fully initialized filter of a given type.
 * If `existing` is provided and matches the type, its values are merged.
 */
export function initFilter(type: ColumnFilter['type'], existing?: ColumnFilter): ColumnFilter {
  let defaults: ColumnFilter

  switch (type) {
    case 'text':
      defaults = { type, value: '', operator: 'contains' }
      if (existing?.type === 'text') {
        return { ...defaults, ...existing }
      }
      return defaults

    case 'multi-select':
      defaults = { type, value: [] }
      if (existing?.type === 'multi-select') {
        return { ...defaults, ...existing }
      }
      return defaults

    case 'number-range':
      defaults = { type, operator: 'between', value: null, min: null, max: null }
      if (existing?.type === 'number-range') {
        return { ...defaults, ...existing }
      }
      return defaults

    case 'date-range':
      defaults = { type, start: null, end: null }
      if (existing?.type === 'date-range') {
        return { ...defaults, ...existing }
      }
      return defaults
  }
}

/**
 * Optional helper to check if a filter has a value
 */
export function hasValue(filter: ColumnFilter): boolean {
  switch (filter.type) {
    case 'text':
      if (!filter.operator) return false
      // operators that don’t require a text value
      if (['empty', 'notEmpty'].includes(filter.operator || '')) return true
      return !!filter.value?.trim()

    case 'multi-select':
      return !!filter.value?.length

    case 'number-range':
      if (filter.operator === 'between') {
        return filter.min != null || filter.max != null
      }
      if (['equals', 'notEquals', 'greaterThan', 'lessThan'].includes(filter.operator ?? '')) {
        return filter.value != null
      }
      if (['empty', 'notEmpty'].includes(filter.operator ?? '')) {
        return true
      }
      return false

    // case 'number-range':
    //   switch (filter.operator) {
    //     case 'between':
    //       return filter.min != null || filter.max != null
    //     case 'equals':
    //     case 'notEqual':
    //     case 'greaterThan':
    //     case 'lessThan':
    //       return filter.value != null
    //     case 'empty':
    //     case 'notEmpty':
    //       return true
    //     default:
    //       return false
    //   }

    case 'date-range':
      return !!filter.start || !!filter.end

    default:
      return false
  }
}
