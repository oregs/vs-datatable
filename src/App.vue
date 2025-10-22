<template>
  <div class="app" style="padding: 20px;">
    <h1>VsDataTable - Library Independent Design</h1>

    <!-- Basic Usage -->
    <section class="vs-pb-xl">
      <!-- VSBody -->
      <VsDataTable
        ref="tableRef"
        header-text="Pre-auction Approval (5)"
        :rows="rows"
        :columns="columns"
        v-model:sort="sort"
        v-model:item-selected="itemSelected"
        @page-updated="onPageUpdated"
        @sort-changed="fetchSortedData"
        @row-selected="rowSelected"
        @all-rows-selected="allRowsSelected"
        @rows-per-page-changed="handleRowsPerPage"
        :loading="false"
        expandable
        accordion
        @expand-row="onExpandRow"
        @collapse-row="onCollapseRow"
        stickyHeader
      >
        <template #filterAreaRight>
          <button type="button" class="vs-button vs-button-sm vs-button-primary">Testing</button>
        </template>

        <template #cell-id="{ item }">#{{ item.id }}</template>

        <template #cell-date="{ item }">
          {{ item.date }}
        </template>

        <template #cell-customer="{ item }">
          {{ item.customer }}
        </template>

        <template #cell-total="{ item }"> ${{ item.total.toFixed(2) }} </template>

        <template #row-expanded="{ item }">
          <!-- <div>
            <p><strong>Role:</strong> {{ item }}</p>
          </div> -->
        </template>

        <!-- ✅ Custom filter slot for "Status" -->
        <template #StatusFilterSlot="{ filter, apply, clear }">
          <div class="vs-custom-filter">
            <label class="vs-label">Status</label>
            <select v-model="filter.value" class="vs-input vs-w-full">
              <option disabled value="">-- Select Status --</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <div class="vs-flex vs-gap-2 vs-pt-sm">
              <button class="vs-btn vs-btn-primary" @click="apply()">Apply</button>
              <button class="vs-btn vs-btn-secondary" @click="clear()">Clear</button>
            </div>
          </div>
        </template>
      </VsDataTable>
      <!-- END VSBody -->
    </section>

    <!-- Server-side Pagination -->
    <section>
      <h2>Server-side Pagination</h2>
      <VsDataTable
        :columns="columns"
        :rows="rows"
        :server-options="serverOptions"
        :server-items-length="serverItemsLength"
        :loading="loading"
        @update:server-options="handleServerOptionsChange"
        @sort-changed="handleServerSortChange"
        @row-click="handleSercerRowClick"
        @rows-per-page-changed="handleServerRowsPerPage"
        @input-typed="handleServerInputTyped"
        @filter-change="onServerFilterChange"
      >
        <!-- ✅ Custom filter slot for "Status" -->
        <template #StatusFilterSlot="{ filter, apply, clear }">
          <div class="vs-custom-filter">
            <label class="vs-label">Status</label>
            <select v-model="filter.value" class="vs-input vs-w-full">
              <option disabled value="">-- Select Status --</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <div class="vs-flex vs-gap-2 vs-pt-sm">
              <button class="vs-btn vs-btn-primary" @click="apply()">Apply</button>
              <button class="vs-btn vs-btn-secondary" @click="clear()">Clear</button>
            </div>
          </div>
        </template>
      </VsDataTable>
    </section>

  </div>

  <!-- <DemoLayout /> -->
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { VsDataTable } from './index'
import type { ExpandEventPayload, CollapseEventPayload, ColumnFilter } from './index'
// import  VsDataTableExportDropDown from 'plugins/export/VsDataTableExportDropdown.vue'
// import DemoLayout from '@/views/DemoLayout.vue'
import { filterFns } from '@/utils/filterFns'

