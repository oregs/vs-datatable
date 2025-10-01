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
          <thead>
            <tr>
              <!-- Expandable column header -->
              <th v-if="expandable" class="vs-expand-column" style="width: 5%">
                <!-- <button
                  v-if="accordion"
                  @click="$emit('update:expanded', [])"
                  class="vs-expand-collapse-all"
                >
                  −
                </button> -->
              </th>
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
                  </div>
                </slot>
              </th>
            </tr>
          </thead>

          <tbody>
            <!-- Loading -->
            <tr v-if="loading">
              <td :colspan="totalColumns" class="vs-loading">
                <div class="vs-spinner"></div>
                <span>{{ loadingText }}</span>
              </td>
            </tr>

            <!-- No Data -->
            <tr v-else-if="!paginatedRows.length">
              <td :colspan="totalColumns" class="vs-no-data">
                <slot name="no-data">
                  <div class="vs-no-data-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
                      />
                    </svg>
                  </div>
                  <div class="vs-no-data-message">{{ noDataText }}</div>
                  <div class="vs-no-data-description">{{ noDataDescription }}</div>
                </slot>
              </td>
            </tr>

            <!-- Table Rows -->
            <template v-else v-for="(item, index) in paginatedRows" :key="getRowKey(item, index)">
              <tr
                :class="[
                  rowClass,
                  { 'vs-row-clickable': hasRowClick },
                  { 'vs-row-selected': isRowSelected(item, selectedItems, rowKey) },
                ]"
                @click="$emit('row-click', item, index)"
              >
                <!-- Expand toggle cell -->
                <td v-if="expandable" class="vs-expand-column" @click.stop>
                  <button
                    class="vs-expand-btn"
                    type="button"
                    :aria-expanded="isRowExpanded(item, index)"
                    :aria-controls="`row-details-${getRowKey(item, index)}`"
                    @click.stop="toggleRowExpansion(item, index)"
                  >
                    <!-- You can swap for an icon -->
                    <span v-if="isRowExpanded(item, index)">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#495057"
                      >
                        <path d="M480-345 240-585l56-56 184 183 184-183 56 56-240 240Z" />
                      </svg>
                    </span>
                    <span v-else>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#495057"
                      >
                        <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                      </svg>
                    </span>
                  </button>
                </td>

                <!-- Data Cells -->
                <td v-if="isItemSelectedControlled" @click.stop class="vs-checkbox-column">
                  <div class="vs-checkbox">
                    <input
                      type="checkbox"
                      :id="tablename + '-checkbox-' + getRowKey(item, index)"
                      :value="item"
                      :checked="selectedItems.some((r: Record<string, any>, i: number) => getRowKey(r, i) === getRowKey(item, index))"
                      @change="toggleRow(item, index)"
                    />
                    <label :for="tablename + '-checkbox-' + getRowKey(item, index)"></label>
                  </div>
                </td>
                <td v-for="column in columns" :key="column.field" :class="cellClass">
                  <slot
                    :name="`cell-${column.field}`"
                    :item="item"
                    :value="getValue(item, column.field)"
                    :column="column"
                    :index="index"
                  >
                    {{ getValue(item, column.field) }}
                  </slot>
                </td>
              </tr>

              <!-- Expanded Row -->
              <!-- Expanded content -->
              <template v-if="expandable">
                <tr v-if="isRowExpanded(item, index)" class="vs-row-extendable">
                  <td :colspan="totalColumns">
                    <slot name="row-expand" :item="item" :index="index">
                      <!-- default expanded content -->
                      <div class="vs-expand-content">
                        Expanded details for row
                        {{ getRowId(item, index) }}
                      </div>
                    </slot>
                  </td>
                </tr>
              </template>
            </template>
          </tbody>
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
  computed,
  defineProps,
  defineEmits,
  withDefaults,
  useAttrs,
  onMounted,
  onUnmounted,
  onBeforeMount,
} from 'vue'
import VsPagination from '@/components/VsPagination.vue'
import VsSearch from '@/components/VsSearch.vue'
import VsRowsPerPage from './VsRowsPerPage.vue'

// Import types and composables
import type { DataTableProps, DataTableEmits } from '@/types/datatable'
import { useDataTable } from '@/composables/useDataTable'
import { useDataTableSelection } from '@/composables/useDataTableSelection'
import { getValue, getRowKey, isRowSelected, calculateTotalColumns } from '@/utils/datatable'
import DropDownButton from './DropDownButton.vue'

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
} = useDataTable(props, emit)

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

// Lifecycle hooks
onMounted(() => {
  emit('table:mounted')
  try {
    emit('data-loaded', props.rows)
  } catch (err) {
    emit('data-error', err)
  }
})

onUnmounted(() => {
  emit('table:unmounted')
})

onBeforeMount(() => {
  emit('table:before-mount')
})
</script>

<style scoped>
.vs-datatable {
  --vs-table-wrapper-overflow: auto;
}

.vs-table-wrapper {
  overflow: var(--vs-table-wrapper-overflow);
}

.vs-header-content {
  display: flex;
  align-items: center;
  gap: var(--vs-spacing-sm);
}

.vs-header-label {
  flex: 1;
}

.vs-checkbox-column {
  width: 50px;
  text-align: center;
}

.vs-row-clickable {
  cursor: pointer;
}

.vs-row-selected {
  background-color: rgba(var(--vs-primary), 0.1);
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
  margin-bottom: var(--vs-spacing-md);
}

.vs-expand-column {
  width: 40px;
  text-align: center;
}
.vs-expand-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
}
.vs-row-expanded {
  background: #f9f9f9;
}
.vs-expanded-content {
  padding: 1rem;
  border-left: 3px solid #2d6cdf;
}
</style>
