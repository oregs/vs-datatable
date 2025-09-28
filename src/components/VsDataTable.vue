<template>
  <div class="vs-datatable">
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

    <!-- Table Container -->
    <div class="vs-table-container" :class="containerClass">
      <div ref="tableResponsiveRef" class="vs-table-wrapper">
        <table class="vs-table" :class="tableClass">
          <thead>
            <tr>
              <!-- Checkbox Column -->
              <th v-if="isItemSelectedControlled" class="vs-checkbox-column" style="width: 5%">
                <div class="vs-checkbox">
                  <input
                    type="checkbox"
                    :id="tablename + '-main-checkbox'"
                    :checked="isAllChecked"
                    :indeterminate="isSomeChecked"
                    @change="toggleAll($event)"
                  />
                  <label :for="tablename + '-main-checkbox'"></label>
                </div>
              </th>

              <!-- Header Columns -->
              <th
                v-for="column in columns"
                :key="column.field"
                @click="column.sortable ? handleSort(column.field, $event) : null"
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
                            isColumnSorted(column.field) && getSortOrder(column.field) === 'asc',
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
                            isColumnSorted(column.field) && getSortOrder(column.field) === 'desc',
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
                    <span v-if="getSortPriority(column.field) !== null" class="vs-sort-priority">
                      {{ getSortPriority(column.field) }}
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
            <tr v-else-if="!sortedRows.length">
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
            <template v-else v-for="(item, index) in sortedRows" :key="getRowKey(item, index)">
              <tr
                :class="[
                  rowClass,
                  { 'vs-row-clickable': hasRowClick },
                  { 'vs-row-selected': isRowSelected(item) },
                ]"
                @click="$emit('row-click', item, index)"
              >
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
                <td
                  v-for="(column, colIndex) in columns"
                  :key="colIndex"
                  :class="cellClass"
                  @click.stop="emit('cell-click', row, column, index)"
                >
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
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination and Info -->
    <div class="vs-table-footer">
      <div v-if="showRowEntries" class="vs-table-info">
        showing {{ recordRange.start < 1 ? 0 : recordRange.start }} - {{ recordRange.end }} of
        {{ totalRecords }} {{ entriesText }}
      </div>
      <div v-else class="vs-table-info"></div>
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
  watch,
  onBeforeMount,
  onMounted,
  onUnmounted,
} from 'vue'
import VsPagination from '@/components/VsPagination.vue'
import VsSearch from '@/components/VsSearch.vue'

export interface Column {
  label: string
  field: string
  width?: string
  sortable?: boolean
  isKey?: boolean
}

export interface Sort {
  field: string
  order: 'asc' | 'desc'
  priority?: number
}

export interface ServerOptions {
  page: number
  rowsPerPage: number
  sort?: Sort[]
  [key: string]: any
}

/* ---------------------------- */
/* Props Types  + Emits
/* ---------------------------- */

/* Client-side props + emits */
type ClientProps = {
  rows: any[]
  sort?: Sort[]
  serverOptions?: never
}

/* Server-side props + emits */
type ServerProps = {
  rows: any[]
  sort?: never
  serverOptions: ServerOptions
}

type SharedProps = {
  rows?: any[]
  columns: Column[]
  itemSelected?: any[] | null
  tablename?: string
  serverItemsLength?: number
  showHeader?: boolean
  headerText?: string
  loading?: boolean
  showSearch?: boolean
  tableClass?: string | string[] | Record<string, any>
  rowClass?: string | string[] | Record<string, any>
  showRowEntries?: boolean
  containerClass?: string | string[] | Record<string, any>
  headerClass?: string | string[] | Record<string, any>
  cellClass?: string | string[] | Record<string, any>
  searchClass?: string | string[] | Record<string, any>
  paginationClass?: string | string[] | Record<string, any>
  searchPlaceholder?: string
  loadingText?: string
  noDataText?: string
  noDataDescription?: string
  entriesText?: string
  maxVisiblePages?: number
  rowKey?: string | ((item: any, index: number) => string | number)
}

/* Full types */
type Props = SharedProps & (ClientProps | ServerProps)

