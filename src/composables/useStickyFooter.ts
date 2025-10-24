// import { onMounted, onBeforeUnmount, watch, nextTick, type Ref } from 'vue'

// interface UseStickyFooterOptions {
//   enabled?: boolean
//   maxHeight?: string | number
// }

// /**
//  * Enables sticky table footer so only the tbody scrolls.
//  */
// export function useStickyFooter(
//   tableRef: Ref<HTMLElement | null>,
//   options: UseStickyFooterOptions = {}
// ) {
//   const { enabled = false, maxHeight = 'calc(100vh - 250px)' } = options

//   let wrapper: HTMLElement | null = null
//   let resizeObserver: ResizeObserver | null = null

//   const setupStickyFooter = () => {
//     const tableEl = tableRef.value
//     if (!enabled || !tableEl) return

//     const tfoot = tableEl.querySelector('tfoot') as HTMLElement
//     const tbody = tableEl.querySelector('tbody') as HTMLElement
//     if (!tfoot || !tbody) return

//     // Wrap table if needed (reuse same wrapper class for consistency)
//     if (!tableEl.parentElement?.classList.contains('vs-table-wrapper')) {
//       wrapper = document.createElement('div')
//       wrapper.classList.add('vs-table-wrapper')
//       tableEl.parentNode?.insertBefore(wrapper, tableEl)
//       wrapper.appendChild(tableEl)
//     } else {
//       wrapper = tableEl.parentElement
//     }

//     // Apply wrapper styles
//     Object.assign(wrapper!.style, {
//       overflowY: 'auto',
//       overflowX: 'auto',
//       position: 'relative',
//       maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
//     })

//     // Apply sticky footer style
//     Object.assign(tfoot.style, {
//       position: 'sticky',
//       bottom: '0',
//       zIndex: '5',
//       background: 'var(--vs-table-footer-bg, #f8f9fa)',
//     })

//     // Observe for table size changes
//     if (!resizeObserver) {
//       resizeObserver = new ResizeObserver(() => {
//         adjustFooterWidth()
//       })
//       resizeObserver.observe(tableEl)
//     }

//     adjustFooterWidth()
//   }

//   const adjustFooterWidth = () => {
//     const tableEl = tableRef.value
//     if (!tableEl) return
  
//     const tfoot = tableEl.querySelector('tfoot') as HTMLElement
//     const tbody = tableEl.querySelector('tbody') as HTMLElement
//     if (!tfoot || !tbody) return
  
//     const footerRow = tfoot.querySelector('tr') as HTMLElement
//     const bodyRow = tbody.querySelector('tr') as HTMLElement
//     if (!footerRow || !bodyRow) return
  
//     const footerCells = Array.from(footerRow.querySelectorAll('td, th')) as HTMLElement[]
//     const bodyCells = Array.from(bodyRow.querySelectorAll('td')) as HTMLElement[]
//     if (!footerCells.length || !bodyCells.length) return
  
//     // Apply body cell widths to footer cells
//     footerCells.forEach((footerCell, i) => {
//       const bodyCell = bodyCells[i]
//       if (bodyCell) {
//         footerCell.style.width = `${bodyCell.offsetWidth}px`
//         footerCell.style.minWidth = `${bodyCell.offsetWidth}px`
//       }
//     })
//   }
  
//   const cleanup = () => {
//     const tableEl = tableRef.value
//     if (tableEl) {
//       const tfoot = tableEl.querySelector('tfoot') as HTMLElement
//       if (tfoot) {
//         tfoot.style.position = ''
//         tfoot.style.bottom = ''
//         tfoot.style.zIndex = ''
//         tfoot.style.background = ''
//       }
//     }

//     if (resizeObserver) {
//       resizeObserver.disconnect()
//       resizeObserver = null
//     }
//   }

//   onMounted(async () => {
//     if (!enabled) return
//     await nextTick()
//     setupStickyFooter()
//   })

//   onBeforeUnmount(() => {
//     cleanup()
//   })

//   // Re-apply if enabled flag changes
//   watch(
//     () => enabled,
//     async (val) => {
//       await nextTick()
//       if (val) setupStickyFooter()
//       else cleanup()
//     }
//   )

//   return {
//     refresh: setupStickyFooter,
//     cleanup,
//   }
// }


import { onMounted, onBeforeUnmount, watch, nextTick, type Ref } from 'vue'

