/**
 * DataTable Pagination Composable
 */

import { type Ref, ref, computed } from 'vue'
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
  emit: T,
  page: Ref<number>,
  rowsPerPage: Ref<number>
) {
  // Client-side pagination state
  // const csPage = ref<number>(1)

  const totalRecords = computed<number>({
    get: () => (props.serverItemsLength !== undefined ? props.serverItemsLength : props.rows.length),
    set: (newValue: number) => {
      if (props.serverItemsLength !== undefined) {
        emit('update:serverItemsLength', newValue)
      }
    },
  })

  const currentPage = computed<number>({
    get: () => props.serverOptions?.page ?? page.value,
    set: (newValue: number) => {
      if (props.serverOptions) {
        emit('update:serverOptions', { ...props.serverOptions, page: newValue })
      } else {
        page.value = newValue
      }
    },
  })

  const recordRange = computed<RecordRange>(() => {
    const rowsPerPageValue = rowsPerPage.value
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
    totalRecords,
    recordRange,
    handlePageChange
  }

  return {
    currentPage,
    totalRecords,
    recordRange,
    handlePageChange,
    paginationHelpers
  }
}
