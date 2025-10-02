import { ref, computed, type Ref } from "vue"
import type { ColumnFilter, Column } from "@/types/datatable"
import { initFilter } from "@/utils/filters"

export function useColumnFilter<T extends Record<string, any>>(data: Ref<T[]>, columns: Column<T>[]) {
  // filters state: key = column.field
  const filters = ref<Record<string, ColumnFilter>>({})

  // Computed filtered data
  const filteredData: Ref<T[]> = computed(() => {
    return data.value.filter((row) => {
      return columns.every((col) => {
        const filter = filters.value[col.field]
        if (!filter) return true

        switch (filter.type) {
          case "text": {
            if (!filter.value) return true
            return String(row[col.field] ?? "")
              .toLowerCase()
              .includes(filter.value.toLowerCase())
          }
          case "multi-select": {
            if (!filter.value?.length) return true
            return filter.value.includes(String(row[col.field] ?? ""))
          }
          case "number-range": {
            const num = Number(row[col.field])
            if (filter.min != null && num < filter.min) return false
            if (filter.max != null && num > filter.max) return false
            return true
          }
          case "date-range": {
            const date = new Date(String(row[col.field]))
            if (filter.start && date < new Date(filter.start)) return false
            if (filter.end && date > new Date(filter.end)) return false
            return true
          }
          default:
            return true
        }
      })
    })
  })

  // Set or update a filter
  function setFilter(columnKey: string, filter?: ColumnFilter, type?: ColumnFilter["type"]) {
    if (filter) {
      filters.value[columnKey] = initFilter(filter.type, filter)
    } else if (type) {
      filters.value[columnKey] = initFilter(type)
    }
  }

  // Clear a filter
  function clearFilter(columnKey: string, type?: ColumnFilter["type"]) {
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
