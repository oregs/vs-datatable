/**
 * DataTable Selection Composable
 */

import { ref, computed, watch } from 'vue'
import type { SelectionHelpers } from '@/types/datatable'
import { getRowKey, isRowSelected } from '@/utils/datatable'

export function useDataTableSelection<
  T extends (event: any, ...args: any[]) => void
>(
  props: { 
    itemSelected?: any[] | null; 
    rows: any[];
    rowKey?: string | ((item: any, index: number) => string | number);
  },
  emit: T
) {
  // Local selection state
  const localSelected = ref<any[]>(props.itemSelected || [])

  // Watch for external selection changes
  watch(
    () => props.itemSelected,
    (newVal) => {
      if (newVal) localSelected.value = [...newVal]
      else localSelected.value = []
    },
    { immediate: true, deep: true }
  )

  // Computed properties
  const selectedItems = computed<any[]>({
    get: () => localSelected.value,
    set: (newValue) => {
      localSelected.value = newValue
      emit('update:itemSelected', newValue)
    },
  })

  const isItemSelectedControlled = computed(() => props.itemSelected !== null)

  const isAllChecked = computed(() => 
    props.rows.length > 0 && selectedItems.value.length === props.rows.length
  )

  const isSomeChecked = computed(() => {
    if (!props.rows.length) return false
    if (!selectedItems.value.length) return false

    return (
      !isAllChecked.value &&
      props.rows.some((row, index) =>
        selectedItems.value.some((r, i) => 
          getRowKey(r, i, props.rowKey) === getRowKey(row, index, props.rowKey)
        )
      )
    )
  })

  // Selection methods
  const toggleRow = (row: any, index: number) => {
    const rowKey = getRowKey(row, index, props.rowKey)
    const exists = selectedItems.value.some((r, i) => 
      getRowKey(r, i, props.rowKey) === rowKey
    )

    if (exists) {
      selectedItems.value = selectedItems.value.filter((r, i) => 
        getRowKey(r, i, props.rowKey) !== rowKey
      )
      emit('rowDeselected', row, index)
    } else {
      selectedItems.value = [...selectedItems.value, row]
      emit('rowSelected', row, index)
    }
  }

  const toggleAll = (event: Event) => {
    const target = event.target as HTMLInputElement
    selectedItems.value = target.checked ? [...props.rows] : []
    emit('allRowsSelected', selectedItems.value)
  }

  const selectRow = (row: any, index: number) => {
    if (!isRowSelected(row, selectedItems.value, props.rowKey)) {
      selectedItems.value = [...selectedItems.value, row]
      emit('rowSelected', row, index)
    }
  }

  const deselectRow = (row: any, index: number) => {
    const rowKey = getRowKey(row, index, props.rowKey)
    selectedItems.value = selectedItems.value.filter((r, i) => 
      getRowKey(r, i, props.rowKey) !== rowKey
    )
    emit('rowDeselected', row, index)
  }

  const selectAll = () => {
    selectedItems.value = [...props.rows]
    emit('allRowsSelected', selectedItems.value)
  }

  const deselectAll = () => {
    selectedItems.value = []
    emit('allRowsSelected', [])
  }

  const clearSelection = () => {
    selectedItems.value = []
  }

  const selectionHelpers: SelectionHelpers = {
    selectedItems,
    isItemSelectedControlled,
    isAllChecked,
    isSomeChecked,
    toggleRow,
    toggleAll
  }

  return {
    selectedItems,
    isItemSelectedControlled,
    isAllChecked,
    isSomeChecked,
    toggleRow,
    toggleAll,
    selectRow,
    deselectRow,
    selectAll,
    deselectAll,
    clearSelection,
    selectionHelpers
  }
}