/* ---------------------------- */
/* Define Props with Defaults */
/* ---------------------------- */
const props = withDefaults(defineProps<Props>(), {
  itemSelected: null,
  tablename: 'default-table',
  showHeader: true,
  headerText: '',
  loading: false,
  showSearch: true,
  showRowEntries: true,
  searchPlaceholder: 'Search...',
  loadingText: 'Loading...',
  noDataText: 'No data available',
  noDataDescription: 'Try adjusting your search criteria',
  entriesText: 'entries',
  maxVisiblePages: 5,
  rowKey: 'id',
})

const emit = defineEmits<{
  // Lifecycle
  (event: 'table:before-mount'): void
  (event: 'table:mounted'): void
  (event: 'table:unmounted'): void

  // Data
  (event: 'data-loaded', rows: any[]): void
  (event: 'data-error', error: unknown): void

  // Interaction
  (event: 'row-selected', row: any, index: number): void
  (event: 'row-deselected', row: any, index: number): void
  (event: 'row-toggled', row: any, index: number, selected: boolean): void
  (event: 'rows-toggled', rows: any[], selected: boolean): void
  (event: 'all-rows-selected', rows: any[]): void
  (event: 'cell-click', row: any, column: Column, index: number): void

  // Shared
  (event: 'update:itemSelected', value: any[]): void
  (event: 'update:serverItemsLength', value: number | undefined): void
  (event: 'input-typed', value: string): void
  (event: 'page-updated', value: number): void
  (event: 'row-click', row: any, index: number): void

  // Sorting
  (event: 'sort-changed', payload: { sort: Sort[] }): void
  (event: 'update:sort', value: Sort[]): void
  (event: 'update:serverOptions', value: ServerOptions): void
}>()

const attrs = useAttrs()

// New computed properties
const totalColumns = computed(() => {
  return props.columns.length + (isItemSelectedControlled.value ? 1 : 0)
})

/**
 * --------------------
 * ROW SELECTION
 * --------------------
 */
const hasRowClick = computed(() => !!attrs['onRowClick'])

const getRowKey = (item: any, index?: number) => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(item, index ?? -1)
  }
  return item[props.rowKey] || index
}

const isRowSelected = (item: any) => {
  return selectedItems.value.some((selected) => getRowKey(selected, -1) === getRowKey(item, -1))
}

/* ---------------------------- */
/* Utility Functions */
/* ---------------------------- */
function getValue(obj: any, path: string) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj) ?? ''
}

/* ---------------------------- */
/* Sort helpers (server + client) */
/* ---------------------------- */
const isColumnSorted = (field: string) => {
  return activeSort.value.some((s) => s.field === field)
}

const getSortPriority = (field: string): number | null => {
  const entry = activeSort.value.find((s) => s.field === field)
  return entry ? entry.priority ?? null : null
}

const getSortOrder = (field: string) => {
  return activeSort.value.find((s) => s.field === field)?.order ?? null
}

/* ---------------------------- */
/* Sorting */
/* ---------------------------- */
const localSort = ref<Sort[]>(props.sort ?? [])

watch(
  () => props.sort,
  (newSort) => {
    if (newSort) localSort.value = [...newSort]
  },
  { deep: true }
)

const activeSort = computed(() => props.serverOptions?.sort ?? localSort.value ?? [])

const sortedRows = computed(() => {
  // If server mode is active → do not sort locally
  if (props.serverOptions) {
    return props.rows
  }

  // Client-side mode
  const sort = props.sort ?? []
  if (!sort.length) return props.rows

  const getNested = (obj: any, path: string) =>
    path.split('.').reduce((acc, key) => acc?.[key], obj) ?? ''

  return [...props.rows].sort((a, b) => {
    for (const { field, order } of sort) {
      const aValue = getNested(a, field)
      const bValue = getNested(b, field)

      if (aValue === bValue) continue
      if (order === 'asc') return aValue > bValue ? 1 : -1
      return aValue < bValue ? 1 : -1
    }
    return 0
  })
})

const handleSort = (field: string, event: MouseEvent) => {
  // Use whichever sort array exists (server or client)
  let sort: Sort[] = []

  if (props.serverOptions) {
    sort = [...(props.serverOptions.sort ?? [])]
  } else if (props.sort) {
    sort = [...props.sort]
  }

  const index = sort.findIndex((s) => s.field === field)

  if (!event.shiftKey) {
    if (index === -1) {
      sort = [{ field, order: 'asc' }]
    } else if (sort[index]?.order === 'asc') {
      sort = [{ field, order: 'desc' }]
    } else {
      sort = []
    }
  } else {
    if (index === -1) {
      sort.push({ field, order: 'asc' })
    } else if (sort[index]?.order === 'asc') {
      sort[index]!.order = 'desc'
    } else {
      sort.splice(index, 1)
    }
  }

  sort = sort.map((s, i) => ({ ...s, priority: i + 1 }))

  if (props.serverOptions) {
    // ✅ Server mode
    emit('update:serverOptions', { ...props.serverOptions, sort })
  } else {
    // ✅ Client mode
    emit('update:sort', sort)
  }

  emit('sort-changed', { sort })
}

