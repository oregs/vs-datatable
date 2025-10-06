/**
 * DataTable Rows Per Page Composable
 */
import { type Ref, computed, ref, watch } from 'vue'
import { calcTotalPages } from '@/utils/datatable'

export function useDataTableRowsPerPage<
  T extends (event: any, ...args: any[]) => void
>(
  props: {
    serverOptions?: any
    serverItemsLength?: number
    rows: any[]
    rowsPerPage: number
  },
  emit: T,
  page: Ref<number>,
  rowsPerPage: Ref<number>
) {
    // const vsRowsPerPage = ref<number>(props.serverOptions?.rowsPerPage ?? props.rowsPerPage)

  // Reactive rowsPerPage (supports server + client modes)
  const vsRowsPerPage = computed<number>({
    get: () => rowsPerPage.value,
    set: (newValue: number) => rowsPerPage.value = newValue
  })

  watch(rowsPerPage, (newVal: number) => {
    const totalRecords = props.serverItemsLength ?? props.rows.length
    const totalPages = calcTotalPages(totalRecords, newVal)

    if (page.value > totalPages) {
        page.value = totalPages || 1 // fallback to page 1 if no records
    } else if (page.value < 1) {
        page.value = 1
    }
  })

  // Explicit handler (same logic, plus fire extra event)
  const handleRowsPerPage = (newValue: number) => {
    rowsPerPage.value = newValue
    emit('rowsPerPageChanged', newValue)
  }

  return {
    vsRowsPerPage,
    handleRowsPerPage,
  }
}