interface UseStickyFooterOptions {
  enabled?: boolean
  maxHeight?: string | number
}

/**
 * Enables sticky table footer so only the tbody scrolls.
 */
export function useStickyFooter(
  tableRef: Ref<HTMLElement | null>,
  options: UseStickyFooterOptions = {}
) {
  const { enabled = false, maxHeight = 'calc(100vh - 250px)' } = options

  let wrapper: HTMLElement | null = null
  let resizeObserver: ResizeObserver | null = null

  const setupStickyFooter = () => {
    const tableEl = tableRef.value
    if (!enabled || !tableEl) return

    const tfoot = tableEl.querySelector('tfoot') as HTMLElement
    const tbody = tableEl.querySelector('tbody') as HTMLElement
    if (!tfoot || !tbody) return

    // Wrap table if needed (reuse same wrapper class for consistency)
    if (!tableEl.parentElement?.classList.contains('vs-table-wrapper')) {
      wrapper = document.createElement('div')
      wrapper.classList.add('vs-table-wrapper')
      tableEl.parentNode?.insertBefore(wrapper, tableEl)
      wrapper.appendChild(tableEl)
    } else {
      wrapper = tableEl.parentElement
    }

    // Apply wrapper styles
    Object.assign(wrapper!.style, {
      overflowY: 'auto',
      overflowX: 'auto',
      position: 'relative',
      maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
    })

    // Apply sticky footer style
    Object.assign(tfoot.style, {
      position: 'sticky',
      bottom: '0',
      zIndex: '5',
      background: 'var(--vs-table-footer-bg, var(--vs-table-header-bg, #fff))',
    })

    // Observe for table size changes
    if (!resizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        adjustFooterWidth()
      })
      resizeObserver.observe(tableEl)
    }

    adjustFooterWidth()
  }

  /**
   * 🔹 Adjust footer cell widths to match tbody cells, including grouped footers
   */
  const adjustFooterWidth = () => {
    const tableEl = tableRef.value
    if (!tableEl) return

    const tfoot = tableEl.querySelector('tfoot') as HTMLElement
    const tbody = tableEl.querySelector('tbody') as HTMLElement
    if (!tfoot || !tbody) return

    const footerRow = tfoot.querySelector('tr') as HTMLElement
    const bodyRow = tbody.querySelector('tr') as HTMLElement
    if (!footerRow || !bodyRow) return

    const footerCells = Array.from(footerRow.querySelectorAll('td, th')) as HTMLElement[]
    const bodyCells = Array.from(bodyRow.querySelectorAll('td')) as HTMLElement[]
    if (!footerCells.length || !bodyCells.length) return

    let bodyCellIndex = 0

    footerCells.forEach((footerCell) => {
      const colspan = parseInt(footerCell.getAttribute('colspan') || '1', 10)

      if (colspan === 1) {
        const bodyCell = bodyCells[bodyCellIndex]
        if (bodyCell) {
          footerCell.style.width = `${bodyCell.offsetWidth}px`
          footerCell.style.minWidth = `${bodyCell.offsetWidth}px`
        }
        bodyCellIndex += 1
      } else {
        // Handle grouped footer columns (colspan > 1)
        let totalWidth = 0
        for (let i = 0; i < colspan; i++) {
          const bodyCell = bodyCells[bodyCellIndex + i]
          if (bodyCell) totalWidth += bodyCell.offsetWidth
        }
        if (totalWidth > 0) {
          footerCell.style.width = `${totalWidth}px`
          footerCell.style.minWidth = `${totalWidth}px`
        }
        bodyCellIndex += colspan
      }
    })
  }

  const cleanup = () => {
    const tableEl = tableRef.value
    if (tableEl) {
      const tfoot = tableEl.querySelector('tfoot') as HTMLElement
      if (tfoot) {
        tfoot.style.position = ''
        tfoot.style.bottom = ''
        tfoot.style.zIndex = ''
        tfoot.style.background = ''
      }
    }

    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
  }

  onMounted(async () => {
    if (!enabled) return
    await nextTick()
    setupStickyFooter()
  })

  onBeforeUnmount(() => {
    cleanup()
  })

  // Re-apply if enabled flag changes
  watch(
    () => enabled,
    async (val) => {
      await nextTick()
      if (val) setupStickyFooter()
      else cleanup()
    }
  )

  return {
    refresh: setupStickyFooter,
    cleanup,
  }
}