/* ---------------------------- */
/* Search */
/* ---------------------------- */
const searchQuery = ref<string>('')
const onInputTyped = (value: string) => emit('input-typed', value)

/* ---------------------------- */
/* Pagination */
/* ---------------------------- */
const csRowPerPage = ref<number>(10)
const rowsPerPage = computed<number>({
  get: () => props.serverOptions?.rowsPerPage ?? csRowPerPage.value,
  set: (newValue: number) => {
    if (props.serverOptions) {
      emit('update:serverOptions', { ...props.serverOptions, rowsPerPage: newValue })
    } else {
      csRowPerPage.value = newValue
    }
  },
})

const csPage = ref<number>(1)
const totalRecords = computed<number>({
  get: () => (props.serverItemsLength !== undefined ? props.serverItemsLength : props.rows.length),
  set: (newValue: number) => {
    if (props.serverItemsLength !== undefined) {
      emit('update:serverItemsLength', newValue)
    }
  },
})

const page = computed<number>({
  get: () => props.serverOptions?.page ?? csPage.value,
  set: (newValue: number) => {
    if (props.serverOptions) {
      emit('update:serverOptions', { ...props.serverOptions, page: newValue })
    } else {
      csPage.value = newValue
    }
  },
})

const handlePageChange = (newPage: number) => {
  if (props.serverOptions) {
    emit('update:serverOptions', { ...props.serverOptions, page: newPage })
  }
  emit('page-updated', newPage)
}

const recordRange = computed(() => {
  const rowsPerPage = props.serverOptions?.rowsPerPage ?? 10
  const start = (page.value - 1) * rowsPerPage + 1
  const end = Math.min(page.value * rowsPerPage, totalRecords.value)
  return { start, end }
})

/* ---------------------------- */
/* Checkbox Handling */
/* ---------------------------- */
const localSelected = ref<any[]>(props.itemSelected || [])

watch(
  () => props.itemSelected,
  (newVal) => {
    if (newVal) localSelected.value = [...newVal]
    else localSelected.value = []
  },
  { immediate: true, deep: true }
)

const selectedItems = computed<any[]>({
  get: () => localSelected.value,
  set: (newValue) => {
    localSelected.value = newValue
    emit('update:itemSelected', newValue)
  },
})

const isItemSelectedControlled = computed(() => props.itemSelected !== null)
const isAllChecked = computed(
  () => props.rows.length > 0 && selectedItems.value.length === props.rows.length
)
const isSomeChecked = computed(() => {
  if (!props.rows.length) return false
  if (!selectedItems.value.length) return false

  return (
    !isAllChecked.value &&
    props.rows.some((row, index) =>
      selectedItems.value.some(
        (r, i) => getRowKey(r, i) === getRowKey(row, index)
      )
    )
  )
})

const toggleRow = (row: any, index: number) => {
  const rowKey = getRowKey(row, index)
  const exists = selectedItems.value.some(
    (r, i) => getRowKey(r, i) === rowKey
  )

  if (exists) {
    selectedItems.value = selectedItems.value.filter(
      (r, i) => getRowKey(r, i) !== rowKey
    )
    emit('row-deselected', row, index)
  } else {
    selectedItems.value = [...selectedItems.value, row]
    emit('row-selected', row, index)
  }
}

const toggleAll = (event: Event) => {
  const target = event.target as HTMLInputElement
  selectedItems.value = target.checked ? [...props.rows] : [];
  console.log('Data: ', selectedItems.value)
  emit('all-rows-selected', selectedItems.value)
}

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
  /* margin-top: var(--vs-spacing-sm); */
  padding: var(--vs-spacing-sm) 0;
}

.vs-table-info {
  color: var(--vs-secondary);
  font-size: var(--vs-font-size-md);
}

.vs-search-container {
  margin-bottom: var(--vs-spacing-md);
}
</style>
