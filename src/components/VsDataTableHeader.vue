<template>
  <thead ref="headerRef">
    <!-- Group Header Row -->
    <tr v-if="hasGroups">
      <!-- Expandable column -->
      <th
        v-if="expandable"
        class="vs-expand-column"
        rowspan="2"
        style="width: 5%"
        data-field="_expand"
      ></th>

      <!-- Checkbox Column -->
      <th
        v-if="isItemSelectedControlled"
        class="vs-checkbox-column"
        rowspan="2"
        style="width: 5%"
        data-field="_checkbox"
      >
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

      <!-- Render ALL columns in order, handling groups and non-groups properly -->
      <template v-for="column in props.columns" :key="column.field || column.label">
        <!-- Non-grouped column -->
        <HeaderCell
          v-if="!column.children || !column.children.length"
          :column="column"
          :rows="rows"
          :rowspan="2"
          :sort-helpers="sortHelpers"
          :filters="localFilters"
          :open-filter="openFilter"
          :header-class="headerClass"
          :tablename="tablename"
          v-bind="$attrs"
          @apply-filter="(field, val) => emit('applyFilter', field, val)"
          @clear-filter="(field) => emit('clearFilter', field)"
          @open-filter="handleOpenFilter"
          @close-filter="handleCloseFilter"
          @update:filters="(filters) => emit('update:filters', filters)"
        >
          <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps" />
          </template>
        </HeaderCell>

        <!-- Grouped column -->
        <th
          v-else
          :colspan="column.children.length"
          :data-field="`group-${column.label}`"
          class="vs-group-header"
          :style="{ textAlign: 'center' }"
        >
          {{ column.label }}
        </th>
      </template>
    </tr>

    <!-- Normal Header Row -->
    <tr>
      <!-- Expandable column header (shown only if not in group mode) -->
      <th
        v-if="expandable && !hasGroups"
        class="vs-expand-column"
        style="width: 5%"
        data-field="_expand"
      ></th>

      <!-- Checkbox Column (shown only if not in group mode) -->
      <th
        v-if="isItemSelectedControlled && !hasGroups"
        class="vs-checkbox-column"
        style="width: 5%"
        data-field="_checkbox"
      >
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

      <!-- Header Columns - Only render children of grouped columns in second row -->
      <template v-for="column in flatColumns" :key="column.field">
        <HeaderCell
          v-if="column.field && isGroupedColumnChild(column)"
          :column="column"
          :rows="rows"
          :sort-helpers="sortHelpers"
          :filters="localFilters"
          :open-filter="openFilter"
          :header-class="headerClass"
          :tablename="tablename"
          v-bind="$attrs"
          @apply-filter="(field, val) => emit('applyFilter', field, val)"
          @clear-filter="(field) => emit('clearFilter', field)"
          @open-filter="handleOpenFilter"
          @close-filter="handleCloseFilter"
          @update:filters="(filters) => emit('update:filters', filters)"
        >
          <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps" />
          </template>
        </HeaderCell>
      </template>
    </tr>
  </thead>
</template>

<script setup lang="ts">
import type { Column, Row, SortHelpers } from '@/types'
import { computed, ref } from 'vue'
import HeaderCell from '@/components/ui/HeaderCell.vue'

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
  openFilter.value = field
}

function handleCloseFilter(field: string) {
  if (openFilter.value === field) openFilter.value = null
}

const headerRef = ref<HTMLElement | null>(null)

// Computed properties
const hasGroups = computed(() => props.columns.some((col) => col.children && col.children.length))

// 🟢 FIX: Updated flatColumns to maintain proper order
const flatColumns = computed(() => {
  const flattened: Column[] = []
  
  props.columns.forEach(col => {
    if (col.children && col.children.length) {
      flattened.push(...col.children)
    } else {
      flattened.push(col)
    }
  })
  
  return flattened
})

// 🟢 NEW: Check if a column is a child of a grouped column
function isGroupedColumnChild(column: Column): boolean {
  if (!hasGroups.value) return true
  
  return props.columns.some(
    parentCol => 
      parentCol.children && 
      parentCol.children.some(child => child.field === column.field)
  )
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