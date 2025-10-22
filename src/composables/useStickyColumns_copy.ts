// import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
// import type { Ref } from 'vue'
// import type { Column } from '@/types'

// export function useStickyColumns(
//   tableRef: Ref<HTMLElement | null>,
//   columns: Ref<Column[]>,
//   hasGroups: Ref<boolean> = ref<boolean>(false)
// ) {
//   const hasLeftShadow = ref<boolean>(false)
//   const hasRightShadow = ref<boolean>(false)

//   const updateShadows = () => {
//     const scrollEl = tableRef.value?.parentElement
//     if (!scrollEl) return
//     hasLeftShadow.value = scrollEl.scrollLeft > 0
//     hasRightShadow.value =
//       scrollEl.scrollWidth - scrollEl.scrollLeft > scrollEl.clientWidth + 1
//   }

//   const getTableRows = (): HTMLElement[] => {
//     const table = tableRef.value
//     return table ? Array.from(table.querySelectorAll('tr')) : []
//   }

//   const getBodyRows = (rows: HTMLElement[]): HTMLElement[] => {
//     return rows.filter(row => row.closest('tbody'))
//   }

//   const getBodyCells = (bodyRows: HTMLElement[]): HTMLElement[] => {
//     const firstBodyRow = bodyRows[0]
//     return firstBodyRow ? Array.from(firstBodyRow.children) : []
//   }

//   const createFieldToIndexMap = (bodyCells: HTMLElement[]): Map<string, number> => {
//     const fieldToIndex = new Map<string, number>()
//     bodyCells.forEach((cell, index) => {
//       const field = cell.getAttribute('data-field')
//       if (field) fieldToIndex.set(field, index)
//     })
//     return fieldToIndex
//   }

//   const getStickyIndexes = (
//     bodyCells: HTMLElement[], 
//     fieldToIndex: Map<string, number>, 
//     columns: Column[]
//   ): { left: number[], right: number[] } => {
//     const leftIndexes: number[] = []
//     const rightIndexes: number[] = []

//     // Always include expandable and checkbox columns as left sticky
//     bodyCells.forEach((cell, index) => {
//       if (cell.classList.contains('vs-expand-column') || 
//           cell.classList.contains('vs-checkbox-column')) {
//         leftIndexes.push(index)
//       }
//     })

//     // Add manual sticky columns based on actual DOM field order
//     columns.forEach(col => {
//       if (col.children?.length) {
//         col.children.forEach(child => {
//           const index = fieldToIndex.get(child.field!)
//           if (index === undefined) return

//           const stickySide = col.sticky || child.sticky
//           if (stickySide === 'left') leftIndexes.push(index)
//           if (stickySide === 'right') rightIndexes.push(index)
//         })
//       } else {
//         const index = fieldToIndex.get(col.field!)
//         if (index === undefined) return

//         const stickySide = col.sticky
//         if (stickySide === 'left') leftIndexes.push(index)
//         if (stickySide === 'right') rightIndexes.push(index)
//       }
//     })

//     return {
//       left: [...new Set(leftIndexes)].sort((a, b) => a - b),
//       right: [...new Set(rightIndexes)].sort((a, b) => b - a)
//     }
//   }

//   const calculateOffsets = (
//     bodyCells: HTMLElement[], 
//     indexes: number[], 
//     direction: 'left' | 'right'
//   ): Map<number, number> => {
//     const offsets = new Map<number, number>()
//     let offset = 0

//     indexes.forEach(index => {
//       offsets.set(index, offset)
//       const cell = bodyCells[index]
//       if (cell) offset += cell.offsetWidth
//     })

//     return offsets
//   }

//   const createGroupFirstChildFieldMap = (columns: Column[]): Map<string, string | undefined> => {
//     const groupMap = new Map<string, string | undefined>()
//     columns.forEach(col => {
//       if (col.children?.length) {
//         groupMap.set(col.label, col.children[0]?.field)
//       }
//     })
//     return groupMap
//   }

//   const resolveHeaderFieldIndex = (
//     field: string | null, 
//     fieldToIndex: Map<string, number>, 
//     groupFirstChildField: Map<string, string | undefined>
//   ): number | undefined => {
//     if (!field) return undefined

//     // Group header field pattern: 'group-<label>'
//     if (field.startsWith('group-')) {
//       const groupLabel = field.replace(/^group-/, '')
//       const firstChildField = groupFirstChildField.get(groupLabel)
//       return firstChildField ? fieldToIndex.get(firstChildField) : undefined
//     }

