import { type Ref, computed, ref, watch } from 'vue'
import { useDataTableSort } from '@/composables/useDataTableSort'
import { useDataTablePagination } from '@/composables/useDataTablePagination'
import { useDataTableRowsPerPage } from '@/composables/useDataTableRowsPerPage'
import { useDataTableSearch } from '@/composables/useDataTableSearch'
import { paginateRows } from '@/utils/datatable'
import { useExpandable } from '@/composables/useExpandable'
import { useColumnFilter } from "@/composables/useColumnFilter";

export function useDataTable<
    T extends (event: any, ...args: any[]) => void
>(props: any, emit: T) {
    const page = ref<number>(1)
    const rowsPerPage = ref(props.serverOptions?.rowsPerPage ?? props.rowsPerPage)
    const searchQuery = ref<string>('')

    const { isRowExpanded, toggleRowExpansion, getRowId, setRowLoading, isRowLoading } = useExpandable(props, emit)
    const { processedRows, sortHelpers } = useDataTableSort(props, emit, page, rowsPerPage, searchQuery, {isRowExpanded})
    const { totalRecords, recordRange, handlePageChange } = useDataTablePagination(props, emit, page, rowsPerPage, processedRows)
    const { handleRowsPerPage } = useDataTableRowsPerPage(props, emit, page, rowsPerPage)
    const { onInputTyped } = useDataTableSearch(emit, searchQuery)
    const { filters, filteredData, setFilter, clearFilter } = useColumnFilter(ref(props.rows), props.columns);

    // Apply pagination
    const paginatedRows = computed(() => paginateRows(processedRows.value, page.value, rowsPerPage.value))
  
    return {
      //Pagination
      page,
      totalRecords,
      recordRange,
      handlePageChange,
      
      //Row Per Page
      rowsPerPage,
      handleRowsPerPage,

      //Sort
      processedRows,
      paginatedRows,
      sortHelpers,

      //Search
      searchQuery,
      onInputTyped,

      //Expanded
      isRowExpanded,
      toggleRowExpansion, 
      getRowId,
      setRowLoading,
      isRowLoading,

      //Column Filter
      filters,
      filteredData,
      setFilter,
      clearFilter
    }
  }