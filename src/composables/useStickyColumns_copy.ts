// import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
// import type { Ref } from 'vue'
// import type { Column } from '@/types'

// export function useStickyColumns(
//   tableRef: Ref<HTMLElement | null>,
//   columns: Ref<Column[]>
// ) {
//   const hasLeftShadow = ref(false)
//   const hasRightShadow = ref(false)

//   const updateShadows = () => {
//     const scrollEl = tableRef.value?.parentElement
//     if (!scrollEl) return
//     hasLeftShadow.value = scrollEl.scrollLeft > 0
//     hasRightShadow.value =
//       scrollEl.scrollWidth - scrollEl.clientWidth - scrollEl.scrollLeft > 1
//   }

//   const setupSticky = () => {
//     const table = tableRef.value
//     if (!table) return

//     const rows = Array.from(table.querySelectorAll('tr')) as HTMLElement[]
//     if (!rows?.length) return

//     const firstRow = rows[0]
//     if (!firstRow) return
//     const allCells = Array.from(firstRow.children) as HTMLElement[]

//     // 1. Detect if we have any manual sticky columns
//     const hasLeftSticky = columns.value?.some(col => col.sticky === 'left') || false
//     const hasRightSticky = columns.value?.some(col => col.sticky === 'right') || false

//     // console.log('[useStickyColumns] Sticky detection:', {
//     //   hasLeftSticky,
//     //   hasRightSticky,
//     //   totalColumns: columns.value?.length
//     // })

//     // 2. Build field-to-index map
//     const fieldToIndex = new Map<string, number>()
//     allCells.forEach((cell, index) => {
//       const field = cell.getAttribute('data-field')
//       if (field) fieldToIndex.set(field, index)
//     })

//     // 3. Collect all sticky indexes
//     const leftIndexes: number[] = []
//     const rightIndexes: number[] = []

//     // Auto-sticky: only if manual sticky exists on that side
//     if (hasLeftSticky) {
//       allCells.forEach((cell, index) => {
//         if (cell.classList.contains('vs-expand-column') || 
//             cell.classList.contains('vs-checkbox-column')) {
//           leftIndexes.push(index)
//         }
//       })
//     }

//     // Manual sticky columns
//     columns.value?.forEach(col => {
//       if (!col.field) return
//       const index = fieldToIndex.get(col.field)
//       if (index === undefined) return

//       if (col.sticky === 'left') {
//         leftIndexes.push(index)
//       } else if (col.sticky === 'right') {
//         rightIndexes.push(index)
//       }
//     })

//     // Remove duplicates and sort
//     const uniqueLeftIndexes = [...new Set(leftIndexes)].sort((a, b) => a - b)
//     const uniqueRightIndexes = [...new Set(rightIndexes)].sort((a, b) => b - a) // Descending for right

//     // console.log('[useStickyColumns] Final indexes:', {
//     //   uniqueLeftIndexes,
//     //   uniqueRightIndexes
//     // })

//     // 4. Clear previous styles
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

//     // 5. Apply left sticky
//     if (uniqueLeftIndexes.length > 0) {
//       rows.forEach(row => {
//         const cells = Array.from(row.children) as HTMLElement[]
//         let leftOffset = 0

//         uniqueLeftIndexes.forEach(index => {
//           const cell = cells[index]
//           if (!cell) return

//           cell.style.position = 'sticky'
//           cell.style.left = `${leftOffset}px`
//           cell.style.zIndex = '3'
//           cell.classList.add('vs-sticky-left')
          
//           leftOffset += cell.offsetWidth
//         })
//       })
//     }

//     // 6. Apply right sticky
//     if (uniqueRightIndexes.length > 0) {
//       rows.forEach(row => {
//         const cells = Array.from(row.children) as HTMLElement[]
//         let rightOffset = 0

//         uniqueRightIndexes.forEach(index => {
//           const cell = cells[index]
//           if (!cell) return

//           cell.style.position = 'sticky'
//           cell.style.right = `${rightOffset}px`
//           cell.style.zIndex = '3'
//           cell.style.background = 'inherit'
//           cell.classList.add('vs-sticky-right')
          
//           rightOffset += cell.offsetWidth
//         })
//       })
//     }

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
//     }, 30)
//   }

