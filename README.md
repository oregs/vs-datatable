# VsDataTable

A lightweight, feature-rich Vue 3 data table component with sorting, pagination, search, and row selection capabilities. Built with TypeScript and Bootstrap 5 styling.

## Features

- 🔍 **Search & Filter** - Built-in search functionality with customizable search input
- 📊 **Sorting** - Multi-column sorting with visual indicators and priority support
- 📄 **Pagination** - Server-side and client-side pagination with customizable controls
- ✅ **Row Selection** - Single and multi-row selection with checkbox controls
- 🎨 **Customizable** - Extensive slot support for customizing headers, cells, and layouts
- 📱 **Responsive** - Mobile-friendly design with Bootstrap 5
- 🚀 **Performance** - Optimized for large datasets with server-side support
- 🎯 **TypeScript** - Full TypeScript support with type definitions

## Installation

```bash
npm install vs-datatable
# or
yarn add vs-datatable
# or
pnpm add vs-datatable
```

## Quick Start

### Basic Usage

```vue
<template>
  <VsDataTable
    :columns="columns"
    :rows="data"
    :loading="loading"
    @row-click="handleRowClick"
  />
</template>

<script setup lang="ts">
import { VsDataTable } from 'vs-datatable'

const columns = [
  { label: 'Name', field: 'name', sortable: true },
  { label: 'Email', field: 'email', sortable: true },
  { label: 'Role', field: 'role', width: '20%' },
  { label: 'Status', field: 'status', sortable: true }
]

const data = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Inactive' }
]

const loading = ref(false)

const handleRowClick = (row: any, index: number) => {
  console.log('Row clicked:', row, index)
}
</script>
```

### Global Registration

```typescript
// main.ts
import { createApp } from 'vue'
import VsDataTable from 'vs-datatable'
import 'vs-datatable/style.css'

const app = createApp(App)
app.use(VsDataTable)
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `Column[]` | **required** | Array of column definitions |
| `rows` | `any[]` | `[]` | Array of data objects |
| `loading` | `boolean` | `false` | Shows loading state |
| `showSearch` | `boolean` | `true` | Enable/disable search functionality |
| `showRowEntries` | `boolean` | `true` | Show "Showing X to Y of Z entries" |
| `itemSelected` | `any[] \| null` | `null` | Controlled selection state |
| `tablename` | `string` | `"default-table"` | Unique identifier for the table |
| `tableClass` | `string \| string[] \| Record<string, any>` | - | Custom CSS classes for table |
| `rowClass` | `string \| string[] \| Record<string, any>` | - | Custom CSS classes for rows |
| `serverOptions` | `ServerOptions \| null` | `null` | Server-side configuration |
| `serverItemsLength` | `number` | - | Total number of items for server-side pagination |

### Column Definition

```typescript
interface Column {
  label: string;           // Display name
  field: string;          // Data field path (supports nested: 'user.profile.name')
  width?: string;         // Column width percentage
  sortable?: boolean;     // Enable sorting
  isKey?: boolean;        // Primary key field
}
```

### Server Options

```typescript
interface ServerOptions {
  page: number;
  rowsPerPage: number;
  sort?: { field: string; order: 'asc' | 'desc'; priority?: number }[];
}
```

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `row-click` | `(row: any, index: number)` | Fired when a row is clicked |
| `input-typed` | `(value: string)` | Fired when search input changes |
| `page-updated` | `(page: number)` | Fired when page changes |
| `sort-changed` | `{ sort: SortOption[] }` | Fired when sorting changes |
| `update:itemSelected` | `(items: any[])` | Fired when selection changes |
| `update:serverOptions` | `(options: ServerOptions)` | Fired when server options change |
| `update:serverItemsLength` | `(length: number)` | Fired when total items count changes |

## Slots

### Header Slots
```vue
<template #header-name="{ column }">
  <i class="fa fa-user"></i> {{ column.label }}
</template>
```

### Cell Slots
```vue
<template #cell-status="{ item, value }">
  <span :class="`badge bg-${value === 'Active' ? 'success' : 'danger'}`">
    {{ value }}
  </span>
</template>
```

### Custom Areas
```vue
<template #filterArea>
  <select class="form-select">
    <option>Filter by status</option>
  </select>
</template>

<template #no-data>
  <div class="text-center">
    <h4>No data found</h4>
    <p>Try adjusting your search criteria</p>
  </div>
</template>
```

## Advanced Usage

### Server-Side Pagination & Sorting

```vue
<template>
  <VsDataTable
    :columns="columns"
    :rows="data"
    :server-options="serverOptions"
    :server-items-length="totalItems"
    :loading="loading"
    @update:server-options="handleServerOptionsChange"
    @sort-changed="handleSortChange"
  />
</template>

<script setup lang="ts">
const serverOptions = ref({
  page: 1,
  rowsPerPage: 10,
  sort: []
})

const totalItems = ref(0)
const data = ref([])
const loading = ref(false)

const handleServerOptionsChange = async (options: ServerOptions) => {
  loading.value = true
  try {
    const response = await fetchData(options)
    data.value = response.data
    totalItems.value = response.total
    serverOptions.value = options
  } finally {
    loading.value = false
  }
}

