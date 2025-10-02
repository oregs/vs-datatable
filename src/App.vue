<template>
  <div class="app" style="padding: 20px;">
    <h1>VsDataTable - Library Independent Design</h1>

    <!-- Basic Usage -->
    <section>
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
      >
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
      </VsDataTable>
      <!-- END VSBody -->
    </section>

  </div>

  <DemoLayout />
</template>

<script setup lang="ts">
import { ref } from 'vue'
// import VsDataTable from './index'
import { VsDataTable } from './index'
import type { ExpandEventPayload, CollapseEventPayload } from './index' 
import DemoLayout from '@/views/DemoLayout.vue'

/**
 * ----------------------------------------------------------------
 * VSTable
 * ----------------------------------------------------------------
 */
 const rows = ref<any[]>([
  { id: 1, date: 'Fri 26 Nov, 10:11pm', customer: 'Rwanda Lee', total: 391.0 },
  { id: 2, date: 'Sat 27 Nov, 09:23pm', customer: 'Bolu', total: 398.0 },
  { id: 3, date: 'Sun 28 Nov, 01:23pm', customer: 'Temilade', total: 393.0 },
  { id: 4, date: 'Mon 29 Nov, 08:45am', customer: 'Samuel O.', total: 210.5 },
  { id: 5, date: 'Tue 30 Nov, 02:19pm', customer: 'Grace Adeniyi', total: 145.75 },
  { id: 6, date: 'Wed 01 Dec, 06:34pm', customer: 'Michael Obi', total: 500.0 },
  { id: 7, date: 'Thu 02 Dec, 11:05am', customer: 'Ada Lovelace', total: 315.25 },
  { id: 8, date: 'Fri 03 Dec, 04:42pm', customer: 'Chinedu Okafor', total: 260.0 },
  { id: 9, date: 'Sat 04 Dec, 07:55pm', customer: 'Fatima Bello', total: 425.0 },
  { id: 10, date: 'Sun 05 Dec, 09:14am', customer: 'John Smith', total: 180.99 },
  { id: 11, date: 'Mon 06 Dec, 01:32pm', customer: 'Mary Johnson', total: 222.49 },
  { id: 12, date: 'Tue 07 Dec, 03:47pm', customer: 'Ibrahim Musa', total: 355.75 },
  { id: 13, date: 'Wed 08 Dec, 06:23pm', customer: 'Olivia Brown', total: 412.0 },
  { id: 14, date: 'Thu 09 Dec, 10:11am', customer: 'Emeka Uche', total: 295.3 },
  { id: 15, date: 'Fri 10 Dec, 05:50pm', customer: 'Sophia Davis', total: 389.0 },
  { id: 16, date: 'Sat 11 Dec, 08:25pm', customer: 'David Wilson', total: 476.2 },
  { id: 17, date: 'Sun 12 Dec, 12:41pm', customer: 'Ngozi Okeke', total: 150.0 },
  { id: 18, date: 'Mon 13 Dec, 09:07am', customer: 'Daniel James', total: 233.4 },
  { id: 19, date: 'Tue 14 Dec, 11:53am', customer: 'Helen George', total: 325.6 },
  { id: 20, date: 'Wed 15 Dec, 07:39pm', customer: 'Anthony Clark', total: 410.8 },
])

const tableRef = ref<any>(null)
const expanded = ref<number[]>([])
const loading = ref<boolean>(false)
const sort = ref<any[]>([{ field: 'date', order: 'asc' }])
const itemSelected = ref<any[]>([])
const columns = ref<any[]>([
  { label: 'Order', field: 'id', width: '10', sortable: true, filter: { type: 'number-range' } },
  { label: 'Date', field: 'date', width: '20', sortable: true },
  { label: 'Customer', field: 'customer', width: '30', sortable: true, filter: { type: 'text' } },
  { label: 'Total', field: 'total', width: '15', sortable: true },
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
      // tableRef.value?.setRowLoading(rowId, false)
    })
}

function onCollapseRow({ row, index, rowId }: CollapseEventPayload) {
  console.log("Collapsed row:", row, index, rowId)
}
</script>
