import { ref, computed, type Ref } from 'vue'
import type { ColumnFilter, Column } from '@/types/datatable'
import { initFilter } from '@/utils/filters'

export function useColumnFilter<T extends Record<string, any>>(
  data: Ref<T[]>,
  columns: Column<T>[]
) {
  const filters = ref<Record<string, ColumnFilter>>({})

  // const filteredData = computed(() => {
  //   return data.value.filter((row) => {
  //     return columns.every((col) => {
  //       const filter = filters.value[col.field]
  //       if (!filter) return true

  //       switch (filter.type) {
  //         case 'text': {
  //           const cellValue = String(row[col.field] ?? '').toLowerCase()
  //           const search = (filter.value ?? '').toLowerCase().trim()

  //           if (!search && !['empty', 'notEmpty'].includes(filter.operator ?? '')) return true

  //           switch (filter.operator) {
  //             case 'contains':
  //               return cellValue.includes(search)
  //             case 'doesNotContains':
  //               return !cellValue.includes(search)
  //             case 'equals':
  //               return cellValue === search
  //             case 'doesNotEqual':
  //               return cellValue !== search
  //             case 'startsWith':
  //               return cellValue.startsWith(search)
  //             case 'endsWith':
  //               return cellValue.endsWith(search)
  //             case 'empty':
  //               return cellValue.trim() === ''
  //             case 'notEmpty':
  //               return cellValue.trim() !== ''
  //             default:
  //               return true
  //           }
  //         }

  //         case 'multi-select': {
  //           if (!filter.value?.length) return true
  //           return filter.value.includes(String(row[col.field]))
  //         }

  //         case 'number-range': {
  //           const num = Number(row[col.field])
  //           if (isNaN(num)) return false

  //           switch (filter.operator) {
  //             case 'equals': return num === filter.value
  //             case 'notEqual': return num !== filter.value
  //             case 'greaterThan': return filter.value != null ? num > filter.value : true
  //             case 'lessThan': return filter.value != null ? num < filter.value : true
  //             case 'between': {
  //               const minOk = filter.min != null ? num >= filter.min : true
  //               const maxOk = filter.max != null ? num <= filter.max : true
  //               return minOk && maxOk
  //             }
  //             case 'empty': return row[col.field] == null || row[col.field] === ''
  //             case 'notEmpty': return row[col.field] != null && row[col.field] !== ''
  //             default: {
  //               if (filter.min != null && num < filter.min) return false
  //               if (filter.max != null && num > filter.max) return false
  //               return true
  //             }
  //           }
  //         }

  //         case 'date-range': {
  //           const date = new Date(String(row[col.field]))
  //           if (isNaN(date.getTime())) return false
  //           if (filter.start && date < new Date(filter.start)) return false
  //           if (filter.end && date > new Date(filter.end)) return false
  //           return true
  //         }

  //         default:
  //           return true
  //       }
  //     })
  //   })
  // })

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
            if (isNaN(date.getTime())) return false
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
