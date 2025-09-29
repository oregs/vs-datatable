import { type Ref, computed, ref, watch } from 'vue'
import { useDataTableSort } from '@/composables/useDataTableSort'
import { useDataTablePagination } from '@/composables/useDataTablePagination'
import { useDataTableRowsPerPage } from '@/composables/useDataTableRowsPerPage'

export function useDataTable<
    T extends (event: any, ...args: any[]) => void
>(props: any, emit: T) {
    const page = ref<number>(1)
    const rowsPerPage = ref(props.serverOptions?.rowsPerPage ?? props.rowsPerPage)
  
    const { totalRecords, recordRange, handlePageChange } = useDataTablePagination(props, emit, page, rowsPerPage)
    const { handleRowsPerPage } = useDataTableRowsPerPage(props, emit, page, rowsPerPage)
    const { sortedRows, sortHelpers } = useDataTableSort(props, emit, page, rowsPerPage)
  
    return {
      page,
      rowsPerPage,
      totalRecords,
      recordRange,
      handlePageChange,
      handleRowsPerPage,
      sortedRows,
      sortHelpers
    }
  }