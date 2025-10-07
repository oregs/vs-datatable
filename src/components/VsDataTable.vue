<template>
  <div class="vs-datatable">
    <div class="vs-layout-row">
      <div class="vs-layout-start">
        <!-- Search and Filter Area -->
        <div v-if="showSearch" class="vs-search-container">
          <VsSearch
            v-model="searchQuery"
            @input-typed="onInputTyped"
            :placeholder="searchPlaceholder"
            :class="searchClass"
          />
          <slot name="filterArea"></slot>
        </div>
      </div>
      <div class="vs-layout-end">
        <!-- <DropDownButton /> -->
      </div>
    </div>

    <!-- Table Container -->
    <div class="vs-table-container" :class="containerClass">
      <div ref="tableResponsiveRef" class="vs-table-wrapper">
        <table class="vs-table" :class="tableClass">

          <!-- Table Header -->
          <VsDataTableHeader
            :columns="columns"
            :expandable="expandable"
            :is-item-selected-controlled="isItemSelectedControlled"
            :is-all-checked="isAllChecked"
            :is-some-checked="isSomeChecked"
            :tablename="tablename"
            :sort-helpers="sortHelpers"
            v-model:filters="filters"
            :rows="rows"
            :header-class="headerClass"
            @toggle-all="toggleAll"
            @apply-filter="(field: string, val: any) => { setFilter(field, val); page = 1 }"
            @clear-filter="(field: string) => { clearFilter(field); page = 1 }"
          >
            <template v-for="(_, name) in $slots" v-slot:[name]="slotProps">
              <slot :name="name" v-bind="slotProps" />
            </template>
          </VsDataTableHeader>

          <!-- Table Body -->
          <VsDataTableBody
            :loading="loading"
            :loading-text="loadingText"
            :no-data-text="noDataText"
            :no-data-description="noDataDescription"
            :paginated-rows="paginatedRows"
            :total-columns="totalColumns"
            :expandable="expandable"
            :is-item-selected-controlled="isItemSelectedControlled"
            :selected-items="selectedItems"
            :tablename="tablename"
            :columns="columns"
            :row-key="rowKey"
            :row-class="rowClass"
            :cell-class="cellClass"
            :has-row-click="hasRowClick"
            :get-row-key="getRowKey"
            :get-value="getValue"
            :is-row-expanded="isRowExpanded"
            :is-row-loading="isRowLoading"
            :toggle-row-expansion="toggleRowExpansion"
            :toggle-row="toggleRow"
            :is-row-selected="isRowSelected"
            @row-click="(item, index) => $emit('rowClick', item, index)"
          >
            <template v-for="(_, name) in $slots" v-slot:[name]="slotProps">
              <slot :name="name" v-bind="slotProps" />
            </template>
          </VsDataTableBody>

        </table>
      </div>
    </div>

    <!-- Pagination and Info -->
    <div v-if="showFooter" class="vs-table-footer">
      <div class="vs-footer-left">
        <!-- Rows per page -->
        <VsRowsPerPage v-model="rowsPerPage" @rows-per-page-changed="handleRowsPerPage" />
        <!-- Divider -->
        <div class="vs-divider"></div>
        <!-- Info -->
        <div class="vs-table-info">
          {{ recordRange.start < 1 ? 0 : recordRange.start }} - {{ recordRange.end }} of
          {{ totalRecords }} {{ entriesText }}
        </div>
      </div>
      <VsPagination
        v-model="page"
        :totalRecords="totalRecords"
        :rowsPerPage="rowsPerPage"
        :maxVisible="maxVisiblePages"
        :tablename="tablename"
        :class="paginationClass"
        @page-changed="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  defineProps,
  defineEmits,
  withDefaults,
  useAttrs,
  onMounted,
  onUnmounted,
  onBeforeMount,
  shallowRef,
  watch
} from 'vue'
import VsPagination from '@/components/VsPagination.vue'
import VsSearch from '@/components/VsSearch.vue'
import VsRowsPerPage from './VsRowsPerPage.vue'
import DropDownButton from './DropDownButton.vue'
import VsDataTableHeader from './VsDataTableHeader.vue'
import VsDataTableBody from './VsDataTableBody.vue'

// Import types and composables
import type { DataTableProps, DataTableEmits } from '@/types/datatable'
import { useDataTable } from '@/composables/useDataTable'
import { useDataTableSelection } from '@/composables/useDataTableSelection'
import { getValue, getRowKey, isRowSelected, calculateTotalColumns } from '@/utils/datatable'

// Props and Emits
const props = withDefaults(defineProps<DataTableProps>(), {
  rows: () => [],
  itemSelected: null,
  tablename: 'default-table',
  serverOptions: null,
  showHeader: true,
  showSearch: true,
  headerText: '',
  loading: false,
  showFooter: true,
  searchPlaceholder: 'Search...',
  loadingText: 'Loading...',
  noDataText: 'No data available',
  noDataDescription: 'Try adjusting your search criteria',
  entriesText: 'entries',
  maxVisiblePages: 5,
  rowsPerPage: 10,
  rowKey: 'id',
})

const internalRows = shallowRef(props.rows)

watch(
  () => props.rows,
  (newVal) => {
    internalRows.value = newVal
  },
  { deep: false }
)

const emit = defineEmits<DataTableEmits>()

// Component setup
const attrs = useAttrs()
const hasRowClick = computed(() => !!attrs['onRowClick'])

// Use composables
const {
  page,
  rowsPerPage,
  totalRecords,
  recordRange,
  handlePageChange,
  handleRowsPerPage,
  paginatedRows,
  sortHelpers,
  searchQuery,
  onInputTyped,
  isRowExpanded,
  getRowId,
  toggleRowExpansion,
  setRowLoading,
  isRowLoading,
  filters,
  setFilter,
  clearFilter,
} = useDataTable({ ...props, rows: internalRows.value }, emit)

const {
  selectedItems,
  isItemSelectedControlled,
  isAllChecked,
  isSomeChecked,
  toggleAll,
  toggleRow,
} = useDataTableSelection(props, emit)

// Computed properties
const totalColumns = computed(() =>
  calculateTotalColumns(props.columns, isItemSelectedControlled.value, props.expandable)
)

// Expose
defineExpose({
  toggleRowExpansion,
  setRowLoading,
})

// Lifecycle hooks
onMounted(() => {
  emit('tableMounted')
  try {
    emit('dataLoaded', props.rows)
  } catch (err) {
    emit('dataError', err)
  }
})

onUnmounted(() => {
  emit('tableUnmounted')
})

onBeforeMount(() => {
  emit('tableBeforeMount')
})
</script>

<style scoped>
.vs-datatable {
  --vs-table-wrapper-overflow: auto;
}

.vs-table-wrapper {
  overflow: var(--vs-table-wrapper-overflow);
}

.vs-table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--vs-spacing-sm) 0;
}

.vs-table-info {
  color: var(--vs-secondary);
  font-size: var(--vs-font-size-md);
}

.vs-search-container {
  margin-bottom: var(--vs-spacing-sm);
}
</style>