//   onMounted(async () => {
//     await nextTick()
//     await refreshSticky()
//     const scrollEl = tableRef.value?.parentElement
//     scrollEl?.addEventListener('scroll', updateShadows)
//     updateShadows()
//   })

//   onBeforeUnmount(() => {
//     const scrollEl = tableRef.value?.parentElement
//     scrollEl?.removeEventListener('scroll', updateShadows)
//   })

//   watch(columns, refreshSticky, { deep: true })

//   return { hasLeftShadow, hasRightShadow, refreshSticky }
// }


import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import type { Ref } from 'vue'
import type { Column } from '@/types'

export function useStickyColumns(
  tableRef: Ref<HTMLElement | null>,
  columns: Ref<Column[]>,
  hasGroups: Ref<boolean> = ref(false)
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

    console.log('[useStickyColumns] Setting up sticky columns')

    // Get the body rows to determine actual column structure
    const bodyRows = rows.filter(row => row.closest('tbody'))
    if (!bodyRows.length) return

    const firstBodyRow = bodyRows[0]
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

    // Apply sticky styles to ALL rows
    // -------------------------------
    // We'll use the body-based offsets (leftOffsets/rightOffsets) for both body and header,
    // but resolve header cells to the correct body column index (accounts for grouped headers).
    const stickyChildFields = new Set<string>()
    // If a parent group is sticky, mark its children so we skip applying sticky to them individually
    columns.value.forEach(col => {
      if (col.children?.length && col.sticky) {
        col.children.forEach(child => {
          if (child.field) stickyChildFields.add(child.field)
        })
      }
    })

    // Helper: resolve a header cell's data-field to the body cell index
    const resolveHeaderFieldIndex = (field: string | null): number | undefined => {
      if (!field) return undefined

      // Group header (we render with data-field=`group-${group.label}`)
      if (field.startsWith('group-')) {
        const groupLabel = field.replace(/^group-/, '')
        // Find the parent column by label and pick the first child's field
        const parent = columns.value.find(c => c.children && c.children.length && c.label === groupLabel)
        const firstChildField = parent?.children?.[0]?.field
        if (!firstChildField) return undefined
        return fieldToIndex.get(firstChildField)
      }

      // Normal header / child header -> map directly to body index
      return fieldToIndex.get(field)
    }

    rows.forEach((row, rowIndex) => {
      const cells = Array.from(row.children) as HTMLElement[]
      const isHeaderRow = row.closest('thead') !== null

      // Apply left sticky
      uniqueLeftIndexes.forEach(index => {
        const cell = cells[index]
        if (!cell) return

        // If header row, map header cell field to body index to get a correct offset
        if (isHeaderRow) {
          const headerField = cell.getAttribute('data-field')
          const resolvedIndex = resolveHeaderFieldIndex(headerField)

          // If the header cell is a child of a sticky group, skip (group header will handle it)
          if (headerField && stickyChildFields.has(headerField)) return

          const offset = resolvedIndex !== undefined ? (leftOffsets.get(resolvedIndex) || 0) : (leftOffsets.get(index) || 0)
          cell.style.position = 'sticky'
          cell.style.left = `${offset}px`
          cell.style.zIndex = '4'
          cell.classList.add('vs-sticky-left')
        } else {
          // Body rows - apply using already-correct body index
          const offset = leftOffsets.get(index) || 0
          cell.style.position = 'sticky'
          cell.style.left = `${offset}px`
          cell.style.zIndex = '3'
          cell.classList.add('vs-sticky-left')
        }
      })

      // Apply right sticky
      uniqueRightIndexes.forEach(index => {
        const cell = cells[index]
        if (!cell) return

        if (isHeaderRow) {
          const headerField = cell.getAttribute('data-field')
          const resolvedIndex = resolveHeaderFieldIndex(headerField)

          if (headerField && stickyChildFields.has(headerField)) return

          const offset = resolvedIndex !== undefined ? (rightOffsets.get(resolvedIndex) || 0) : (rightOffsets.get(index) || 0)
          cell.style.position = 'sticky'
          cell.style.right = `${offset}px`
          cell.style.zIndex = '4'
          cell.classList.add('vs-sticky-right')
        } else {
          const offset = rightOffsets.get(index) || 0
          cell.style.position = 'sticky'
          cell.style.right = `${offset}px`
          cell.style.zIndex = '3'
          cell.classList.add('vs-sticky-right')
        }
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