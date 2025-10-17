import { onMounted, onBeforeUnmount, watch, nextTick, type Ref } from 'vue'

interface UseStickyHeaderOptions {
  enabled?: boolean
  maxHeight?: string | number
}

/**
 * Enables sticky table header so only the tbody scrolls.
 */
export function useStickyHeader(
  tableRef: Ref<HTMLElement | null>,
  options: UseStickyHeaderOptions = {}
) {
  const { enabled = false, maxHeight = 'calc(100vh - 250px)' } = options

  let wrapper: HTMLElement | null = null
  let resizeObserver: ResizeObserver | null = null

  const setupStickyHeader = () => {
    const tableEl = tableRef.value
    if (!enabled || !tableEl) return

    const thead = tableEl.querySelector('thead') as HTMLElement
    const tbody = tableEl.querySelector('tbody') as HTMLElement
    if (!thead || !tbody) return

    // Wrap table if needed
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

    // Apply sticky header style
    Object.assign(thead.style, {
      position: 'sticky',
      top: '0',
      zIndex: '5',
      background: 'var(--vs-table-header-bg, #fff)',
    })

    // Observe for table size changes
    if (!resizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        adjustHeaderWidth()
      })
      resizeObserver.observe(tableEl)
    }

    adjustHeaderWidth()
  }

  const adjustHeaderWidth = () => {
    const tableEl = tableRef.value
    if (!tableEl) return

    const thead = tableEl.querySelector('thead') as HTMLElement
    const headerCells = thead?.querySelectorAll('th') || []
    const bodyRow = tableEl.querySelector('tbody tr')

    if (bodyRow) {
      const bodyCells = bodyRow.querySelectorAll('td')
      headerCells.forEach((th, i) => {
        const td = bodyCells[i] as HTMLElement
        if (td) th.style.width = `${td.offsetWidth}px`
      })
    }
  }

  const cleanup = () => {
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
  }

  onMounted(async () => {
    if (!enabled) return
    await nextTick()
    setupStickyHeader()
  })

  onBeforeUnmount(() => {
    cleanup()
  })

  // Re-apply if enabled flag changes
  watch(
    () => enabled,
    async (val) => {
      await nextTick()
      if (val) setupStickyHeader()
      else cleanup()
    }
  )

  return {
    refresh: setupStickyHeader,
    cleanup,
  }
}
