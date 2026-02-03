import { onMounted, onBeforeUnmount, watch, nextTick, type Ref } from 'vue'

interface UseStickyFooterOptions {
  enabled?: boolean
  maxHeight?: string | number
  debounceMs?: number
}

export function useStickyFooter(
  tableRef: Ref<HTMLElement | null>,
  options: UseStickyFooterOptions = {}
) {
  const {
    enabled = false,
    maxHeight = 'calc(100vh - 250px)',
    debounceMs = 100,
  } = options

  let wrapper: HTMLElement | null = null
  let resizeObserver: ResizeObserver | null = null
  let rafId: number | null = null
  let isAdjusting = false
  let scrollHandlerBound = false
  let scrollHandler: (() => void) | null = null

  /** Debounce helper */
  const debounce = (fn: Function, delay = 100) => {
    let timer: number | null = null
    return (...args: any[]) => {
      if (timer) clearTimeout(timer)
      timer = window.setTimeout(() => fn(...args), delay)
    }
  }

  const adjustFooterWidth = debounce(() => {
    if (isAdjusting) return
    isAdjusting = true

    cancelAnimationFrame(rafId!)
    rafId = requestAnimationFrame(() => {
      const tableEl = tableRef.value
      if (!tableEl) return

      const tfoot = tableEl.querySelector('tfoot') as HTMLElement
      const tbody = tableEl.querySelector('tbody') as HTMLElement
      if (!tfoot || !tbody) return

      const footerRow = tfoot.querySelector('tr') as HTMLElement
      const bodyRow = tbody.querySelector('tr') as HTMLElement
      if (!footerRow || !bodyRow) {
        isAdjusting = false
        return
      }

      const footerCells = Array.from(footerRow.querySelectorAll('td, th')) as HTMLElement[]
      const bodyCells = Array.from(bodyRow.querySelectorAll('td')) as HTMLElement[]
      if (!footerCells.length || !bodyCells.length) {
        isAdjusting = false
        return
      }

      let bodyIndex = 0
      footerCells.forEach((fCell) => {
        const colspan = parseInt(fCell.getAttribute('colspan') || '1', 10)
        if (colspan === 1) {
          const bCell = bodyCells[bodyIndex]
          if (bCell) {
            const width = bCell.offsetWidth
            if (fCell.offsetWidth !== width) {
              fCell.style.width = `${width}px`
              fCell.style.minWidth = `${width}px`
            }
          }
          bodyIndex += 1
        } else {
          let totalWidth = 0
          for (let i = 0; i < colspan; i++) {
            const bCell = bodyCells[bodyIndex + i]
            if (bCell) totalWidth += bCell.offsetWidth
          }
          if (totalWidth > 0 && fCell.offsetWidth !== totalWidth) {
            fCell.style.width = `${totalWidth}px`
            fCell.style.minWidth = `${totalWidth}px`
          }
          bodyIndex += colspan
        }
      })

      isAdjusting = false
    })
  }, debounceMs)

  const setupStickyFooter = () => {
    const tableEl = tableRef.value
    if (!enabled || !tableEl) return

    const tfoot = tableEl.querySelector('tfoot') as HTMLElement
    const tbody = tableEl.querySelector('tbody') as HTMLElement
    const thead = tableEl.querySelector('thead') as HTMLElement
    if (!tfoot || !tbody) return

    // Wrap the table
    if (!tableEl.parentElement?.classList.contains('vs-table-wrapper')) {
      wrapper = document.createElement('div')
      wrapper.classList.add('vs-table-wrapper')
      tableEl.parentNode?.insertBefore(wrapper, tableEl)
      wrapper.appendChild(tableEl)
    } else {
      wrapper = tableEl.parentElement
    }

    // Apply wrapper styling
    Object.assign(wrapper!.style, {
      overflowY: 'auto',
      overflowX: 'auto',
      position: 'relative',
      maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
    })

    // Sticky footer styling
    Object.assign(tfoot.style, {
      position: 'sticky',
      bottom: '0',
      zIndex: '5',
      background: 'var(--vs-table-footer-bg, var(--vs-table-header-bg, #fff))',
    })

    // Sync scroll positions
    if (!scrollHandlerBound && thead) {
      scrollHandler = () => {
        const scrollLeft = wrapper!.scrollLeft
        thead.scrollLeft = scrollLeft
        tfoot.scrollLeft = scrollLeft
      }
      wrapper!.addEventListener('scroll', scrollHandler)
      scrollHandlerBound = true
    }

    // Observe size changes
    if (!resizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        adjustFooterWidth()
      })
      resizeObserver.observe(tableEl)
    }

    adjustFooterWidth()
  }

  const cleanup = () => {
    cancelAnimationFrame(rafId!)
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }

    if (wrapper && scrollHandler && scrollHandlerBound) {
      wrapper.removeEventListener('scroll', scrollHandler)
      scrollHandlerBound = false
    }

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
  }

  onMounted(async () => {
    if (!enabled) return
    await nextTick()
    setupStickyFooter()
  })

  onBeforeUnmount(cleanup)

  watch(
    () => enabled,
    async (val) => {
      await nextTick()
      if (val) setupStickyFooter()
      else cleanup()
    }
  )

  return {
    refresh: adjustFooterWidth,
    cleanup,
  }
}

