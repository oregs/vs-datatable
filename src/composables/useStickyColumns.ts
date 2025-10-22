import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import type { Ref } from 'vue'
import type { Column } from '@/types'

export function useStickyColumns(
  tableRef: Ref<HTMLElement | null>,
  columns: Ref<Column[]>,
  hasGroups: Ref<boolean> = ref<boolean>(false)
) {
  const hasLeftShadow = ref<boolean>(false)
  const hasRightShadow = ref<boolean>(false)

  let resizeObserver: ResizeObserver | null = null
  let resizeTimeout: number | null = null // 🔵 Debounce control

  const updateShadows = () => {
    const scrollEl = tableRef.value?.parentElement
    if (!scrollEl) return
    hasLeftShadow.value = scrollEl.scrollLeft > 0
    hasRightShadow.value =
      scrollEl.scrollWidth - scrollEl.clientWidth - scrollEl.scrollLeft > 1
  }

  const setupSticky = async () => {
    const table = tableRef.value
    if (!table) return

    await nextTick()

    const rows = Array.from(table.querySelectorAll('tr')) as HTMLElement[]
    if (!rows?.length) return

    console.log('[useStickyColumns] Setting up sticky columns')

    // Get the body rows to determine actual column structure
    const bodyRows = rows.filter(row => row.closest('tbody'))
    if (!bodyRows.length) return

    const firstBodyRow = bodyRows[0]
    if (!firstBodyRow) return
    const bodyCells = Array.from(firstBodyRow.children) as HTMLElement[]

    // Build field-to-index map based on body structure
    const fieldToIndex = new Map<string, number>()
    bodyCells.forEach((cell, index) => {
      const field = cell.getAttribute('data-field')
      if (field) {
        fieldToIndex.set(field, index)
      }
    })

    // 🟢 Enhanced flattening: track group-level stickiness
    const flatColumns: Column[] = []
    const groupStickyMap = new Map<string, 'left' | 'right'>()

    columns.value.forEach(col => {
      if (col.children && col.children.length) {
        if (col.sticky) {
          // Record this group’s sticky direction for its children
          col.children.forEach(child => {
            groupStickyMap.set(child.field!, col.sticky!)
          })
        }
        flatColumns.push(...col.children)
      } else {
        flatColumns.push(col)
      }
    })

    // Collect all sticky indexes
    const leftIndexes: number[] = []
    const rightIndexes: number[] = []

    // Always include expandable and checkbox columns as left sticky
    bodyCells.forEach((cell, index) => {
      if (cell.classList.contains('vs-expand-column') || 
          cell.classList.contains('vs-checkbox-column')) {
        leftIndexes.push(index)
      }
    })

    // Add manual sticky columns based on actual DOM field order
    columns.value.forEach(col => {
      if (col.children?.length) {
        // Grouped column: inherit its sticky for all children
        col.children.forEach(child => {
          const index = fieldToIndex.get(child.field!)
          if (index === undefined) return

          const stickySide = col.sticky || child.sticky
          if (stickySide === 'left') leftIndexes.push(index)
          if (stickySide === 'right') rightIndexes.push(index)
        })
      } else {
        const index = fieldToIndex.get(col.field!)
        if (index === undefined) return

        const stickySide = col.sticky
        if (stickySide === 'left') leftIndexes.push(index)
        if (stickySide === 'right') rightIndexes.push(index)
      }
    })


    // Sort indexes
    const uniqueLeftIndexes = [...new Set(leftIndexes)].sort((a, b) => a - b)
    const uniqueRightIndexes = [...new Set(rightIndexes)].sort((a, b) => b - a)

    console.log('[useStickyColumns] Sticky columns:', {
      left: uniqueLeftIndexes.map(idx => ({ index: idx, field: flatColumns[idx]?.field })),
      right: uniqueRightIndexes.map(idx => ({ index: idx, field: flatColumns[idx]?.field }))
    })

    // Clear previous styles from ALL rows
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

    // Calculate offsets based on body row
    let leftOffset = 0
    const leftOffsets = new Map<number, number>()
    
    uniqueLeftIndexes.forEach(index => {
      leftOffsets.set(index, leftOffset)
      const cell = bodyCells[index]
      if (cell) {
        leftOffset += cell.offsetWidth
      }
    })

    let rightOffset = 0
    const rightOffsets = new Map<number, number>()
    
    uniqueRightIndexes.forEach(index => {
      rightOffsets.set(index, rightOffset)
      const cell = bodyCells[index]
      if (cell) {
        rightOffset += cell.offsetWidth
      }
    })

    // Prepare set of group->first-child mapping for quick lookup
    const groupFirstChildField = new Map<string, string | undefined>()
    columns.value.forEach(col => {
      if (col.children?.length) {
        groupFirstChildField.set(col.label, col.children[0]?.field)
      }
    })

    // Helper: resolve a header cell's data-field to the body cell index
    const resolveHeaderFieldIndex = (field: string | null): number | undefined => {
      if (!field) return undefined

      // Group header field pattern: 'group-<label>'
      if (field.startsWith('group-')) {
        const groupLabel = field.replace(/^group-/, '')
        const firstChildField = groupFirstChildField.get(groupLabel)
        if (!firstChildField) return undefined
        return fieldToIndex.get(firstChildField)
      }

      // Normal header or child header -> map directly to body index
      return fieldToIndex.get(field)
    }

    rows.forEach((row) => {
      // Apply left sticky
      rows.forEach((row) => {
        const cells = Array.from(row.children) as HTMLElement[]
        const isHeaderRow = row.closest('thead') !== null
      
        cells.forEach(cell => {
          const field = cell.getAttribute('data-field')
          if (!field) return
      
          // Resolve header/child/group field → body cell index
          const resolvedIndex = resolveHeaderFieldIndex(field)
          if (resolvedIndex === undefined) return
      
          // Check if this field should be sticky-left
          if (!uniqueLeftIndexes.includes(resolvedIndex)) return
      
          // Get its offset based on body cell
          const offset = leftOffsets.get(resolvedIndex) || 0
      
          cell.style.position = 'sticky'
          cell.style.left = `${offset}px`
          cell.style.zIndex = isHeaderRow ? '4' : '3'
          cell.classList.add('vs-sticky-left')
          cell.style.background = 'var(--vs-table-bg, #fff)'
        })
      })

      // Apply right sticky
      rows.forEach((row) => {
        const cells = Array.from(row.children) as HTMLElement[]
        const isHeaderRow = row.closest('thead') !== null

        cells.forEach(cell => {
          const field = cell.getAttribute('data-field')
          if (!field) return

          // Resolve header or body field to its body index
          const resolvedIndex = resolveHeaderFieldIndex(field)
          if (resolvedIndex === undefined) return

          // Check if this field's column is marked as right-sticky
          if (!uniqueRightIndexes.includes(resolvedIndex)) return

          // Use the correct offset based on the body cell
          const offset = rightOffsets.get(resolvedIndex) || 0

          cell.style.position = 'sticky'
          cell.style.right = `${offset}px`
          cell.style.zIndex = isHeaderRow ? '4' : '3'
          cell.classList.add('vs-sticky-right')
          cell.style.background = 'var(--vs-table-bg, #fff)'
        })
      })
      
    })

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
    }, 150)
  }

  onMounted(async () => {
    await nextTick()
    setTimeout(() => {
      refreshSticky()
    }, 300)
    
    const scrollEl = tableRef.value?.parentElement
    scrollEl?.addEventListener('scroll', updateShadows)
    updateShadows()
  })

  onBeforeUnmount(() => {
    const scrollEl = tableRef.value?.parentElement
    scrollEl?.removeEventListener('scroll', updateShadows)
  })

  watch([columns, hasGroups], refreshSticky, { deep: true })

  return { hasLeftShadow, hasRightShadow, refreshSticky }
}