//     // Normal header or child header
//     return fieldToIndex.get(field)
//   }

//   const clearStickyStyles = (rows: HTMLElement[]) => {
//     rows.forEach(row => {
//       const cells = Array.from(row.children) as HTMLElement[]
//       cells.forEach(cell => {
//         cell.style.position = ''
//         cell.style.left = ''
//         cell.style.right = ''
//         cell.style.zIndex = ''
//         cell.style.background = ''
//         cell.classList.remove('vs-sticky-left', 'vs-sticky-right')
//       })
//     })
//   }

//   const applyStickyStyles = (
//     rows: HTMLElement[],
//     stickyIndexes: number[],
//     offsets: Map<number, number>,
//     direction: 'left' | 'right',
//     fieldToIndex: Map<string, number>,
//     groupFirstChildField: Map<string, string | undefined>
//   ) => {
//     rows.forEach(row => {
//       const cells = Array.from(row.children) as HTMLElement[]
//       const isHeaderRow = row.closest('thead') !== null

//       cells.forEach(cell => {
//         const field = cell.getAttribute('data-field')
//         if (!field) return

//         const resolvedIndex = resolveHeaderFieldIndex(field, fieldToIndex, groupFirstChildField)
//         if (resolvedIndex === undefined || !stickyIndexes.includes(resolvedIndex)) return

//         const offset = offsets.get(resolvedIndex) || 0
//         const zIndex = isHeaderRow ? '4' : '3'

//         cell.style.position = 'sticky'
//         cell.style[direction] = `${offset}px`
//         cell.style.zIndex = zIndex
//         cell.classList.add(`vs-sticky-${direction}`)
//         cell.style.background = 'var(--vs-table-bg, #fff)'
//       })
//     })
//   }

//   const setupSticky = async () => {
//     const rows = getTableRows()
//     if (!rows.length) return

//     const bodyRows = getBodyRows(rows)
//     if (!bodyRows.length) return

//     const bodyCells = getBodyCells(bodyRows)
//     const fieldToIndex = createFieldToIndexMap(bodyCells)
//     const stickyIndexes = getStickyIndexes(bodyCells, fieldToIndex, columns.value)

//     console.log('[useStickyColumns] Sticky columns:', {
//       left: stickyIndexes.left.map(idx => ({ index: idx, field: columns.value[idx]?.field })),
//       right: stickyIndexes.right.map(idx => ({ index: idx, field: columns.value[idx]?.field }))
//     })

//     clearStickyStyles(rows)

//     const leftOffsets = calculateOffsets(bodyCells, stickyIndexes.left, 'left')
//     const rightOffsets = calculateOffsets(bodyCells, stickyIndexes.right, 'right')
//     const groupFirstChildField = createGroupFirstChildFieldMap(columns.value)

//     applyStickyStyles(rows, stickyIndexes.left, leftOffsets, 'left', fieldToIndex, groupFirstChildField)
//     applyStickyStyles(rows, stickyIndexes.right, rightOffsets, 'right', fieldToIndex, groupFirstChildField)

//     updateShadows()
//   }

//   const refreshSticky = async () => {
//     await nextTick()
//     setTimeout(() => {
//       try {
//         setupSticky()
//       } catch (err) {
//         console.warn('[useStickyColumns] refreshSticky failed:', err)
//       }
//     }, 150)
//   }

//   const setupEventListeners = () => {
//     const scrollEl = tableRef.value?.parentElement
//     scrollEl?.addEventListener('scroll', updateShadows)
//     updateShadows()
//   }

//   const cleanupEventListeners = () => {
//     const scrollEl = tableRef.value?.parentElement
//     scrollEl?.removeEventListener('scroll', updateShadows)
//   }

//   onMounted(async () => {
//     await nextTick()
//     setTimeout(() => {
//       refreshSticky()
//     }, 300)
//     setupEventListeners()
//   })

//   onBeforeUnmount(cleanupEventListeners)

//   watch([columns, hasGroups], refreshSticky, { deep: true })

