/**
 * DataTable Sorting Composable
 */

import {type Ref, ref, computed, watch } from 'vue'
import type { Sort, SortHelpers } from '@/types/datatable'

export function useDataTableSort<
  T extends (event: any, ...args: any[]) => void
>(
  props: { sort?: Sort[]; serverOptions?: any; rows: any[], rowsPerPage: number },
  emit: T,
  page: Ref<number>,
) {
  const vsInitialPage = ref<number>(1)
  const localSort = ref<Sort[]>(props.sort ? [...props.sort] : [])

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

  // Sort helpers
  const isColumnSorted = (field: string): boolean => {
    return activeSort.value.some((s: Sort) => s.field === field)
  }

  const getSortPriority = (field: string): number | null => {
    const entry = activeSort.value.find((s: Sort) => s.field === field)
    return entry ? entry.priority ?? null : null
  }

  const getSortOrder = (field: string): string | null => {
    return activeSort.value.find((s: Sort) => s.field === field)?.order ?? null
  }

  const handleSort = (field: string, event: MouseEvent) => {
    let sort = [...localSort.value]

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

    localSort.value = [...sort]

    if (props.serverOptions) {
      emit('update:serverOptions', { ...props.serverOptions, sort })
    } else {
      emit('update:sort', sort)
    }

    page.value = vsInitialPage.value
    emit('sortChanged', { sort })
  }

  const sortHelpers: SortHelpers = {
    isColumnSorted,
    getSortPriority,
    getSortOrder,
    handleSort
  }

  return {
    activeSort,
    sortHelpers
  }
}
