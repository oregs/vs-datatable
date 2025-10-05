import { ref, computed, type Ref } from 'vue'
import type { ColumnFilter, Column } from '@/types/datatable'
import { initFilter } from '@/utils/filters'

export function useColumnFilter<T extends Record<string, any>>(
  data: Ref<T[]>,
  columns: Column<T>[]
) {
  const filters = ref<Record<string, ColumnFilter>>({})

  const filteredData = computed(() => {
    return data.value.filter((row) => {
      return columns.every((col) => {
        const filter = filters.value[col.field]
        if (!filter) return true

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

          case 'custom': {
            const cellValue = String(row[col.field] ?? '')
            if (filter.value == null || filter.value === '') return true
            return cellValue === String(filter.value)
          }

          default:
            return true
        }
      })
    })
  })

  // Set or update a filter
  function setFilter(columnKey: string, filter?: ColumnFilter, type?: ColumnFilter['type']) {
    if (filter) {
      filters.value[columnKey] = initFilter(filter.type, filter)
    } else if (type) {
      filters.value[columnKey] = initFilter(type)
    }
  }

  // Clear a filter
  function clearFilter(columnKey: string, type?: ColumnFilter['type']) {
    if (type) {
      filters.value[columnKey] = initFilter(type)
    } else {
      delete filters.value[columnKey]
    }
  }

  return {
    filters,
    filteredData,
    setFilter,
    clearFilter,
  }
}
