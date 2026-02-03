import { ref, computed, watch, type Ref } from 'vue'
import type { ColumnFilter, Column, DateRangeFilter, CustomFilter, NumberRangeFilter, MultiSelectFilter, TextFilter } from '@/types/datatable'
import { initFilter } from '@/utils/filters'
import { filterFns } from '@/utils/filterFns'

export interface NormalizedServerFilter {
  type: string
  operator?: string
  value?: any
  min?: number | null
  max?: number | null
  start?: string | null
  end?: string | null
  filterKey?: string
}

interface UseColumnFilterOptions {
  serverMode?: boolean
  onServerFilter?: (filters: Record<string, NormalizedServerFilter>) => void
}

export function useColumnFilter<T extends Record<string, any>>(
  data: Ref<T[]>,
  columns: Column<T>[],
  options?: UseColumnFilterOptions
) {
  const filters = ref<Record<string, ColumnFilter>>({})

  const filteredData = computed(() => {
    console.log('InitFilter Filtered:', data.value)

    if (options?.serverMode) return data.value 

    return data.value.filter((row) => {
      return columns.every((col) => {   
        if (!col.field) return true     
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

  // Notify parent on server mode
  watch(
    filters,
    (newFilters) => {
      if (options?.serverMode && options.onServerFilter) {
        const normalizedFilters = Object.entries(newFilters).reduce(
          (acc, [field, filter]) => {
            if (!filter?.type) return acc

            const base = {
              type: filter.type,
              operator: (filter as any).operator,
            }

            switch (filter.type) {
              case 'text':
                acc[field] = {
                  ...base,
                  value: (filter as TextFilter).value ?? null,
                }
                break

              case 'multi-select':
                acc[field] = {
                  ...base,
                  value: (filter as MultiSelectFilter).value ?? [],
                }
                break

              case 'number-range':
                acc[field] = {
                  ...base,
                  value: (filter as NumberRangeFilter).value ?? null,
                  min: (filter as NumberRangeFilter).min ?? null,
                  max: (filter as NumberRangeFilter).max ?? null,
                }
                break

              case 'date-range':
                acc[field] = {
                  ...base,
                  value: (filter as DateRangeFilter).value ?? null,
                  start: (filter as DateRangeFilter).start ?? null,
                  end: (filter as DateRangeFilter).end ?? null,
                }
                break

              case 'custom':
                acc[field] = {
                  ...base,
                  value: (filter as CustomFilter).value,
                  filterKey: (filter as CustomFilter).filterKey,
                }
                break
            }

            return acc
          },
          {} as Record<string, NormalizedServerFilter>
        )

        options.onServerFilter(normalizedFilters)
      }
    },
    { deep: true }
  )
  
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
    clearFilter
  }
}