/**
 * ----------------------------------------------------------------
 * VSTable
 * ----------------------------------------------------------------
 */
 const rows = ref<any[]>([
  { id: 1, date: '2025-11-26 22:11', customer: 'Rwanda Lee', total: 391.0, status: 'Completed', payment: 'Credit Card', items: 3 },
  { id: 2, date: '2025-07-27 21:23', customer: 'Bolu', total: 398.0, status: 'Completed', payment: 'PayPal', items: 5 },
  { id: 3, date: '2025-07-28 13:23', customer: 'Temilade', total: 393.0, status: 'Processing', payment: 'Bank Transfer', items: 2 },
  { id: 4, date: '2025-11-29 08:45', customer: 'Samuel O.', total: 210.5, status: 'Completed', payment: 'Credit Card', items: 1 },
  { id: 5, date: '2025-11-30 14:19', customer: 'Grace Adeniyi', total: 145.75, status: 'Cancelled', payment: 'Cash', items: 4 },
  { id: 6, date: '2025-12-01 18:34', customer: 'Michael Obi', total: 500.0, status: 'Completed', payment: 'Credit Card', items: 6 },
  { id: 7, date: '2025-12-02 11:05', customer: 'Ada Lovelace', total: 315.25, status: 'Processing', payment: 'PayPal', items: 3 },
  { id: 8, date: '2025-10-03 16:42', customer: 'Chinedu Okafor', total: 260.0, status: 'Completed', payment: 'Bank Transfer', items: 2 },
  { id: 9, date: '2023-12-04 19:55', customer: 'Fatima Bello', total: 425.0, status: 'Completed', payment: 'Credit Card', items: 5 },
  { id: 10, date: '2023-10-05 09:14', customer: 'John Smith', total: 180.99, status: 'Completed', payment: 'PayPal', items: 1 },
  { id: 11, date: '2023-08-06 13:32', customer: 'Mary Johnson', total: 222.49, status: 'Processing', payment: 'Credit Card', items: 3 },
  { id: 12, date: '2023-08-07 15:47', customer: 'Ibrahim Musa', total: 355.75, status: 'Completed', payment: 'Cash', items: 4 },
  { id: 13, date: '2025-05-08 18:23', customer: 'Olivia Brown', total: 412.0, status: 'Completed', payment: 'Credit Card', items: 7 },
  { id: 14, date: '2025-06-09 10:11', customer: 'Emeka Uche', total: 295.3, status: 'Cancelled', payment: 'PayPal', items: 2 },
  { id: 15, date: '2025-09-10 17:50', customer: 'Sophia Davis', total: 389.0, status: 'Completed', payment: 'Bank Transfer', items: 3 },
  { id: 16, date: '2025-12-11 20:25', customer: 'David Wilson', total: 476.2, status: 'Processing', payment: 'Credit Card', items: 6 },
  { id: 17, date: '2025-12-12 12:41', customer: 'Ngozi Okeke', total: 150.0, status: 'Completed', payment: 'Cash', items: 1 },
  { id: 18, date: '2025-12-13 09:07', customer: 'Daniel James', total: 233.4, status: 'Completed', payment: 'PayPal', items: 2 },
  { id: 19, date: '2025-12-14 11:53', customer: 'Helen George', total: 325.6, status: 'Completed', payment: 'Credit Card', items: 4 },
  { id: 20, date: '2025-12-15 19:39', customer: 'Anthony Clark', total: 410.8, status: 'Processing', payment: 'Bank Transfer', items: 5 }
]);

const tableRef = ref<any>(null)
const expanded = ref<number[]>([])
const loading = ref<boolean>(false)
const sort = ref<any[]>([{ field: 'date', order: 'asc' }])
const itemSelected = ref<any[]>([])
// const columns = ref<any[]>([
//   { label: 'Order', field: 'id', width: '10', sortable: true, filter: { type: 'number-range', operators: ['between', 'equals', 'notEqual'] } },
//   { label: 'Date', field: 'date', width: '20', sortable: true, filter: { type: 'date-range', operators: ['between', 'equals', 'before', 'after'] } },
//   { label: 'Customer', field: 'customer', width: '30', sortable: true, filter: { type: 'text' } },
//   { label: 'Total', field: 'total', width: '15', sortable: true },
//   { label: 'Status', field: 'status', width: '15', sortable: true, filter: { type: 'custom', custom: 'StatusFilterSlot', filterKey: 'statusFilter' }, },
//   { label: 'Payment', field: 'payment', width: '15', sortable: true, filter: { type: 'multi-select', asyncOptions: () => ['Cash', 'Card', 'Wallet', 'POS'] } }, // Remove 'asyncOptions' to use Column field value
//   { label: 'Items', field: 'items', width: '15', sortable: true },
// ])

