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
    props.columns,
    {
      serverMode: !!props.serverOptions,
      onServerFilter(activeFilters) {
        emit('filterChange', activeFilters)
      },
    }
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
  
    resultRows = resultRows.map((row, index) => ({
      ...row,
      isExpanded: isRowExpanded(row, index), // pass index here
    }))

    return resultRows
  })

  // Reset page when filters change
  watch(filters, () => {
    page.value = 1
  }, { deep: true })

  // Reset page when search query changes
  watch(searchQuery, () => {
    page.value = 1
  })

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