//   return { hasLeftShadow, hasRightShadow, refreshSticky }
// }


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
  let resizeTimeout: number | null = null
  let lastScrollLeft = 0
  let isScrollingLeft = false

  const updateShadows = () => {
    const scrollEl = tableRef.value?.parentElement
    if (!scrollEl) return
    
    // Determine scroll direction
    const currentScrollLeft = scrollEl.scrollLeft
    isScrollingLeft = currentScrollLeft < lastScrollLeft
    lastScrollLeft = currentScrollLeft
    
    hasLeftShadow.value = currentScrollLeft > 0
    hasRightShadow.value =
      scrollEl.scrollWidth - currentScrollLeft > scrollEl.clientWidth + 1

    // Update z-index based on scroll direction
    updateStickyZIndex()
  }

  const updateStickyZIndex = () => {
    const rows = getTableRows()
    if (!rows.length) return

    rows.forEach(row => {
      const cells = Array.from(row.children) as HTMLElement[]
      const isHeaderRow = row.closest('thead') !== null
      const baseZIndex = isHeaderRow ? '4' : '3'

      cells.forEach(cell => {
        if (cell.classList.contains('vs-sticky-left')) {
          // When scrolling left, reduce z-index of left sticky columns
          cell.style.zIndex = isScrollingLeft ? '1' : baseZIndex
        } else if (cell.classList.contains('vs-sticky-right')) {
          // When scrolling right, reduce z-index of right sticky columns
          cell.style.zIndex = !isScrollingLeft ? '1' : baseZIndex
        }
      })
    })
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

  const getStickyIndexes = (
    bodyCells: HTMLElement[], 
    fieldToIndex: Map<string, number>, 
    columns: Column[]
  ): { left: number[], right: number[] } => {
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

  const createGroupFirstChildFieldMap = (columns: Column[]): Map<string, string | undefined> => {
    const groupMap = new Map<string, string | undefined>()
    columns.forEach(col => {
      if (col.children?.length) {
        groupMap.set(col.label, col.children[0]?.field)
      }
    })
    return groupMap
  }

  const resolveHeaderFieldIndex = (
    field: string | null, 
    fieldToIndex: Map<string, number>, 
    groupFirstChildField: Map<string, string | undefined>
  ): number | undefined => {
    if (!field) return undefined

    // Group header field pattern: 'group-<label>'
    if (field.startsWith('group-')) {
      const groupLabel = field.replace(/^group-/, '')
      const firstChildField = groupFirstChildField.get(groupLabel)
      return firstChildField ? fieldToIndex.get(firstChildField) : undefined
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
    groupFirstChildField: Map<string, string | undefined>
  ) => {
    rows.forEach(row => {
      const cells = Array.from(row.children) as HTMLElement[]
      const isHeaderRow = row.closest('thead') !== null

      cells.forEach(cell => {
        const field = cell.getAttribute('data-field')
        if (!field) return

        const resolvedIndex = resolveHeaderFieldIndex(field, fieldToIndex, groupFirstChildField)
        if (resolvedIndex === undefined || !stickyIndexes.includes(resolvedIndex)) return

        const offset = offsets.get(resolvedIndex) || 0
        const baseZIndex = isHeaderRow ? '4' : '3'
        // Initial z-index - will be adjusted during scroll
        const initialZIndex = direction === 'left' ? baseZIndex : '1'

        cell.style.position = 'sticky'
        cell.style[direction] = `${offset}px`
        cell.style.zIndex = initialZIndex
        cell.classList.add(`vs-sticky-${direction}`)
        cell.style.background = 'var(--vs-table-bg, #fff)'
      })
    })
  }

  const setupSticky = async () => {
    const rows = getTableRows()
    if (!rows.length) return

    const bodyRows = getBodyRows(rows)
    if (!bodyRows.length) return

    const bodyCells = getBodyCells(bodyRows)
    const fieldToIndex = createFieldToIndexMap(bodyCells)
    const stickyIndexes = getStickyIndexes(bodyCells, fieldToIndex, columns.value)

    console.log('[useStickyColumns] Sticky columns:', {
      left: stickyIndexes.left.map(idx => ({ index: idx, field: columns.value[idx]?.field })),
      right: stickyIndexes.right.map(idx => ({ index: idx, field: columns.value[idx]?.field }))
    })

    clearStickyStyles(rows)

    const leftOffsets = calculateOffsets(bodyCells, stickyIndexes.left, 'left')
    const rightOffsets = calculateOffsets(bodyCells, stickyIndexes.right, 'right')
    const groupFirstChildField = createGroupFirstChildFieldMap(columns.value)

    applyStickyStyles(rows, stickyIndexes.left, leftOffsets, 'left', fieldToIndex, groupFirstChildField)
    applyStickyStyles(rows, stickyIndexes.right, rightOffsets, 'right', fieldToIndex, groupFirstChildField)

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

  watch([columns, hasGroups], refreshSticky, { deep: true })

  return { hasLeftShadow, hasRightShadow, refreshSticky }
}