export const filterFns: Record<
  string,
  (row: Record<string, any>, field: string, filter: any) => boolean
> = {
  text: (row, field, filter) => {
    const cellValue = String(row[field] ?? '').toLowerCase()
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
  },

  'multi-select': (row, field, filter) => {
    if (!filter.value?.length) return true
    return filter.value.includes(String(row[field]))
  },

  'number-range': (row, field, filter) => {
    const num = Number(row[field])
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
        return row[field] == null || row[field] === ''
      case 'notEmpty':
        return row[field] != null && row[field] !== ''
      default:
        return true
    }
  },

  'date-range': (row, field, filter) => {
    const date = new Date(String(row[field]))
    if (isNaN(date.getTime())) return false

    const value = filter.value ?? null
    const start = filter.start ? new Date(filter.start) : null
    const end = filter.end ? new Date(filter.end) : null
    const operator = filter.operator ?? 'between'

    switch (operator) {
      case 'between':
        if (start && date < start) return false
        if (end && date > end) return false
        return true
      case 'equals':
        if (!value) return true
        return date.toDateString() === new Date(value).toDateString()
      case 'notEqual':
        if (!value) return true
        return date.toDateString() !== new Date(value).toDateString()
      case 'before':
        if (!value) return true
        return date < new Date(value)
      case 'after':
        if (!value) return true
        return date > new Date(value)
      case 'empty':
        return row[field] == null || row[field] === ''
      case 'notEmpty':
        return row[field] != null && row[field] !== ''
      default:
        return true
    }
  },

  // Default handler for custom filters
  custom: (row, field, filter) => {
    const cellValue = row[field]

    if (typeof filter.filterFn === 'function') {
      return filter.filterFn(cellValue, filter.value, row)
    }

    if (
        filter.filterKey &&
        Object.prototype.hasOwnProperty.call(filterFns, filter.filterKey)
    ) {
        const fn = filterFns[filter.filterKey]
        if (typeof fn === 'function') {
          return fn(row, field, filter)
        }
    }
    
    return true
  },
}
