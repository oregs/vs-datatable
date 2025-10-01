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
      emit('collapse-row', { row, index, rowId } as CollapseEventPayload)
    } else {
      newExpanded = props.accordion ? [rowId] : [...expandedRows.value, rowId]
      emit('expand-row', { row, index, rowId } as ExpandEventPayload)
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











// import { ref, watch } from "vue"

// export interface ExpandableRowState<T> {
//   isExpanded: boolean
//   expandedData?: T
// }

// interface UseExpandableOptions<RowId, ExpandedType> {
//   props: {
//     modelValue?: RowId[] // external control for expanded rows
//   }
//   emit: (event: "update:modelValue" | "expand" | "collapse", payload: any) => void
// }

// export function useExpandable<RowId extends string | number, ExpandedType = unknown>(
//   options: UseExpandableOptions<RowId, ExpandedType> & { accordion?: boolean }
// ) {
//   const { props, emit, accordion } = options
//   const expandedRows = ref(new Map<RowId, ExpandableRowState<ExpandedType>>())

//   function toggleRowExpansion(rowId: RowId, expandedData?: ExpandedType) {
//     const current = expandedRows.value.get(rowId)

//     if (current?.isExpanded) {
//       expandedRows.value.delete(rowId)
//       emit("collapse", rowId)
//     } else {
//       console.log('Accordion: ', accordion)
//       if (accordion) {
//         // collapse all before expanding
//         expandedRows.value.clear()
//       }
//       expandedRows.value.set(rowId, { isExpanded: true, expandedData })
//       emit("expand", { rowId, expandedData })
//     }

//     // emit("update:modelValue", Array.from(expandedRows.value.keys()))
//   }

//   function collapseRow(rowId: RowId) {
//     if (expandedRows.value.has(rowId)) {
//       expandedRows.value.delete(rowId)
//       emit("collapse", rowId)
//       emit("update:modelValue", Array.from(expandedRows.value.keys()))
//     }
//   }

//   function collapseAll() {
//     expandedRows.value.clear()
//     emit("update:modelValue", [])
//   }

//   function isRowExpanded(rowId: RowId): boolean {
//     return expandedRows.value.get(rowId)?.isExpanded ?? false
//   }

//   function getExpandedData(rowId: RowId): ExpandedType | undefined {
//     return expandedRows.value.get(rowId)?.expandedData
//   }

//   // Sync when parent controls v-model
//   watch(
//     () => props.modelValue,
//     (newVal) => {
//       if (newVal) {
//         expandedRows.value = new Map(newVal.map(id => [id, { isExpanded: true }]))
//       } else {
//         expandedRows.value.clear()
//       }
//     },
//     { immediate: true }
//   )

//   return {
//     expandedRows,
//     toggleRowExpansion,
//     collapseRow,
//     collapseAll,
//     isRowExpanded,
//     getExpandedData,
//   }
// }
