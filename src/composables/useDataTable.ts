import { type Ref, computed, ref, watch } from 'vue'
import { useDataTableSort } from '@/composables/useDataTableSort'
import { useDataTablePagination } from '@/composables/useDataTablePagination'
import { useDataTableRowsPerPage } from '@/composables/useDataTableRowsPerPage'
import { useDataTableSearch } from '@/composables/useDataTableSearch'
import { paginateRows } from '@/utils/datatable'

export function useDataTable<
    T extends (event: any, ...args: any[]) => void
>(props: any, emit: T) {
    const page = ref<number>(1)
    const rowsPerPage = ref(props.serverOptions?.rowsPerPage ?? props.rowsPerPage)
    const searchQuery = ref<string>('')
  
    const { processedRows, sortHelpers } = useDataTableSort(props, emit, page, rowsPerPage, searchQuery)
    const { totalRecords, recordRange, handlePageChange } = useDataTablePagination(props, emit, page, rowsPerPage, processedRows)
    const { handleRowsPerPage } = useDataTableRowsPerPage(props, emit, page, rowsPerPage)
    const { onInputTyped } = useDataTableSearch(emit, searchQuery)

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
    }
  }