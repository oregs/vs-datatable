<template>
    <th
      v-if="column && column.field"
      @click="onSort"
      :style="[
        {
          width: column.width + '%',
          textAlign: 'center',
        },
      ]"
      :data-field="column.field"
      :rowspan="rowspan"
      class="vs-group-header"
      :class="[
        headerClass,
        column.colHeaderClass,
        column.sortable ? 'vs-sortable' : '',
        column.sticky ? `vs-sticky-${column.sticky}` : '',
      ]"
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
          <span v-if="sortHelpers.getSortPriority(column.field) !== null" class="vs-sort-priority">
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
            :column-data="getColumnData()"
            @apply="(val: any) => onApplyFilter(val)"
            @clear="onClearFilter"
            @close="onCloseFilter"
            @open="onOpenFilter"
          >
            <template v-if="column.filter.custom" #custom="{ filter, apply, clear }">
              <slot :name="column.filter.custom" :filter="filter" :apply="apply" :clear="clear" />
            </template>
          </VsDataTableFilterDropdown>
        </div>
      </slot>
    </th>
  </template>
  
  <script setup lang="ts">
  import type { Column, Row, SortHelpers } from '@/types'
  import { computed } from 'vue'
  import VsDataTableFilterDropdown from '../VsDataTableFilterDropdown.vue'
  
  const props = defineProps<{
    column: Column
    rows: Row[]
    rowspan?: number
    sortHelpers: SortHelpers
    filters: Record<string, any>
    openFilter: string | null
    headerClass?: string | string[] | Record<string, any>
    tablename: string
  }>()
  
  const emit = defineEmits<{
    (e: 'applyFilter', field: string, value: any): void
    (e: 'clearFilter', field: string): void
    (e: 'openFilter', field: string): void
    (e: 'closeFilter', field: string): void
    (e: 'update:filters', filters: Record<string, any>): void
  }>()
  
  const localFilters = computed({
    get: () => props.filters,
    set: (val) => emit('update:filters', val),
  })

  function onSort(event: Event) {
  if (props.column.sortable && props.column.field) {
    props.sortHelpers.handleSort(props.column.field, event as MouseEvent)
  }
}
  
  function getColumnData() {
    if (!props.column.field) return []
    return props.rows.map((r) => r[props.column.field as keyof Row])
  }

  function onApplyFilter(val: any) {
  if (props.column.field) emit('applyFilter', props.column.field, val)
}

function onClearFilter() {
  if (props.column.field) emit('clearFilter', props.column.field)
}

function onCloseFilter() {
  if (props.column.field) emit('closeFilter', props.column.field)
}

function onOpenFilter() {
  if (props.column.field) emit('openFilter', props.column.field)
}
  </script>

<style scoped>
.vs-header-content {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.vs-sort-icon {
  font-size: 0.8rem;
  opacity: 0.3;
  cursor: pointer;
}

.vs-sort-icon.vs-active {
  opacity: 1;
  color: var(--vs-primary);
}
</style>
