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

      <!-- Group Headers -->
      <th
        v-for="group in groupedColumns"
        :key="group.label"
        :colspan="group.colspan"
        :data-field="`group-${group.label}`"
        class="vs-group-header"
        :style="{ textAlign: 'center' }"
      >
        {{ group.label }}
      </th>

      <!-- Non-grouped columns as rowspan="2" in group header row -->
      <template v-for="column in nonGroupedColumns" :key="column.field">
        <HeaderCell
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
          <!-- Pass through all header slots -->
          <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps" />
          </template>
        </HeaderCell>
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

      <!-- Header Columns - Use the same flatColumns structure as the body -->
      <template v-for="column in flatColumns" :key="column.field">
        <HeaderCell
          v-if="column.field && shouldRenderInSecondRow(column)"
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
          <!-- Pass through all header slots -->
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

const groupedColumns = computed(() =>
  props.columns
    .filter((col) => col.children && col.children.length)
    .map((col) => ({
      label: col.label,
      colspan: (col.children ?? []).length,
      children: col.children,
    }))
)

const nonGroupedColumns = computed(() =>
  props.columns.filter((col) => !col.children || !col.children.length)
)

// 🟢 CRITICAL FIX: Use the same flattening logic as VsDataTableBody.vue
const flatColumns = computed(() => {
  return props.columns.flatMap(col =>
    col.children && col.children.length ? col.children : [col]
  )
})

// 🟢 FIX: Updated logic to determine which columns should render in second row
function shouldRenderInSecondRow(column: Column): boolean {
  if (!hasGroups.value) return true
  
  // In grouped mode, only render children of grouped columns in the second row
  // Non-grouped columns are already rendered in the first row with rowspan="2"
  return props.columns.some(
    (parentCol) =>
      parentCol.children && 
      parentCol.children.some((child) => child.field === column.field)
  )
}

// Debug: Log the column structure
// watch(flatColumns, (newVal) => {
//   console.log('[VsDataTableHeader] Flat columns:', newVal.map(c => ({
//     field: c.field,
//     label: c.label,
//     sticky: c.sticky
//   })))
// }, { immediate: true })
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