/**
 * DataTable Search Composable
 */

import { type Ref, ref, computed } from 'vue'
import type { SearchHelpers } from '@/types/datatable'

export function useDataTableSearch<
  T extends (event: any, ...args: any[]) => void
>(
  emit: T,
  searchQuery: Ref<string>
) {
  const onInputTyped = (value: string) => {
    searchQuery.value = value
    emit('inputTyped', value)
  }

  const clearSearch = () => {
    searchQuery.value = ''
    emit('inputTyped', '')
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
    emit('inputTyped', query)
  }

  const searchHelpers: SearchHelpers = {
    searchQuery,
    onInputTyped
  }

  return {
    searchQuery,
    onInputTyped,
    clearSearch,
    setSearchQuery,
    searchHelpers,
  }
}
