/**
 * DataTable Sorting Composable
 */

import {type Ref, ref, computed, watch } from 'vue'
import type { Sort, SortHelpers } from '@/types/datatable'
import { sortArray, paginateRows } from '@/utils/datatable'

export function useDataTableSort<
  T extends (event: any, ...args: any[]) => void
>(
  props: { sort?: Sort[]; serverOptions?: any; rows: any[], rowsPerPage: number },
  emit: T,
  page: Ref<number>
) {
  const localSort = ref<Sort[]>(props.sort ?? [])

  // Watch for external sort changes
  watch(
    () => props.sort,
    (newSort) => {
      if (newSort) localSort.value = [...newSort]
    },
    { deep: true }
  )

  // Active sort (server or client)
  const activeSort = computed(() => 
    props.serverOptions?.sort ?? localSort.value ?? []
  )

  // Sorted rows computed
  const sortedRows = computed(() => {
    if (!activeSort.value.length) return props.rows
    let sortedRowsData = sortArray(props.rows, activeSort.value)

    if (props.rowsPerPage) {
      sortedRowsData = paginateRows(sortedRowsData, page.value, props.rowsPerPage)
    }

    return sortedRowsData
  })

  // Sort helpers
  const isColumnSorted = (field: string): boolean => {
    return activeSort.value.some((s: any) => s.field === field)
  }

  const getSortPriority = (field: string): number | null => {
    const entry = activeSort.value.find((s: any) => s.field === field)
    return entry ? entry.priority ?? null : null
  }

  const getSortOrder = (field: string): string | null => {
    return activeSort.value.find((s: any) => s.field === field)?.order ?? null
  }

  const handleSort = (field: string, event: MouseEvent) => {
    let sort: Sort[] = []

    if (props.serverOptions) {
      sort = [...(props.serverOptions.sort ?? [])]
    } else if (props.sort) {
      sort = [...props.sort]
    }

    const index = sort.findIndex((s) => s.field === field)

    if (!event.shiftKey) {
      if (index === -1) {
        sort = [{ field, order: 'asc' }]
      } else if (sort[index]?.order === 'asc') {
        sort = [{ field, order: 'desc' }]
      } else {
        sort = []
      }
    } else {
      if (index === -1) {
        sort.push({ field, order: 'asc' })
      } else if (sort[index]?.order === 'asc') {
        sort[index]!.order = 'desc'
      } else {
        sort.splice(index, 1)
      }
    }

    sort = sort.map((s, i) => ({ ...s, priority: i + 1 }))

    if (props.serverOptions) {
      // Server mode
      emit('update:serverOptions', { ...props.serverOptions, sort })
    } else {
      // Client mode
      emit('update:sort', sort)
    }

    emit('sort-changed', { sort })
  }

  const sortHelpers: SortHelpers = {
    isColumnSorted,
    getSortPriority,
    getSortOrder,
    handleSort
  }

  return {
    sortedRows,
    activeSort,
    sortHelpers
  }
}
