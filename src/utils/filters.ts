import type { 
  ColumnFilter, 
  TextFilter, 
  MultiSelectFilter, 
  NumberRangeFilter, 
  DateRangeFilter, 
  CustomFilter, 
  Column 
} from '@/types/datatable'
import { filterFns } from './filterFns'


/**
 * Returns a fully initialized filter of a given type.
 * If `existing` is provided and matches the type, its values are merged.
 */
export function initFilter(
  type: ColumnFilter['type'],
  existing?: ColumnFilter
): ColumnFilter {
  const base = {
    type,
    operator: existing?.operator,
    value: existing?.value ?? null,
  }

  switch (type) {
    case 'text': {
      const defaults: TextFilter = { type, value: '', operator: 'contains' }
      return existing?.type === 'text' ? { ...defaults, ...existing } : defaults
    }

    case 'multi-select': {
      const defaults: MultiSelectFilter = { type, value: [], operator: 'in' }
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

    case 'custom':
      const defaults: CustomFilter = { type, value: null, operator: base.operator ?? 'equals', custom: '', filterFn: undefined }
      if (existing?.type === 'custom') {
        return { ...defaults, ...existing }
      }
      return defaults

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

export function applyColumnFilter(row: any, col: Column, filter: ColumnFilter): boolean {
  switch (filter.type) {
    case 'text': {
      const cellValue = String(row[col.field] ?? '').toLowerCase()
      const search = (filter.value ?? '').toLowerCase().trim()

      if (!search && !['empty', 'notEmpty'].includes(filter.operator ?? '')) return true

      switch (filter.operator) {
        case 'contains':
          return cellValue.includes(search)
        case 'doesNotContains':
          return !cellValue.includes(search)
        case 'equals':
          return cellValue === search
        case 'doesNotEqual':
          return cellValue !== search
        case 'startsWith':
          return cellValue.startsWith(search)
        case 'endsWith':
          return cellValue.endsWith(search)
        case 'empty':
          return cellValue.trim() === ''
        case 'notEmpty':
          return cellValue.trim() !== ''
        default:
          return true
      }
    }

    case 'multi-select': {
      if (!filter.value?.length) return true
      return filter.value.includes(String(row[col.field]))
    }

    case 'number-range': {
      const num = Number(row[col.field])
      if (isNaN(num)) return false

      switch (filter.operator) {
        case 'between':
          if (filter.min != null && num < filter.min) return false
          if (filter.max != null && num > filter.max) return false
          return true
        case 'equals':
          return num === Number(filter.value)
        case 'notEqual':
          return num !== Number(filter.value)
        case 'greaterThan':
          return num > Number(filter.value)
        case 'lessThan':
          return num < Number(filter.value)
        case 'empty':
          return row[col.field] == null || row[col.field] === ''
        case 'notEmpty':
          return row[col.field] != null && row[col.field] !== ''
        default:
          return true
      }
    }

    case 'date-range': {
      const date = new Date(String(row[col.field]))
      // if (isNaN(date.getTime())) return false
      const value = filter.value ?? null
      const start = filter.start ? new Date(filter.start) : null
      const end = filter.end ? new Date(filter.end) : null

      // Ensure operator exists
      const operator = filter.operator ?? 'between'

      switch (operator) {
        case 'between':
          if (start && date < start) return false
          if (end && date > end) return false
          return true
        case 'equals':
          if (!value) return true
          return (
            date.toDateString() === new Date(value as string | number | Date).toDateString()
          )
        case 'notEqual':
          if (!value) return true
          return (
            date.toDateString() !== new Date(value as string | number | Date).toDateString()
          )
        case 'before':
          if (!value) return true
          return date < new Date(value as string | number | Date)
        case 'after':
          if (!value) return true
          return date > new Date(value as string | number | Date)
          case 'empty':
            return row[col.field] == null || row[col.field] === ''
          case 'notEmpty':
            return row[col.field] != null && row[col.field] !== ''
        default:
          return true
      }
    }

    case 'custom':
      const cellValue = row[col.field]
      if (typeof filter.filterFn === 'function') {
        return filter.filterFn(cellValue, filter.value, row)
      }

      if (filter.filterKey && filterFns[filter.filterKey]) {
        return filterFns[filter.filterKey]!(cellValue, filter.value, row)
      }

      return String(cellValue) === String(filter.value)       

    default:
      return true
  }
}
