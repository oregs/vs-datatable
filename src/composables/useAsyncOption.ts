import { ref } from 'vue'

// Global cache shared across all filter dropdowns
const optionsCache = new Map<string, string[]>()

export function useAsyncOption(props: {
  asyncOptions?: () => Promise<string[]>
  columnData: string[]
  cacheKey?: string // unique cache key (e.g., column.field)
}) {
  const columnOrAsyncOptions = ref<string[]>(props.columnData || [])
  const isLoading = ref(false)

  const showLoading = () => (isLoading.value = true)
  const hideLoading = () => (isLoading.value = false)

  async function loadAsyncOptions(forceRefresh = false) {
    if (!props.asyncOptions) return

    const cacheKey = props.cacheKey ?? 'default'

    // Use cached options unless force refresh
    if (!forceRefresh && optionsCache.has(cacheKey)) {
        columnOrAsyncOptions.value = optionsCache.get(cacheKey)!
      return
    }

    try {
      showLoading()
      const result = await props.asyncOptions()
      const options = Array.isArray(result) ? result : []
      columnOrAsyncOptions.value = options

      // Save to cache
      optionsCache.set(cacheKey, options)
    } catch (err) {
      console.error('Failed to load async filter options:', err)
    } finally {
      hideLoading()
    }
  }

  function clearCache() {
    const cacheKey = props.cacheKey ?? 'default'
    optionsCache.delete(cacheKey)
  }

  return {
    columnOrAsyncOptions,
    isLoading,
    clearCache,
    loadAsyncOptions,
  }
}
