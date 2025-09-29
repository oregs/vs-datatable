import { type Ref, computed, ref, watch } from 'vue'
import { useDataTableSort } from '@/composables/useDataTableSort'
import { useDataTablePagination } from '@/composables/useDataTablePagination'
import { useDataTableRowsPerPage } from '@/composables/useDataTableRowsPerPage'
import { useDataTableSearch } from '@/composables/useDataTableSearch'

export function useDataTable<
    T extends (event: any, ...args: any[]) => void
>(props: any, emit: T) {
    const page = ref<number>(1)
    const rowsPerPage = ref(props.serverOptions?.rowsPerPage ?? props.rowsPerPage)
    const searchQuery = ref<string>('')
  
    const { sortedRows, sortHelpers } = useDataTableSort(props, emit, page, rowsPerPage, searchQuery)
    const { totalRecords, recordRange, handlePageChange } = useDataTablePagination(props, emit, page, rowsPerPage, sortedRows)
    const { handleRowsPerPage } = useDataTableRowsPerPage(props, emit, page, rowsPerPage)
    const { onInputTyped } = useDataTableSearch(emit, searchQuery)
  
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
      sortedRows,
      sortHelpers,

      //Search
      searchQuery,
      onInputTyped,
    }
  }