<template>
  <div class="vs-datatable-toolbar vs-layout-row">
    <div class="vs-layout-start">
      <!-- Search -->
      <div v-if="showSearch" class="vs-search-container">
        <VsSearch
          :model-value="searchQuery"
          @update:model-value="onInput"
          :placeholder="searchPlaceholder"
          :class="searchClass"
        />
      </div>

      <!-- Custom left slot (for filters, etc.) -->
      <slot name="left"></slot>
    </div>

    <div class="vs-layout-end">
      <!-- Right slot (export, actions, etc.) -->
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import VsSearch from '@/components/VsSearch.vue'

defineProps<{
  showSearch?: boolean
  searchQuery: string
  searchPlaceholder?: string
  searchClass?: string | string[] | Record<string, any>
}>()

const emit = defineEmits<{
  (e: 'update:searchQuery', value: string): void
  (e: 'search', value: string): void
}>()

const onInput = (val: string) => {
  emit('update:searchQuery', val)
  emit('search', val)
}
</script>

<style scoped>
.vs-datatable-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--vs-spacing-md, 1rem);
}

.vs-layout-start,
.vs-layout-end {
  display: flex;
  align-items: center;
  gap: var(--vs-spacing-sm, 0.75rem);
}
</style>