const columns = ref<any[]>([
  {
    label: 'Order Info',
    sticky: 'left',
    children: [
      { label: 'Order', field: 'id', sortable: true, filter: { type: 'number-range', operators: ['between', 'equals', 'notEqual'] } },
      { label: 'Date', field: 'date', sortable: true, filter: { type: 'date-range', operators: ['between', 'equals', 'before', 'after'] } },
    ],
  },
  { label: 'Customer', field: 'customer', sortable: true, filter: { type: 'text' } },
  { label: 'Total', field: 'total', sortable: true, sticky: 'left' },
  { label: 'Status', field: 'status', sortable: true, filter: { type: 'custom', custom: 'StatusFilterSlot', filterKey: 'statusFilter' }, },
  { label: 'Payment', field: 'payment', sortable: true, filter: { type: 'multi-select', asyncOptions: () => ['Cash', 'Card', 'Wallet', 'POS'] } }, // Remove 'asyncOptions' to use Column field value
  { label: 'Items', field: 'items', sortable: true },
])

const onPageUpdated = (newPage: number) => {
  console.log('Page updated to:', newPage)
}

const rowSelected = (row: any, index: number) => {
  console.log('RowSelected:', row, index)
}

const allRowsSelected = (rows: any) => {
  console.log('AllRowSelected:', rows)
}

function fetchSortedData(payload: {
  sort: { field: string; order: 'asc' | 'desc'; priority?: number }[]
}) {
  const sortArray = payload.sort

  // handle sorting
  console.log(sortArray)
}

const handleRowsPerPage = (rowsPerPage: number) => {
  console.log('RowsPerPage: ', rowsPerPage)
}

function onExpandRow({ row, index, rowId }: ExpandEventPayload) {
  // console.log("Expanded row:", row, index, rowId)
  tableRef.value?.setRowLoading(rowId, true)
  // Example: make API call here
  fetch(`/api/details/${rowId}`)
    .then(res => res.json())
    .then(data => {
      console.log("Row details:", data)
    })
    .finally(() => {
      tableRef.value?.setRowLoading(rowId, false)
    })
}

function onCollapseRow({ row, index, rowId }: CollapseEventPayload) {
  console.log("Collapsed row:", row, index, rowId)
}


/**
 * -------------------
 * SERVER OPTIONS
 *--------------------
 */
 const serverItemsLength = ref(20)
 const serverOptions = ref({
  page: 1,
  rowsPerPage: 25,
  sort: []
})

const handleSercerRowClick = (row: any, index: number) => {
  console.log('Row clicked:', row, index)
}

const handleServerOptionsChange = (options: any) => {
  console.log('Server options changed:', options)
  serverOptions.value = options
}

const handleServerSortChange = ({ sort }: { sort: any[] }) => {
  console.log('Sort changed:', sort)
}

const handleServerRowsPerPage = (rowsPerPage: number) => {
  serverOptions.value = {...serverOptions.value, rowsPerPage}
  console.log('RowsPerPage: ', rowsPerPage, serverOptions.value)
}

const handleServerInputTyped = (value: string) => {
  console.log(value)
}

async function onServerFilterChange(activeFilters: Record<string, ColumnFilter>) {
  console.log('Server filters:', activeFilters)

  // axios.get('/api/orders', { params: serializeFilters(activeFilters) })

  // const response = await axios.get('/orders', { params: { filters: activeFilters } })
  // rows.value = response.data
}

onMounted(() => {
  // ✅ Custom Status Filter
  filterFns.statusFilter = (row, field, filter) => {
    if (!filter.value?.length) return true
    return filter.value.includes(row[field])
  }
})
</script>
