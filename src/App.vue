<template>
  <div class="app" style="padding: 20px">
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
        stickyFooter
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

        <!-- <template #cell-total="{ item }"> ${{ item.total.toFixed(2) }} </template> -->

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
import type { ExpandEventPayload, CollapseEventPayload, ColumnFilter, Row } from './index'
// import  VsDataTableExportDropDown from 'plugins/export/VsDataTableExportDropdown.vue'
// import DemoLayout from '@/views/DemoLayout.vue'
import { filterFns } from '@/utils/filterFns'
import orders from '@/data/orders.json'

/**
 * ----------------------------------------------------------------
 * VSTable
 * ----------------------------------------------------------------
 */
const rows = ref<any[]>(orders.rows)

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
    label: 'Customer',
    field: 'customer',
    sortable: true,
    filter: { type: 'text' },
    footerValue: 'Total',
  },
  { label: 'Email', field: 'email', sortable: true, filter: { type: 'text' } },
  { label: 'Phone', field: 'phone', sortable: true },
  { label: 'Discount', field: 'discount', sortable: true },
  {
    label: 'Order Info',
    // sticky: 'right',
    children: [
      {
        label: 'Order',
        field: 'id',
        sortable: true,
        filter: { type: 'number-range', operators: ['between', 'equals', 'notEqual'] },
      },
      {
        label: 'Date',
        field: 'date',
        sortable: true,
        filter: { type: 'date-range', operators: ['between', 'equals', 'before', 'after'] },
      },
    ],
  },
  {
    label: 'Sales Data',
    children: [
      {
        label: 'Price',
        field: 'price',
        sortable: true,
        footerValue: (rows: any[]) => rows.reduce((sum, row) => sum + Number(row.price || 0), 0),
        footerFormatter: (value: number) => `$${value.toFixed(2)}`,
      },
      {
        label: 'Items',
        field: 'items',
        sortable: true,
        footerValue: (rows: any[]) => rows.reduce((sum, row) => sum + Number(row.items || 0), 0),
      },
    ],
  },
  { label: 'Location', field: 'location', sortable: true },
  { label: 'Notes', field: 'notes' },
  {
    label: 'Payment',
    field: 'payment',
    sortable: true,
    filter: { type: 'multi-select', asyncOptions: () => ['Cash', 'Card', 'Wallet', 'POS'] },
  }, // Remove 'asyncOptions' to use Column field value
  { label: 'Shipping', field: 'shipping', sortable: true },
  {
    label: 'Status',
    field: 'status',
    sortable: true,
    filter: { type: 'custom', custom: 'StatusFilterSlot', filterKey: 'statusFilter' },
  },
  { 
    label: 'Tax', 
    field: 'tax', 
    sortable: true,
    footerValue: (rows: Row[]) => rows.reduce((sum, r) => sum + Number(r.tax || 0), 0),
    footerFormatter: (val: number) => val.toFixed(2),
  }
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
    .then((res) => res.json())
    .then((data) => {
      console.log('Row details:', data)
    })
    .finally(() => {
      tableRef.value?.setRowLoading(rowId, false)
    })
}

function onCollapseRow({ row, index, rowId }: CollapseEventPayload) {
  console.log('Collapsed row:', row, index, rowId)
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
  sort: [],
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
  serverOptions.value = { ...serverOptions.value, rowsPerPage }
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
