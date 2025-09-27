<template>
  <div class="app">
    <h1>VsDataTable - Library Independent Design</h1>
    
    <!-- Basic Usage -->
    <section>
      <h2>Basic Usage</h2>
      <VsDataTable
        :columns="columns"
        :rows="data"
        :loading="loading"
        @row-click="handleRowClick"
      />
    </section>
    
    <!-- With Custom Theme -->
    <section>
      <h2>Dark Theme</h2>
      <VsDataTable
        :columns="columns"
        :rows="data"
        class="vs-theme-dark"
        :loading="loading"
      />
    </section>
    
    <!-- With Custom Styling -->
    <section>
      <h2>Custom Styling</h2>
      <VsDataTable
        :columns="columns"
        :rows="data"
        container-class="my-custom-container"
        table-class="my-custom-table"
        :loading="loading"
      />
    </section>
    
    <!-- Server-side Pagination -->
    <section>
      <h2>Server-side Pagination</h2>
      <VsDataTable
        :columns="columns"
        :rows="data"
        :server-options="serverOptions"
        :server-items-length="totalItems"
        :loading="loading"
        @update:server-options="handleServerOptionsChange"
        @sort-changed="handleSortChange"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { VsDataTable } from 'vs-datatable'
import 'vs-datatable/style.css'

const columns = [
  { label: 'ID', field: 'id', width: '10%', sortable: true },
  { label: 'Name', field: 'name', sortable: true },
  { label: 'Email', field: 'email', sortable: true },
  { label: 'Role', field: 'role', width: '15%' },
  { label: 'Status', field: 'status', sortable: true, width: '10%' },
  { label: 'Actions', field: 'actions', width: '15%' }
]

const data = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Inactive' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager', status: 'Active' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User', status: 'Pending' }
])

const loading = ref(false)
const totalItems = ref(100)

const serverOptions = ref({
  page: 1,
  rowsPerPage: 10,
  sort: []
})

const handleRowClick = (row: any, index: number) => {
  console.log('Row clicked:', row, index)
}

const handleServerOptionsChange = (options: any) => {
  console.log('Server options changed:', options)
  serverOptions.value = options
}

const handleSortChange = ({ sort }: { sort: any[] }) => {
  console.log('Sort changed:', sort)
}

onMounted(() => {
  // Simulate loading
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
})
</script>

<style>
.app {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

section {
  margin-bottom: 40px;
}

h1, h2 {
  color: #333;
  margin-bottom: 20px;
}

/* Custom styling example */
.my-custom-container {
  border: 2px solid #007bff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
}

.my-custom-table {
  border-radius: 8px;
  overflow: hidden;
}

/* Custom CSS variables override */
.vs-datatable {
  --vs-primary: #007bff;
  --vs-table-header-bg: linear-gradient(135deg, #007bff, #0056b3);
  --vs-table-header-color: white;
}
</style>
