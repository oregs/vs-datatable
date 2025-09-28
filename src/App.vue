<template>
  <div style="padding: 20px;">
    <h1>Playground</h1>
    
  <!-- VSBody -->
    <VsDataTable 
        header-text="Pre-auction Approval (5)"
        :rows="rows" 
        :columns="columns"
        v-model:sort="sort"
        v-model:item-selected="itemSelected"
        @input-typed="handleInputTyped"
        @page-updated="onPageUpdated"
        @sort-changed="fetchSortedData"
        @row-selected="rowSelected"
        @all-rows-selected="allRowsSelected"
        :loading="false"
        class="vs-theme-rounded"
    >
        <template #cell-id="{ item }">
            <RouterLink :to="`/page/order-details/${item.id}`">
                #{{ item.id }}
            </RouterLink>
            </template>

            <template #cell-date="{ item }">
                {{ item.date }}
            </template>

            <template #cell-customer="{ item }">
                {{ item.customer }}
            </template>

            <template #cell-total="{ item }">
                ${{ item.total.toFixed(2) }}
            </template>
    </VsDataTable>
    <!-- END VSBody -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// import VsDataTable from './index'
import { VsDataTable } from './index'

/**
 * ----------------------------------------------------------------
 * VSTable
 * ----------------------------------------------------------------
 */
const loading = ref<boolean>(false)
const sort = ref<any[]>([{ field: 'date', order: 'asc' }])
const itemSelected = ref<any[]>([])
const pendingAuctions = ref<any>([])
const columns = ref<any[]>([
  { label: 'Order', field: 'id', width: '10', sortable: true },
  { label: 'Date', field: 'date', width: '20', sortable: true },
  { label: 'Customer', field: 'customer', width: '30', sortable: true },
  { label: 'Total', field: 'total', width: '15', sortable: true },
]);

const rows = ref<any[]>([
  { id: 1, date: 'Fri 26 Nov, 10:11pm', customer: 'Rwanda Lee', total: 391.0 },
  { id: 2, date: 'Sat 27 Nov, 09:23pm', customer: 'Bolu', total: 398.0 },
  { id: 3, date: 'Sun 28 Nov, 13:23pm', customer: 'Temilade', total: 393.0 },
]);

const handleInputTyped = (value: string) => {
    console.log(value)

}

const onPageUpdated = (newPage: number) => {
  console.log('Page updated to:', newPage);

}

async function getPendingAuctionOrBid() {
    loading.value = true;

}

const rowSelected = (row: any, index: number) => {
  console.log('RowSelected:', row, index);
}

const allRowsSelected = (rows: any) => {
  console.log('AllRowSelected:', rows);
}

function fetchSortedData(payload: { sort: { field: string; order: 'asc' | 'desc'; priority?: number }[] }) {
  const sortArray = payload.sort;

  // handle sorting
  console.log(sortArray);
}
</script>
