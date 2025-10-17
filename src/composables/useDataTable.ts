import { computed, ref, watch, shallowRef, unref, isRef } from 'vue'
import { useDataTableSort } from '@/composables/useDataTableSort'
import { useDataTablePagination } from '@/composables/useDataTablePagination'
import { useDataTableRowsPerPage } from '@/composables/useDataTableRowsPerPage'
import { useDataTableSearch } from '@/composables/useDataTableSearch'
import { filterRowsByQuery, paginateRows, sortArray } from '@/utils/datatable'
import { useExpandable } from '@/composables/useExpandable'
import { useColumnFilter } from '@/composables/useColumnFilter'

export function useDataTable(props: any, emit: any) {

  const rowsRef = isRef(props.rows) ? props.rows : shallowRef(props.rows)

  // --- Pagination
  const page = ref<number>(1)
  const rowsPerPage = ref(props.serverOptions?.rowsPerPage ?? props.rowsPerPage)
  const searchQuery = ref<string>('')

  const tableContainer = ref()
  const tableResponsiveRef = ref<HTMLElement | null>(null)
  const tableRef = ref()


  // --- Expandable rows
  const { isRowExpanded, toggleRowExpansion, getRowId, setRowLoading, isRowLoading } =
    useExpandable(props, emit)

  // --- Column filters
  const { filters, filteredData, setFilter, clearFilter } = useColumnFilter(
    computed(() => unref(rowsRef) as Record<string, unknown>[]),
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

  // Reset page when filters or search change
  watch([filters, searchQuery], () => (page.value = 1), { deep: true })

  // --- Paginated rows
  const paginatedRows = computed(() =>
    paginateRows(processedRows.value, page.value, rowsPerPage.value)
  )

  // --- Auto emit when large datasets change
  watch(rowsRef, (newRows) => {
    if (Array.isArray(newRows) && newRows.length > 1000) {
      console.log(`[useDataTable] Large dataset updated (${newRows.length} rows)`)
    }
  })

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

    // Table Ref
    tableContainer,
    tableResponsiveRef,
    tableRef,
  }
}
