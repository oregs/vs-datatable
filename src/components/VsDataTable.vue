<template>
    <card class="vs-table-card mb-3">
      <div class="card-body p-4 vs-table-card-body">
        <!-- Search and Filter Area -->
        <div v-if="showSearch" class="input-group mb-4">
          <div class="flex-fill position-relative">
            <div class="input-group">
              <VsSearch v-model="searchQuery" @input-typed="onInputTyped" placeholder="Search products" />
              <div class="input-group-text position-absolute top-0 bottom-0 bg-none border-0" style="z-index: 1020;">
                <i class="fa fa-search opacity-5"></i>
              </div>
            </div>
          </div>
          <slot name="filterArea"></slot>
        </div>
  
        <!-- Table -->
        <div ref="tableResponsiveRef" class="table-responsive">
          <table class="table table-hover text-nowrap vs-table" :class="tableClass">
            <thead>
              <tr>
                <!-- Checkbox Column -->
                <th v-if="isItemSelectedControlled" :style="{ width: '5%' }">
                  <div class="form-check mb-2px">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      :id="tablename + '-main-checkbox'"
                      :checked="isAllChecked"
                      @change="toggleAll"
                    />
                    <label class="form-check-label pt-1px" :for="tablename + '-main-checkbox'"></label>
                  </div>
                </th>
  
                <!-- Header Columns -->
                <th
                  v-for="column in columns"
                  :key="column.field"
                  @click="column.sortable ? handleSort(column.field, $event) : null"
                  :style="{ width: column.width + '%', cursor: column.sortable ? 'pointer' : 'default' }"
                  class="border-top-0 pt-0 pb-2"
                >
                  <slot :name="`header-${column.field}`">
                    <div class="d-inline-flex align-items-center gap-1">
                      <span>{{ column.label }}</span>
  
                      <!-- Sort Icons -->
                      <span v-if="column.sortable" class="sort-container flex-column">
                        <i 
                          class="fa fa-sort-up sort-icon"
                          :class="{ 'active-asc': isColumnSorted(column.field) && getSortOrder(column.field) === 'asc' }"
                        ></i>
                        <i 
                          class="fa fa-sort-down sort-icon"
                          :class="{ 'active-desc': isColumnSorted(column.field) && getSortOrder(column.field) === 'desc' }"
                        ></i>
                      </span>
  
                      <!-- Priority Badge -->
                      <span v-if="getSortPriority(column.field) !== null" class="badge bg-secondary sort-badge">
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
                <td colspan="100%" class="text-center">
                  <Loader />
                </td>
              </tr>
  
              <!-- No Data -->
              <tr v-else-if="!sortedRows.length">
                <td colspan="100%" class="text-center">
                  <slot name="no-data">
                    <div v-html="noDataSVG('vs-table-no_data', 'No data available')"></div>
                  </slot>
                </td>
              </tr>
  
              <!-- Table Rows -->
              <template v-else v-for="(item, index) in sortedRows" :key="index">
                <tr :class="[rowClass, { 'cursor-pointer': hasRowClick }]" @click="$emit('row-click', item, index)">
                  <td v-if="isItemSelectedControlled" @click.stop>
                    <div class="form-check mb-2px">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        :id="tablename + '-checkbox-' + item.id"
                        :value="item"
                        v-model="selectedItems"
                      />
                      <label class="form-check-label pt-1px" :for="tablename + '-checkbox-' + item.id"></label>
                    </div>
                  </td>
                  <td v-for="column in columns" :key="column.field" class="align-middle">
                    <slot :name="`cell-${column.field}`" :item="item" :value="getValue(item, column.field)">
                      {{ getValue(item, column.field) }}
                    </slot>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
  
        <!-- Pagination -->
        <div class="d-md-flex align-items-center mt-1">
          <div v-if="showRowEntries" class="me-md-auto text-md-left text-center mb-2 mb-md-0">
            Showing {{ recordRange.start < 1 ? 0 : recordRange.start }} to {{ recordRange.end }} of {{ totalRecords }} entries
          </div>
          <div v-else class="me-md-auto"></div>
          <VsPagination
            v-model="page"
            :totalRecords="totalRecords"
            :rowsPerPage="rowsPerPage"
            :maxVisible="3"
            :tablename="tablename"
            class="text-center"
            @page-changed="handlePageChange"
          />
        </div>
      </div>
    </card>
</template>
  
