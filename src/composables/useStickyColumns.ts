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
  
  // prevent recursive updates
  let isApplyingStyles = false

  const updateShadows = () => {
    if (isApplyingStyles) return
    
    const scrollEl = tableRef.value?.parentElement
    const table = tableRef.value
    if (!scrollEl || !table) return
  
    const scrollLeft = scrollEl.scrollLeft
    const maxScrollLeft = scrollEl.scrollWidth - scrollEl.clientWidth
  
    // console.log('ScrollLeft: ', scrollLeft, 'MaxScrollLeft: ', maxScrollLeft);
  
    // Shadows
    hasLeftShadow.value = scrollLeft > 0
    hasRightShadow.value = scrollLeft < maxScrollLeft - 1
  
    const leftStickyCells = Array.from(
      table.querySelectorAll('.vs-sticky-left')
    ) as HTMLElement[]
    const rightStickyCells = Array.from(
      table.querySelectorAll('.vs-sticky-right')
    ) as HTMLElement[]
  
    // Don't reset z-index for all cells - only update based on scroll position
    // The proper z-index layering is already set in applyStickyStyles
    
    // ---------------- LEFT STICKY ----------------
    if (scrollLeft > 0) {
      // Only update left sticky cells when scrolled
      leftStickyCells.forEach(cell => {
        // Preserve header z-index (4) vs body z-index (3)
        const isHeader = cell.closest('thead') !== null
        cell.style.zIndex = isHeader ? '5' : '4' // Higher when active
      })
    } else {
      // Reset to base z-index when not scrolled
      leftStickyCells.forEach(cell => {
        const isHeader = cell.closest('thead') !== null
        cell.style.zIndex = isHeader ? '4' : '3' // Base z-index
      })
    }
  
    // ---------------- RIGHT STICKY ----------------
    if (rightStickyCells.length) {
      const firstRight = rightStickyCells[0]
      const rightBoundary = table.offsetWidth - firstRight.offsetLeft
      const scrollRight = scrollEl.scrollWidth - (scrollLeft + scrollEl.clientWidth)
  
      // When we're close enough to the right end
      if (scrollRight <= rightBoundary + 5) {
        rightStickyCells.forEach(cell => {
          const isHeader = cell.closest('thead') !== null
          cell.style.zIndex = isHeader ? '5' : '4' // Higher when active
        })
      } else {
        // Reset to base z-index when not at right edge
        rightStickyCells.forEach(cell => {
          const isHeader = cell.closest('thead') !== null
          cell.style.zIndex = isHeader ? '4' : '3' // Base z-index
        })
      }
    }
  }

  const getTableRows = (): HTMLElement[] => {
    const table = tableRef.value
    return table ? Array.from(table.querySelectorAll('tr')) : []
  }

  const getBodyRows = (rows: HTMLElement[]): HTMLElement[] => {
    return rows.filter(row => row.closest('tbody'))
  }

  const getBodyCells = (bodyRows: HTMLElement[]): HTMLElement[] => {
    const firstBodyRow = bodyRows[0]
    return firstBodyRow ? Array.from(firstBodyRow.children) : []
  }

  const createFieldToIndexMap = (bodyCells: HTMLElement[]): Map<string, number> => {
    const fieldToIndex = new Map<string, number>()
    bodyCells.forEach((cell, index) => {
      const field = cell.getAttribute('data-field')
      if (field) fieldToIndex.set(field, index)
    })
    return fieldToIndex
  }

  // Check if any column has sticky set
  const hasStickyColumns = (columns: Column[]): boolean => {
    for (const col of columns) {
      if (col.children?.length) {
        // Check child columns
        if (col.children.some(child => child.sticky === 'left' || child.sticky === 'right')) {
          return true
        }
      } else {
        // Check main column
        if (col.sticky === 'left' || col.sticky === 'right') {
          return true
        }
      }
    }
    return false
  }

  const getStickyIndexes = (
    bodyCells: HTMLElement[], 
    fieldToIndex: Map<string, number>, 
    columns: Column[]
  ): { left: number[], right: number[] } => {
    const leftIndexes: number[] = []
    const rightIndexes: number[] = []

    // Check if any columns have sticky set
    const hasManualStickyColumns = hasStickyColumns(columns)

    // Only include expandable and checkbox columns as left sticky if there are other sticky columns
    if (hasManualStickyColumns) {
      bodyCells.forEach((cell, index) => {
        if (cell.classList.contains('vs-expand-column') || 
            cell.classList.contains('vs-checkbox-column')) {
          leftIndexes.push(index)
        }
      })
    }

    // Add manual sticky columns based on actual DOM field order
    columns.forEach(col => {
      if (col.children?.length) {
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

    return {
      left: [...new Set(leftIndexes)].sort((a, b) => a - b),
      right: [...new Set(rightIndexes)].sort((a, b) => b - a)
    }
  }

  const calculateOffsets = (
    bodyCells: HTMLElement[], 
    indexes: number[], 
    direction: 'left' | 'right'
  ): Map<number, number> => {
    const offsets = new Map<number, number>()
    let offset = 0

    indexes.forEach(index => {
      offsets.set(index, offset)
      const cell = bodyCells[index]
      if (cell) offset += cell.offsetWidth
    })

    return offsets
  }

  // Create map for both first child (for left sticky) and last child (for right sticky)
  const createGroupChildFieldMap = (columns: Column[]): { 
    firstChild: Map<string, string | undefined>; 
    lastChild: Map<string, string | undefined> 
  } => {
    const firstChildMap = new Map<string, string | undefined>()
    const lastChildMap = new Map<string, string | undefined>()
    
    columns.forEach(col => {
      if (col.children?.length) {
        firstChildMap.set(col.label, col.children[0]?.field)
        lastChildMap.set(col.label, col.children[col.children.length - 1]?.field)
      }
    })
    
    return { firstChild: firstChildMap, lastChild: lastChildMap }
  }

  // Updated to handle both left and right sticky for group headers
  const resolveHeaderFieldIndex = (
    field: string | null, 
    fieldToIndex: Map<string, number>, 
    groupChildField: { firstChild: Map<string, string | undefined>; lastChild: Map<string, string | undefined> },
    direction: 'left' | 'right'
  ): number | undefined => {
    if (!field) return undefined

    // Group header field pattern: 'group-<label>'
    if (field.startsWith('group-')) {
      const groupLabel = field.replace(/^group-/, '')
      
      // Use first child for left sticky, last child for right sticky
      if (direction === 'left') {
        const firstChildField = groupChildField.firstChild.get(groupLabel)
        return firstChildField ? fieldToIndex.get(firstChildField) : undefined
      } else {
        const lastChildField = groupChildField.lastChild.get(groupLabel)
        return lastChildField ? fieldToIndex.get(lastChildField) : undefined
      }
    }

    // Normal header or child header
    return fieldToIndex.get(field)
  }

  const clearStickyStyles = (rows: HTMLElement[]) => {
    rows.forEach(row => {
      const cells = Array.from(row.children) as HTMLElement[]
      cells.forEach(cell => {
        cell.style.position = ''
        cell.style.left = ''
        cell.style.right = ''
        cell.style.zIndex = ''
        cell.style.background = ''
        cell.style.minWidth = ''
        cell.style.width = ''
        cell.classList.remove('vs-sticky-left', 'vs-sticky-right')
      })
    })
  }

  const applyStickyStyles = (
    rows: HTMLElement[],
    stickyIndexes: number[],
    offsets: Map<number, number>,
    direction: 'left' | 'right',
    fieldToIndex: Map<string, number>,
    groupChildField: { firstChild: Map<string, string | undefined>; lastChild: Map<string, string | undefined> }
  ) => {
    if (isApplyingStyles) return
    isApplyingStyles = true

    try {
      rows.forEach(row => {
        const cells = Array.from(row.children) as HTMLElement[]
        const isHeaderRow = row.closest('thead') !== null

        cells.forEach(cell => {
          const field = cell.getAttribute('data-field')
          if (!field) return

          // Pass direction parameter
          const resolvedIndex = resolveHeaderFieldIndex(field, fieldToIndex, groupChildField, direction)
          if (resolvedIndex === undefined || !stickyIndexes.includes(resolvedIndex)) return

          const offset = offsets.get(resolvedIndex) || 0
          const zIndex = isHeaderRow ? '4' : '3'

          cell.style.position = 'sticky'
          cell.style[direction] = `${offset}px`
          cell.style.zIndex = zIndex
          cell.classList.add(`vs-sticky-${direction}`)
          cell.style.background = 'var(--vs-table-bg, #fff)'
        })
      })
    } finally {
      isApplyingStyles = false
    }
  }

  const setupSticky = async () => {
    if (isApplyingStyles) return
    
    const rows = getTableRows()
    if (!rows.length) return

    const bodyRows = getBodyRows(rows)
    if (!bodyRows.length) return

    const bodyCells = getBodyCells(bodyRows)
    const fieldToIndex = createFieldToIndexMap(bodyCells)
    const stickyIndexes = getStickyIndexes(bodyCells, fieldToIndex, columns.value)

    clearStickyStyles(rows)

    // Only apply sticky styles if there are sticky columns
    if (stickyIndexes.left.length > 0 || stickyIndexes.right.length > 0) {
      const leftOffsets = calculateOffsets(bodyCells, stickyIndexes.left, 'left')
      const rightOffsets = calculateOffsets(bodyCells, stickyIndexes.right, 'right')
      
      // Use the new group child field map
      const groupChildField = createGroupChildFieldMap(columns.value)

      // Pass direction to applyStickyStyles calls
      applyStickyStyles(rows, stickyIndexes.left, leftOffsets, 'left', fieldToIndex, groupChildField)
      applyStickyStyles(rows, stickyIndexes.right, rightOffsets, 'right', fieldToIndex, groupChildField)
    }

    updateShadows()
  }

  const refreshSticky = async () => {
    if (isApplyingStyles) return
    
    await nextTick()
    setTimeout(() => {
      try {
        setupSticky()
      } catch (err) {
        console.warn('[useStickyColumns] refreshSticky failed:', err)
      }
    }, 150)
  }

  const setupEventListeners = () => {
    const scrollEl = tableRef.value?.parentElement
    scrollEl?.addEventListener('scroll', updateShadows)
    updateShadows()
  }

  const cleanupEventListeners = () => {
    const scrollEl = tableRef.value?.parentElement
    scrollEl?.removeEventListener('scroll', updateShadows)
  }

  onMounted(async () => {
    await nextTick()
    setTimeout(() => {
      refreshSticky()
    }, 300)
    setupEventListeners()
  })

  onBeforeUnmount(cleanupEventListeners)

  // Throttle the watch to prevent excessive updates
  let refreshTimeout: NodeJS.Timeout | null = null
  watch([columns, hasGroups], () => {
    if (refreshTimeout) clearTimeout(refreshTimeout)
    refreshTimeout = setTimeout(() => {
      refreshSticky()
    }, 100)
  }, { deep: true })

  return { hasLeftShadow, hasRightShadow, refreshSticky }
}