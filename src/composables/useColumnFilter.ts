import { ref, computed, type Ref } from 'vue'
import type { ColumnFilter, Column } from '@/types/datatable'
import { initFilter } from '@/utils/filters'
import { filterFns } from '@/utils/filterFns'

export function useColumnFilter<T extends Record<string, any>>(
  data: Ref<T[]>,
  columns: Column<T>[]
) {
  const filters = ref<Record<string, ColumnFilter>>({})

  const filteredData = computed(() => {
    return data.value.filter((row) => {
      return columns.every((col) => {
        const filter = filters.value[col.field]
        if (!filter || !filter.type) return true

        // return applyColumnFilter(row, col, filter)

        const cellValue = row[col.field]

        // Custom inline filter function
        if (col.filter?.filterFn) {
          return col.filter.filterFn(cellValue, filter.value, row)
        }

        // Registered filter function by key
        if (filter.type === 'custom' && col.filter?.filterKey) {
          const customFn = filterFns[col.filter.filterKey]
          if (typeof customFn === 'function') {
            return customFn(row, col.field, filter)
          }
          return true
        }

        // Use built-in filterFn
        const fn = filterFns[filter.type]
        if (typeof fn === 'function') {
          return fn(row, col.field, filter)
        }

        return true
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
