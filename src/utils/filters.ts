// src/utils/filters.ts
import type { ColumnFilter } from '@/types/datatable'

// /**
//  * Creates a default filter object for a given type.
//  */
// export function createFilter(type: ColumnFilter['type']): ColumnFilter {
//   switch (type) {
//     case 'text':
//       return { type, value: '', operator: 'contains' }
//     case 'multi-select':
//       return { type, value: [] }
//     case 'number-range':
//       return { type, min: null, max: null }
//     case 'date-range':
//       return { type, start: null, end: null }
//   }
// }

// /**
//  * Ensures an existing filter matches the type; fills in missing properties.
//  */
// export function ensureFilter(existing: ColumnFilter | undefined, type: ColumnFilter['type']): ColumnFilter {
//   const defaults = createFilter(type)

//   if (!existing) return defaults

//   switch (type) {
//     case 'text':
//       return { ...defaults, ...(existing.type === 'text' ? existing : {}) }
//     case 'multi-select':
//       return { ...defaults, ...(existing.type === 'multi-select' ? existing : {}) }
//     case 'number-range':
//       return { ...defaults, ...(existing.type === 'number-range' ? existing : {}) }
//     case 'date-range':
//       return { ...defaults, ...(existing.type === 'date-range' ? existing : {}) }
//   }
// }


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
      defaults = { type, min: null, max: null }
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
      return !!filter.value?.trim()
    case 'multi-select':
      return !!filter.value?.length
    case 'number-range':
      return filter.min != null || filter.max != null
    case 'date-range':
      return !!filter.start || !!filter.end
  }
}
