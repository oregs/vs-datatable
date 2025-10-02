import { type Ref, computed, ref, watch } from 'vue'
import { useDataTableSort } from '@/composables/useDataTableSort'
import { useDataTablePagination } from '@/composables/useDataTablePagination'
import { useDataTableRowsPerPage } from '@/composables/useDataTableRowsPerPage'
import { useDataTableSearch } from '@/composables/useDataTableSearch'
import { filterRowsByQuery, paginateRows, sortArray } from '@/utils/datatable'
import { useExpandable } from '@/composables/useExpandable'
import { useColumnFilter } from '@/composables/useColumnFilter'

export function useDataTable<T>(props: any, emit: any) {
  // --- Pagination
  const page = ref<number>(1)
  const rowsPerPage = ref(props.serverOptions?.rowsPerPage ?? props.rowsPerPage)
  const searchQuery = ref<string>('')

  // --- Expandable rows
  const { isRowExpanded, toggleRowExpansion, getRowId, setRowLoading, isRowLoading } =
    useExpandable(props, emit)

  // --- Column filters
  const { filters, filteredData, setFilter, clearFilter } = useColumnFilter(
    ref(props.rows as Record<string, any>[]),
    props.columns
  )

  // --- Sort
  const { activeSort, sortHelpers } = useDataTableSort(props, emit, page)

  // --- Search
  const { onInputTyped } = useDataTableSearch(emit, searchQuery)

  // --- Pagination helpers
  const { totalRecords, recordRange, handlePageChange } = useDataTablePagination(
    props,
    emit,
    page,
    rowsPerPage,
    computed(() => processedRows.value)
  )
  const { handleRowsPerPage } = useDataTableRowsPerPage(props, emit, page, rowsPerPage)

  // --- Processed rows: apply filters, search, then sort
  const filteredAndSearched = computed(() => {
    let result = filteredData.value

    // Apply search
    if (searchQuery.value) {
      result = filterRowsByQuery(result, searchQuery.value)
    }

    return result
  })

  const processedRows = computed(() => {
    let resultRows = filteredAndSearched.value
  
    // Only apply client-side operations if not in server mode
    if (!props.serverOptions) {
      // Apply search filter
      if (searchQuery.value) {
        resultRows = filterRowsByQuery(resultRows, searchQuery.value)
      }
  
      // Apply sorting
      if (activeSort.value.length) {
        resultRows = sortArray(resultRows, activeSort.value)
      }
    }
  
    return resultRows.map((row, index) => ({
      ...row,
      isExpanded: isRowExpanded(row, index), // pass index here
    }))

    return resultRows
  })

  // const processedRows = computed(() => {
  //   let rowsToSort = filteredAndSearched.value

  //   if (activeSort.value.length) {
  //     rowsToSort = [...rowsToSort] // copy before sort
  //     rowsToSort.sort((a, b) => {
  //       for (const s of activeSort.value) {
  //         const valA = a[s.field]
  //         const valB = b[s.field]
  //         if (valA == valB) continue
  //         return s.order === 'asc' ? (valA > valB ? 1 : -1) : valA > valB ? -1 : 1
  //       }
  //       return 0
  //     })
  //   }

  //   return rowsToSort
  // })

  // --- Paginated rows
  const paginatedRows = computed(() =>
    paginateRows(processedRows.value, page.value, rowsPerPage.value)
  )

  return {
    // Pagination
    page,
    totalRecords,
    recordRange,
    handlePageChange,
    rowsPerPage,
    handleRowsPerPage,

    // Sorting
    processedRows,
    paginatedRows,
    sortHelpers,

    // Search
    searchQuery,
    onInputTyped,

    // Expandable
    isRowExpanded,
    toggleRowExpansion,
    getRowId,
    setRowLoading,
    isRowLoading,

    // Column filters
    filters,
    filteredData,
    setFilter,
    clearFilter,
  }
}
