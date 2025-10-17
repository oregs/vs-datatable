import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import type { Ref } from 'vue'
import type { Column } from '@/types'

export function useStickyColumns(
  tableRef: Ref<HTMLElement | null>,
  columns: Ref<Column[]>
) {
  const hasLeftShadow = ref(false)
  const hasRightShadow = ref(false)

  const updateShadows = () => {
    const scrollEl = tableRef.value?.parentElement
    if (!scrollEl) return
    hasLeftShadow.value = scrollEl.scrollLeft > 0
    hasRightShadow.value =
      scrollEl.scrollWidth - scrollEl.clientWidth - scrollEl.scrollLeft > 1
  }

  const setupSticky = () => {
    const table = tableRef.value
    if (!table) return

    const rows = Array.from(table.querySelectorAll('tr')) as HTMLElement[]
    if (!rows?.length) return

    const firstRow = rows[0]
    const allCells = Array.from(firstRow.children) as HTMLElement[]

    // 1. Detect if we have any manual sticky columns
    const hasLeftSticky = columns.value?.some(col => col.sticky === 'left') || false
    const hasRightSticky = columns.value?.some(col => col.sticky === 'right') || false

    // console.log('[useStickyColumns] Sticky detection:', {
    //   hasLeftSticky,
    //   hasRightSticky,
    //   totalColumns: columns.value?.length
    // })

    // 2. Build field-to-index map
    const fieldToIndex = new Map<string, number>()
    allCells.forEach((cell, index) => {
      const field = cell.getAttribute('data-field')
      if (field) fieldToIndex.set(field, index)
    })

    // 3. Collect all sticky indexes
    const leftIndexes: number[] = []
    const rightIndexes: number[] = []

    // Auto-sticky: only if manual sticky exists on that side
    if (hasLeftSticky) {
      allCells.forEach((cell, index) => {
        if (cell.classList.contains('vs-expand-column') || 
            cell.classList.contains('vs-checkbox-column')) {
          leftIndexes.push(index)
        }
      })
    }

    // Manual sticky columns
    columns.value?.forEach(col => {
      if (!col.field) return
      const index = fieldToIndex.get(col.field)
      if (index === undefined) return

      if (col.sticky === 'left') {
        leftIndexes.push(index)
      } else if (col.sticky === 'right') {
        rightIndexes.push(index)
      }
    })

    // Remove duplicates and sort
    const uniqueLeftIndexes = [...new Set(leftIndexes)].sort((a, b) => a - b)
    const uniqueRightIndexes = [...new Set(rightIndexes)].sort((a, b) => b - a) // Descending for right

    // console.log('[useStickyColumns] Final indexes:', {
    //   uniqueLeftIndexes,
    //   uniqueRightIndexes
    // })

    // 4. Clear previous styles
    rows.forEach(row => {
      const cells = Array.from(row.children) as HTMLElement[]
      cells.forEach(cell => {
        cell.style.position = ''
        cell.style.left = ''
        cell.style.right = ''
        cell.style.zIndex = ''
        cell.style.background = ''
        cell.classList.remove('vs-sticky-left', 'vs-sticky-right')
      })
    })

    // 5. Apply left sticky
    if (uniqueLeftIndexes.length > 0) {
      rows.forEach(row => {
        const cells = Array.from(row.children) as HTMLElement[]
        let leftOffset = 0

        uniqueLeftIndexes.forEach(index => {
          const cell = cells[index]
          if (!cell) return

          cell.style.position = 'sticky'
          cell.style.left = `${leftOffset}px`
          cell.style.zIndex = '3'
          cell.classList.add('vs-sticky-left')
          
          leftOffset += cell.offsetWidth
        })
      })
    }

    // 6. Apply right sticky
    if (uniqueRightIndexes.length > 0) {
      rows.forEach(row => {
        const cells = Array.from(row.children) as HTMLElement[]
        let rightOffset = 0

        uniqueRightIndexes.forEach(index => {
          const cell = cells[index]
          if (!cell) return

          cell.style.position = 'sticky'
          cell.style.right = `${rightOffset}px`
          cell.style.zIndex = '3'
          cell.style.background = 'inherit'
          cell.classList.add('vs-sticky-right')
          
          rightOffset += cell.offsetWidth
        })
      })
    }

    updateShadows()
  }

  const refreshSticky = async () => {
    await nextTick()
    setTimeout(() => {
      try {
        setupSticky()
      } catch (err) {
        console.warn('[useStickyColumns] refreshSticky failed:', err)
      }
    }, 30)
  }

  onMounted(async () => {
    await nextTick()
    await refreshSticky()
    const scrollEl = tableRef.value?.parentElement
    scrollEl?.addEventListener('scroll', updateShadows)
    updateShadows()
  })

  onBeforeUnmount(() => {
    const scrollEl = tableRef.value?.parentElement
    scrollEl?.removeEventListener('scroll', updateShadows)
  })

  watch(columns, refreshSticky, { deep: true })

  return { hasLeftShadow, hasRightShadow, refreshSticky }
}