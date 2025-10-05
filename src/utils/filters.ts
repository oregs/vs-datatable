import type { ColumnFilter, TextFilter, MultiSelectFilter, NumberRangeFilter, DateRangeFilter, CustomFilter } from '@/types/datatable'

/**
 * Returns a fully initialized filter of a given type.
 * If `existing` is provided and matches the type, its values are merged.
 */
// export function initFilter(type: ColumnFilter['type'], existing?: ColumnFilter): ColumnFilter {
//   let defaults: ColumnFilter

//   switch (type) {
//     case 'text':
//       defaults = { type, value: '', operator: 'contains' }
//       if (existing?.type === 'text') {
//         return { ...defaults, ...existing }
//       }
//       return defaults

//     case 'multi-select':
//       defaults = { type, value: [] }
//       if (existing?.type === 'multi-select') {
//         return { ...defaults, ...existing }
//       }
//       return defaults

//     case 'number-range':
//       defaults = { type, operator: 'between', value: null, min: null, max: null }
//       if (existing?.type === 'number-range') {
//         return { ...defaults, ...existing }
//       }
//       return defaults

//     case 'date-range':
//       defaults = { type, operator: 'between', value: null, start: null, end: null }
//       if (existing?.type === 'date-range') {
//         return { ...defaults, ...existing }
//       }
//       return defaults

//     case 'custom':
//       defaults = { type, custom: '' }
//       if (existing?.type === 'custom') return { value: '' }
//       return defaults
//   }
// }

export function initFilter(
  type: ColumnFilter['type'],
  existing?: ColumnFilter
): ColumnFilter {
  switch (type) {
    case 'text': {
      const defaults: TextFilter = { type, value: '', operator: 'contains' }
      return existing?.type === 'text' ? { ...defaults, ...existing } : defaults
    }

    case 'multi-select': {
      const defaults: MultiSelectFilter = { type, value: [] }
      return existing?.type === 'multi-select' ? { ...defaults, ...existing } : defaults
    }

    case 'number-range': {
      const defaults: NumberRangeFilter = { type, operator: 'between', value: null, min: null, max: null }
      return existing?.type === 'number-range' ? { ...defaults, ...existing } : defaults
    }

    case 'date-range': {
      const defaults: DateRangeFilter = { type, operator: 'between', value: null, start: null, end: null }
      return existing?.type === 'date-range' ? { ...defaults, ...existing } : defaults
    }

    case 'custom': {
      const defaults: CustomFilter = { type, custom: '', value: null }
      return existing?.type === 'custom' ? { ...defaults, ...existing } : defaults
    }

    default:
      throw new Error(`Unsupported filter type: ${type}`)
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
      if (['equals', 'notEqual', 'greaterThan', 'lessThan'].includes(filter.operator ?? '')) {
        return filter.value != null
      }
      if (['empty', 'notEmpty'].includes(filter.operator ?? '')) {
        return true
      }
      return false

    case 'date-range':
      if (filter.operator === 'between') {
        return !!filter.start || !!filter.end
      }
      if (['equals', 'notEqual', 'before', 'after'].includes(filter.operator ?? '')) {
        return filter.value != null && filter.value != ''
      }
      if (['empty', 'notEmpty'].includes(filter.operator ?? '')) {
        return true
      }
      return false

    case 'custom':
        return filter.value != null && filter.value !== ''

    default:
      return false
  }
}
