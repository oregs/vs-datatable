<template>
  <thead>
    <tr>
      <!-- Expandable column header -->
      <th v-if="expandable" class="vs-expand-column" style="width: 5%"></th>

      <!-- Checkbox Column -->
      <th v-if="isItemSelectedControlled" class="vs-checkbox-column" style="width: 5%">
        <div class="vs-checkbox">
          <input
            type="checkbox"
            :id="tablename + '-main-checkbox'"
            :checked="isAllChecked"
            :indeterminate="isSomeChecked"
            @change="toggleAll"
          />
          <label :for="tablename + '-main-checkbox'"></label>
        </div>
      </th>

      <!-- Header Columns -->
      <th
        v-for="column in columns"
        :key="column.field"
        @click="column.sortable ? sortHelpers.handleSort(column.field, $event) : null"
        :style="{ width: column.width + '%' }"
        :class="[column.sortable ? 'vs-sortable' : '', headerClass]"
      >
        <slot :name="`header-${column.field}`" :column="column">
          <div class="vs-header-content">
            <span class="vs-header-label">{{ column.label }}</span>

            <!-- Sort Icons -->
            <div v-if="column.sortable" class="vs-sort-icons">
              <span
                class="vs-sort-icon vs-sort-asc"
                :class="{
                  'vs-active':
                    sortHelpers.isColumnSorted(column.field) &&
                    sortHelpers.getSortOrder(column.field) === 'asc',
                }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="var(--vs-gray-800)"
                >
                  <path d="m280-400 200-200 200 200H280Z" />
                </svg>
              </span>

              <span
                class="vs-sort-icon vs-sort-desc"
                :class="{
                  'vs-active':
                    sortHelpers.isColumnSorted(column.field) &&
                    sortHelpers.getSortOrder(column.field) === 'desc',
                }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                >
                  <path d="M480-360 280-560h400L480-360Z" />
                </svg>
              </span>
            </div>

            <!-- Priority Badge -->
            <span
              v-if="sortHelpers.getSortPriority(column.field) !== null"
              class="vs-sort-priority"
            >
              {{ sortHelpers.getSortPriority(column.field) }}
            </span>

            <!-- Column Filter -->
            <VsDataTableFilterDropdown
              v-if="column.filter"
              :type="column.filter.type"
              :async-options="column.filter.asyncOptions"
              :field="column.field"
              :operators="column.filter.operators"
              v-model="localFilters[column.field]"
              :visible="openFilter === column.field"
              :column-data="rows.map((r) => r[column.field])"
              @apply="
                (val) => {
                  emit('applyFilter', column.field, val)
                }
              "
              @clear="
                () => {
                  emit('clearFilter', column.field)
                }
              "
              @close="handleCloseFilter(column.field)"
              @open="handleOpenFilter(column.field)"
            >
              <template v-if="column.filter.custom" #custom="{ filter, apply, clear }">
                <slot :name="column.filter.custom" :filter="filter" :apply="apply" :clear="clear" />
              </template>
            </VsDataTableFilterDropdown>
          </div>
        </slot>
      </th>
    </tr>
  </thead>
</template>

<script setup lang="ts">
import type { Column, Row, SortHelpers } from '@/types'
import { computed, ref } from 'vue'
import VsDataTableFilterDropdown from './VsDataTableFilterDropdown.vue'

const props = defineProps<{
  columns: Column[]
  expandable?: boolean
  isItemSelectedControlled?: boolean
  isAllChecked?: boolean
  isSomeChecked?: boolean
  tablename: string
  sortHelpers: SortHelpers
  filters: Record<string, any>
  anchorEl?: HTMLElement
  rows: Row[]
  headerClass?: string | string[] | Record<string, any>
}>()

const emit = defineEmits<{
  (e: 'toggleAll', event: Event): void
  (e: 'applyFilter', field: string, value: any): void
  (e: 'clearFilter', field: string): void
  (e: 'update:filters', filters: Record<string, any>): void
}>()

function toggleAll(event: Event) {
  emit('toggleAll', event)
}

const localFilters = computed({
  get: () => props.filters,
  set: (val) => emit('update:filters', val),
})

// Filter Column
const openFilter = ref<string | null>(null)

function handleOpenFilter(field: string) {
  openFilter.value = field // auto closes other filters
}

function handleCloseFilter(field: string) {
  // Only close if the current open filter matches
  if (openFilter.value === field) openFilter.value = null
}
</script>

<style scoped>
.vs-header-content {
  display: flex;
  align-items: center;
  gap: var(--vs-spacing-sm);
}

.vs-header-label {
  flex: 1;
}

</style>
