import type { CollapseEventPayload, ExpandEventPayload } from '@/types';
import { ref, computed, type SetupContext } from 'vue'

export function useExpandable(
  props: { expanded?: (string | number)[]; accordion?: boolean; rowKey?: string | ((row: any, index: number) => string | number) },
  emit: SetupContext['emit']
) {
  const internalExpanded = ref<(string | number)[]>([])
  const loadingMap = ref<Map<string | number, boolean>>(new Map())

  const expandedRows = computed<(string | number)[]>({
    get: () => props.expanded ?? internalExpanded.value,
    set: (val) => {
      if (props.expanded !== undefined) {
        emit('update:expanded', val)
      } else {
        internalExpanded.value = val
      }
    },
  })

  function getRowId(row: any, index: number): string | number {
    if (typeof props.rowKey === 'function') return props.rowKey(row, index)
    if (typeof props.rowKey === 'string' && row[props.rowKey] !== undefined) return row[props.rowKey]
    return index
  }

  function isRowExpanded(row: any, index: number): boolean {
    const rowId = getRowId(row, index)
    return expandedRows.value.includes(rowId)
  }

  function toggleRowExpansion(row: any, index: number) {
    const rowId = getRowId(row, index)
    const isExpanded = expandedRows.value.includes(rowId)

    let newExpanded: (string | number)[]

    if (isExpanded) {
      newExpanded = expandedRows.value.filter((id) => id !== rowId)
      emit('collapseRow', { row, index, rowId } as CollapseEventPayload)
    } else {
      newExpanded = props.accordion ? [rowId] : [...expandedRows.value, rowId]
      emit('expandRow', { row, index, rowId } as ExpandEventPayload)
    }

    expandedRows.value = newExpanded
  }

  function isRowLoading(row: any, index: number): boolean {
    const rowId = getRowId(row, index)
    return loadingMap.value.get(rowId) === true
  }

  function setRowLoading(rowId: string | number, loading: boolean) {
    loadingMap.value.set(rowId, loading)
  }

  return {
    expandedRows,
    isRowExpanded,
    toggleRowExpansion,
    getRowId,
    setRowLoading,
    isRowLoading
  }
}