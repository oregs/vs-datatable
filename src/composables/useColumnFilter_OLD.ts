import { ref, computed, type Ref } from 'vue'
import type {
  ColumnFilter,
  Column,
  TextFilter,
  MultiSelectFilter,
  NumberRangeFilter,
  DateRangeFilter,
  FilterMap,
} from '@/types/datatable'

export function useColumnFilter<T>(data: Ref<T[]>, columns: Column<T>[]) {
  const filters = ref<FilterMap>({})

  const filteredData = computed(() => {
    return data.value.filter((row) => {
      return columns.every((col) => {
        const filter = filters.value[col.field]
        if (!filter) return true

        switch (filter.type) {
          case 'text': {
            if (!filter.value) return true
            const cell = String(row[col.field]).toLowerCase()
            const search = filter.value.toLowerCase()
            switch (filter.operator) {
              case 'equals':
                return cell === search
              case 'startsWith':
                return cell.startsWith(search)
              case 'endsWith':
                return cell.endsWith(search)
              case 'contains':
              default:
                return cell.includes(search)
            }
          }

          case 'multi-select': {
            const f = filter as MultiSelectFilter
            if (!f.value?.length) return true
            return f.value.includes(String(row[col.field]))
          }

          case 'number-range': {
            const f = filter as NumberRangeFilter
            const num = Number(row[col.field])
            if (f.min != null && num < f.min) return false
            if (f.max != null && num > f.max) return false
            return true
          }

          case 'date-range': {
            const f = filter as DateRangeFilter
            const date = new Date(String(row[col.field]))
            if (f.start && date < new Date(f.start)) return false
            if (f.end && date > new Date(f.end)) return false
            return true
          }

          default:
            return true
        }
      })
    })
  })

  function setFilter(columnKey: string, filter: ColumnFilter) {
    filters.value[columnKey] = filter
  }

  function clearFilter(columnKey: string) {
    delete filters.value[columnKey]
  }

  return {
    filters,
    filteredData,
    setFilter,
    clearFilter,
  }
}