<script setup lang="ts">
  import { ref, computed, defineProps, defineEmits, withDefaults, useAttrs } from "vue";
  import VsPagination from '@/components/VsPagination.vue';
  import VsSearch from '@/components/VsSearch.vue';
  import Loader from '@/components/Loader.vue';
  import { noDataSVG } from '@/composables/useVsHelper';
  
  interface Column {
    label: string;
    field: string;
    width?: string;
    sortable?: boolean;
    isKey?: boolean;
  }
  
  interface ServerOptions {
    page: number;
    rowsPerPage: number;
    sort?: { field: string; order: 'asc' | 'desc'; priority?: number }[];
  }
  
  const props = withDefaults(
    defineProps<{
      rows?: any[];
      itemSelected?: any[] | null;
      tablename?: string;
      sort?: { field: string; order: 'asc' | 'desc'; priority?: number }[];
      serverItemsLength?: number;
      serverOptions?: ServerOptions | null;
      showHeader?: boolean;
      headerText?: string;
      loading?: boolean;
      columns: Column[];
      showSearch?: boolean;
      tableClass?: string | string[] | Record<string, any>;
      rowClass?: string | string[] | Record<string, any>;
      showRowEntries?: boolean;
    }>(),
    {
      rows: () => [],
      itemSelected: null,
      tablename: "default-table",
      serverOptions: null,
      showHeader: true,
      headerText: '',
      loading: false,
      showSearch: true,
      showRowEntries: true,
    }
  );
  
  const emit = defineEmits<{
    (event: "update:itemSelected", value: any[]): void;
    (event: "update:serverItemsLength", value: number | undefined): void;
    (event: "update:serverOptions", value: ServerOptions): void;
    (event: "input-typed", value: string): void;
    (event: "page-updated", value: number): void;
    (event: 'sort-changed', payload: { sort: { field: string; order: 'asc' | 'desc', priority?: number }[] }): void;
    (event: "row-click", row: any, index: number): void;
  }>();
  
  const attrs = useAttrs();
  const hasRowClick = computed(() => !!attrs['onRowClick']);
  
  /* ---------------------------- */
  /* Utility Functions */
  /* ---------------------------- */
  function getValue(obj: any, path: string) {
    return path.split('.').reduce((acc, key) => acc?.[key], obj) ?? '';
  }
  
  const isColumnSorted = (field: string) => {
    return props.serverOptions?.sort?.some((s) => s.field === field);
  };
  
  const getSortPriority = (field: string): number | null => {
    const entry = props.serverOptions?.sort?.find((s) => s.field === field);
    return entry ? entry.priority ?? null : null;
  };
  
  const getSortOrder = (field: string) => {
    return props.serverOptions?.sort?.find(s => s.field === field)?.order ?? null;
  };
  
  /* ---------------------------- */
  /* Sorting */
  /* ---------------------------- */
  const sortedRows = computed(() => {
    const sort = props.serverOptions?.sort ?? [];
    if (!sort.length) return props.rows;
  
    const getNested = (obj: any, path: string) =>
      path.split('.').reduce((acc, key) => acc?.[key], obj) ?? '';
  
    return [...props.rows].sort((a, b) => {
      for (const { field, order } of sort) {
        const aValue = getNested(a, field);
        const bValue = getNested(b, field);
  
        if (aValue === bValue) continue;
        if (order === 'asc') return aValue > bValue ? 1 : -1;
        else return aValue < bValue ? 1 : -1;
      }
      return 0;
    });
  });
  
  const handleSort = (field: string, event: MouseEvent) => {
    if (!props.serverOptions) return;
  
    let sort = [...(props.serverOptions.sort || [])];
    const index = sort.findIndex((s) => s.field === field);
  
    if (!event.shiftKey) {
      if (index === -1) {
        sort = [{ field, order: 'asc' }];
      } else if (sort[index]?.order === 'asc') {
        sort = [{ field, order: 'desc' }];
      } else {
        sort = [];
      }
    } else {
      if (index === -1) {
        sort.push({ field, order: 'asc' });
      } else if (sort[index]?.order === 'asc') {
        sort[index]!.order = 'desc';
      } else {
        sort.splice(index, 1);
      }
    }
  
    sort = sort.map((s, i) => ({ ...s, priority: i + 1 }));
  
    emit("update:serverOptions", { ...props.serverOptions, sort });
    emit("sort-changed", {  sort });
  };
  
  /* ---------------------------- */
  /* Search */
  /* ---------------------------- */
  const searchQuery = ref<string>('');
  const onInputTyped = (value: string) => emit('input-typed', value);
  
  /* ---------------------------- */
  /* Pagination */
  /* ---------------------------- */
  const csRowPerPage = ref<number>(10);
  const rowsPerPage = computed<number>({
    get: () => props.serverOptions?.rowsPerPage ?? csRowPerPage.value,
    set: (newValue: number) => {
      if (props.serverOptions) {
        emit('update:serverOptions', { ...props.serverOptions, rowsPerPage: newValue });
      } else {
        csRowPerPage.value = newValue;
      }
    },
  });
  
  const csPage = ref<number>(1);
  const totalRecords = computed<number>({
    get: () => (props.serverItemsLength !== undefined ? props.serverItemsLength : props.rows.length),
    set: (newValue: number) => {
      if (props.serverItemsLength !== undefined) {
        emit('update:serverItemsLength', newValue);
      }
    },
  });
  
  const page = computed<number>({
    get: () => props.serverOptions?.page ?? csPage.value,
    set: (newValue: number) => {
      if (props.serverOptions) {
        emit('update:serverOptions', { ...props.serverOptions, page: newValue });
      } else {
        csPage.value = newValue;
      }
    },
  });
  
  const handlePageChange = (newPage: number) => {
    if (props.serverOptions) {
      emit('update:serverOptions', { ...props.serverOptions, page: newPage });
    }
    emit('page-updated', newPage);
  };
  
  const recordRange = computed(() => {
    const rowsPerPage = props.serverOptions?.rowsPerPage ?? 10;
    const start = (page.value - 1) * rowsPerPage + 1;
    const end = Math.min(page.value * rowsPerPage, totalRecords.value);
    return { start, end };
  });
  
  /* ---------------------------- */
  /* Checkbox Handling */
  /* ---------------------------- */
  const selectedItems = computed<any[]>({
    get: () => props.itemSelected || [],
    set: (newValue) => emit("update:itemSelected", newValue),
  });
  
  const isItemSelectedControlled = computed(() => props.itemSelected !== null);
  const isAllChecked = computed(() => props.rows.length > 0 && selectedItems.value.length === props.rows.length);
  const toggleAll = () => {
    selectedItems.value = isAllChecked.value ? [] : [...props.rows];
  };
</script>
  
<style scoped>
  .sort-container {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    line-height: 1;
  }
  .sort-icon {
    font-size: 0.62rem;
    color: #aaa;
    margin: -5px 0;
  }
  .sort-icon.active-asc,
  .sort-icon.active-desc {
    color: goldenrod;
  }
  .sort-badge {
    font-size: 0.65rem;
    line-height: 1;
    padding: 0.15rem 0.3rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
</style>
  