const handleSortChange = ({ sort }) => {
  console.log('Sort changed:', sort)
}
</script>
```

### Row Selection

```vue
<template>
  <VsDataTable
    :columns="columns"
    :rows="data"
    v-model:item-selected="selectedItems"
    @update:item-selected="handleSelectionChange"
  />
</template>

<script setup lang="ts">
const selectedItems = ref([])

const handleSelectionChange = (items: any[]) => {
  console.log('Selected items:', items)
  // Handle bulk operations
}
</script>
```

### Custom Cell Rendering

```vue
<template>
  <VsDataTable :columns="columns" :rows="data">
    <!-- Custom avatar cell -->
    <template #cell-avatar="{ item }">
      <img :src="item.avatar" :alt="item.name" class="rounded-circle" width="32" height="32">
    </template>
    
    <!-- Custom actions cell -->
    <template #cell-actions="{ item }">
      <div class="btn-group btn-group-sm">
        <button class="btn btn-outline-primary" @click="editItem(item)">
          <i class="fa fa-edit"></i>
        </button>
        <button class="btn btn-outline-danger" @click="deleteItem(item)">
          <i class="fa fa-trash"></i>
        </button>
      </div>
    </template>
  </VsDataTable>
</template>
```

### Nested Object Support

```typescript
const columns = [
  { label: 'Name', field: 'name' },
  { label: 'Company', field: 'company.name' },        // Nested object
  { label: 'Address', field: 'address.street' },     // Deep nesting
  { label: 'Contact', field: 'contact.email' }       // Multiple levels
]

const data = [
  {
    id: 1,
    name: 'John Doe',
    company: { name: 'Acme Corp' },
    address: { street: '123 Main St' },
    contact: { email: 'john@acme.com' }
  }
]
```

## Styling & Customization

### CSS Classes

The component uses Bootstrap 5 classes and provides several customization points:

```scss
// Custom table styling
.vs-table {
  .sort-icon {
    color: #007bff;
  }
  
  .sort-badge {
    background-color: #28a745;
  }
}

// Custom pagination
.pagination {
  .page-link {
    border-radius: 0.375rem;
  }
}
```

### Import Styles

```typescript
// Import default styles
import 'vs-datatable/style.css'

// Or import SCSS for customization
import 'vs-datatable/style.scss'
```

### Custom SCSS Variables

```scss
// Override Bootstrap variables
$primary: #your-color;
$secondary: #your-color;

// Import the component styles
@import 'vs-datatable/style.scss';
```

## Examples

### Complete Example with Server-Side Data

```vue
<template>
  <div class="container">
    <h2>User Management</h2>
    
    <VsDataTable
      :columns="columns"
      :rows="users"
      :server-options="serverOptions"
      :server-items-length="totalUsers"
      :loading="loading"
      v-model:item-selected="selectedUsers"
      @update:server-options="fetchUsers"
      @row-click="viewUser"
      @sort-changed="handleSort"
    >
      <!-- Custom status cell -->
      <template #cell-status="{ item }">
        <span :class="`badge bg-${getStatusColor(item.status)}`">
          {{ item.status }}
        </span>
      </template>
      
      <!-- Custom actions -->
      <template #cell-actions="{ item }">
        <button class="btn btn-sm btn-outline-primary" @click="editUser(item)">
          Edit
        </button>
      </template>
    </VsDataTable>
    
    <!-- Bulk actions -->
    <div v-if="selectedUsers.length" class="mt-3">
      <button class="btn btn-danger" @click="deleteSelected">
        Delete {{ selectedUsers.length }} users
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { VsDataTable } from 'vs-datatable'

const columns = [
  { label: 'ID', field: 'id', width: '10%' },
  { label: 'Name', field: 'name', sortable: true },
  { label: 'Email', field: 'email', sortable: true },
  { label: 'Status', field: 'status', sortable: true },
  { label: 'Actions', field: 'actions', width: '15%' }
]

const users = ref([])
const selectedUsers = ref([])
const loading = ref(false)
const totalUsers = ref(0)

const serverOptions = ref({
  page: 1,
  rowsPerPage: 10,
  sort: []
})

const fetchUsers = async (options) => {
  loading.value = true
  try {
    const response = await api.getUsers({
      page: options.page,
      limit: options.rowsPerPage,
      sort: options.sort
    })
    users.value = response.data
    totalUsers.value = response.total
  } finally {
    loading.value = false
  }
}

const handleSort = ({ sort }) => {
  console.log('Sorting by:', sort)
}

const getStatusColor = (status) => {
  return status === 'Active' ? 'success' : 'danger'
}

const viewUser = (user) => {
  console.log('Viewing user:', user)
}

const editUser = (user) => {
  console.log('Editing user:', user)
}

const deleteSelected = () => {
  console.log('Deleting users:', selectedUsers.value)
}

onMounted(() => {
  fetchUsers(serverOptions.value)
})
</script>
```

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Dependencies

- Vue 3.2+
- Bootstrap 5.3+
- Font Awesome 7.0+

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- 📧 Email: [oregunwasegun@gmail.com]
- 🐛 Issues: [GitHub Issues](https://github.com/oregs/vs-datatable/issues)
- 📖 Documentation: [GitHub Wiki](https://github.com/oregs/vs-datatable/wiki)