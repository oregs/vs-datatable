/**
 * DataTable Pagination Composable
 */

import { ref, computed } from 'vue'
import type { PaginationHelpers, RecordRange } from '@/types/datatable'
import { calculateRecordRange } from '@/utils/datatable'

export function useDataTablePagination<
  T extends (event: any, ...args: any[]) => void
>(
  props: { 
    serverOptions?: any; 
    serverItemsLength?: number; 
    rows: any[] 
  },
  emit: T
) {
  // Client-side pagination state
  const csRowPerPage = ref<number>(10)
  const csPage = ref<number>(1)

  // Computed properties
  const rowsPerPage = computed<number>({
    get: () => props.serverOptions?.rowsPerPage ?? csRowPerPage.value,
    set: (newValue: number) => {
      if (props.serverOptions) {
        emit('update:serverOptions', { ...props.serverOptions, rowsPerPage: newValue })
      } else {
        csRowPerPage.value = newValue
      }
    },
  })

  const totalRecords = computed<number>({
    get: () => (props.serverItemsLength !== undefined ? props.serverItemsLength : props.rows.length),
    set: (newValue: number) => {
      if (props.serverItemsLength !== undefined) {
        emit('update:serverItemsLength', newValue)
      }
    },
  })

  const page = computed<number>({
    get: () => props.serverOptions?.page ?? csPage.value,
    set: (newValue: number) => {
      if (props.serverOptions) {
        emit('update:serverOptions', { ...props.serverOptions, page: newValue })
      } else {
        csPage.value = newValue
      }
    },
  })

  const recordRange = computed<RecordRange>(() => {
    const rowsPerPageValue = props.serverOptions?.rowsPerPage ?? 10
    return calculateRecordRange(page.value, rowsPerPageValue, totalRecords.value)
  })

  const handlePageChange = (newPage: number) => {
    if (props.serverOptions) {
      emit('update:serverOptions', { ...props.serverOptions, page: newPage })
    }
    emit('page-updated', newPage)
  }

  const paginationHelpers: PaginationHelpers = {
    page,
    rowsPerPage,
    totalRecords,
    recordRange,
    handlePageChange
  }

  return {
    page,
    rowsPerPage,
    totalRecords,
    recordRange,
    handlePageChange,
    paginationHelpers
  }
}
