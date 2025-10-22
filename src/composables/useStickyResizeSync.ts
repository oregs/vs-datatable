import { onMounted, onBeforeUnmount, nextTick } from 'vue'

export function useStickyResizeSync(
  tableRef: Ref<HTMLElement | null>,
  refreshSticky: () => void
) {
  let resizeObserver: ResizeObserver | null = null
  let rafId: number | null = null

  const setupResizeSync = () => {
    const table = tableRef.value
    if (!table) return

    // Clean up any previous observer
    cleanup()

    resizeObserver = new ResizeObserver(() => {
      if (rafId) cancelAnimationFrame(rafId)
      // Schedule refresh before next frame paint (super smooth)
      rafId = requestAnimationFrame(() => {
        refreshSticky()
      })
    })

    resizeObserver.observe(table)
  }

  const cleanup = () => {
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  onMounted(async () => {
    await nextTick()
    setupResizeSync()
  })

  onBeforeUnmount(cleanup)

  return { refreshSticky, cleanup }
}
