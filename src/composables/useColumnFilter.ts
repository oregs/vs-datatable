import { ref, computed, type Ref } from "vue"
import type { ColumnFilter, Column } from "@/types/datatable"
import { ensureFilter, createFilter } from "@/utils/filters"

export function useColumnFilter<T>(data: Ref<T[]>, columns: Column<T>[]) {
  const filters = ref<Record<string, ColumnFilter>>({})

  const filteredData = computed(() => {
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

  function setFilter(columnKey: string, filter: ColumnFilter) {
    filters.value[columnKey] = ensureFilter(filter, filter.type)
  }

  function clearFilter(columnKey: string, type?: ColumnFilter["type"]) {
    if (type) {
      // reset to default filter if type is known
      filters.value[columnKey] = createFilter(type)
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
