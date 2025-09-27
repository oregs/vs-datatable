# VsDataTable

A lightweight, feature-rich Vue 3 data table component with sorting, pagination, search, and row selection capabilities. **Completely library-independent** with extensive customization options and zero external dependencies.

## Features

- 🔍 **Search & Filter** - Built-in search functionality with customizable search input
- 📊 **Sorting** - Multi-column sorting with visual indicators and priority support
- 📄 **Pagination** - Server-side and client-side pagination with customizable controls
- ✅ **Row Selection** - Single and multi-row selection with checkbox controls
- 🎨 **Highly Customizable** - Extensive CSS variables, themes, and slot support
- 📱 **Responsive** - Mobile-friendly design with no external dependencies
- 🚀 **Performance** - Optimized for large datasets with server-side support
- 🎯 **TypeScript** - Full TypeScript support with type definitions
- 🎭 **Zero Dependencies** - No Bootstrap, FontAwesome, or other external libraries
- 🎨 **Theme System** - Built-in themes and easy customization via CSS variables

## Key Features

### 🎭 **Zero Dependencies**
- No Bootstrap, FontAwesome, or other external libraries
- Completely self-contained with custom CSS
- Smaller bundle size and faster loading

### 🎨 **Advanced Customization**
- CSS custom properties for easy theming
- Built-in theme system with multiple themes
- Component-level CSS class customization
- Flexible design system

### 🚀 **Enhanced Performance**
- Optimized rendering with better key management
- Improved sorting and pagination
- Better memory management
- Faster initial load

### 🛠️ **Developer Experience**
- Better TypeScript support
- More intuitive prop names
- Enhanced slot system
- Comprehensive documentation

### 🔄 **Flexible Sorting**
- Client-side and server-side sorting support
- Multi-column sorting with priority
- Visual sort indicators with SVG icons
- v-model:sort support for reactive sorting

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
| `sort` | `Sort[]` | `[]` | Initial sort configuration |
| `containerClass` | `string \| string[] \| Record<string, any>` | - | Custom CSS classes for table container |
| `headerClass` | `string \| string[] \| Record<string, any>` | - | Custom CSS classes for table headers |
| `cellClass` | `string \| string[] \| Record<string, any>` | - | Custom CSS classes for table cells |
| `searchClass` | `string \| string[] \| Record<string, any>` | - | Custom CSS classes for search input |
| `paginationClass` | `string \| string[] \| Record<string, any>` | - | Custom CSS classes for pagination |
| `searchPlaceholder` | `string` | `'Search...'` | Placeholder text for search input |
| `loadingText` | `string` | `'Loading...'` | Text shown during loading state |
| `noDataText` | `string` | `'No data available'` | Text shown when no data |
| `noDataDescription` | `string` | `'Try adjusting your search criteria'` | Description for no data state |
| `entriesText` | `string` | `'entries'` | Text for pagination info |
| `maxVisiblePages` | `number` | `5` | Maximum visible pagination pages |
| `rowKey` | `string \| ((item: any, index: number) => string \| number)` | `'id'` | Key field for row identification |

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
  sort?: Sort[];
}

interface Sort {
  field: string;
  order: 'asc' | 'desc';
  priority?: number;
}
```

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `row-click` | `(row: any, index: number)` | Fired when a row is clicked |
| `input-typed` | `(value: string)` | Fired when search input changes |
| `page-updated` | `(page: number)` | Fired when page changes |
| `sort-changed` | `{ sort: Sort[] }` | Fired when sorting changes |
| `update:itemSelected` | `(items: any[])` | Fired when selection changes |
| `update:serverOptions` | `(options: ServerOptions)` | Fired when server options change |
| `update:serverItemsLength` | `(length: number)` | Fired when total items count changes |
| `update:sort` | `(sort: Sort[])` | v-model:sort support for reactive sorting |

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

### Client-Side Sorting with v-model

```vue
<template>
  <VsDataTable
    :columns="columns"
    :rows="data"
    v-model:sort="sortState"
    @sort-changed="handleSortChange"
  />
</template>

<script setup lang="ts">
const sortState = ref([
  { field: 'name', order: 'asc', priority: 1 }
])

const handleSortChange = ({ sort }) => {
  console.log('Sort changed:', sort)
  // sortState is automatically updated via v-model:sort
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

### Multi-Column Sorting

```vue
<template>
  <VsDataTable
    :columns="columns"
    :rows="data"
    v-model:sort="sortState"
    @sort-changed="handleSortChange"
  />
</template>

<script setup lang="ts">
const sortState = ref([
  { field: 'name', order: 'asc', priority: 1 },
  { field: 'age', order: 'desc', priority: 2 }
])

const handleSortChange = ({ sort }) => {
  console.log('Multi-column sort:', sort)
  // Sort by name first (priority 1), then by age (priority 2)
}
</script>
```

### Sort Icons and Visual Indicators

The component includes built-in SVG sort icons that automatically show the current sort state:

- **Ascending**: Up arrow icon when column is sorted ascending
- **Descending**: Down arrow icon when column is sorted descending  
- **Priority Badge**: Shows sort priority number for multi-column sorting
- **Hover Effects**: Visual feedback on sortable columns

## Styling & Customization

### CSS Variables System

VsDataTable uses CSS custom properties for easy customization. Override any variable to change the appearance:

```css
:root {
  /* Colors */
  --vs-primary: #007bff;
  --vs-secondary: #6c757d;
  --vs-success: #28a745;
  --vs-danger: #dc3545;
  --vs-warning: #ffc107;
  --vs-info: #17a2b8;
  
  /* Table Colors */
  --vs-table-bg: #ffffff;
  --vs-table-border: #dee2e6;
  --vs-table-header-bg: #f8f9fa;
  --vs-table-header-color: #495057;
  --vs-table-hover-bg: #f5f5f5;
  
  /* Typography */
  --vs-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --vs-font-size: 14px;
  --vs-font-weight-normal: 400;
  --vs-font-weight-bold: 600;
  
  /* Spacing */
  --vs-spacing-xs: 4px;
  --vs-spacing-sm: 8px;
  --vs-spacing-md: 16px;
  --vs-spacing-lg: 24px;
  --vs-spacing-xl: 32px;
  
  /* Border Radius */
  --vs-border-radius: 4px;
  --vs-border-radius-sm: 2px;
  --vs-border-radius-lg: 8px;
  
  /* Shadows */
  --vs-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --vs-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  --vs-shadow-lg: 0 4px 8px rgba(0, 0, 0, 0.15);
  
  /* Transitions */
  --vs-transition: all 0.2s ease-in-out;
  --vs-transition-fast: all 0.15s ease-in-out;
}
```

### Built-in Themes

Apply themes using CSS classes:

```vue
<!-- Dark Theme -->
<VsDataTable class="vs-theme-dark" />

<!-- Minimal Theme -->
<VsDataTable class="vs-theme-minimal" />

<!-- Colorful Theme -->
<VsDataTable class="vs-theme-colorful" />

<!-- Corporate Theme -->
<VsDataTable class="vs-theme-corporate" />

<!-- Compact Theme -->
<VsDataTable class="vs-theme-compact" />

<!-- Rounded Theme -->
<VsDataTable class="vs-theme-rounded" />
```

### Custom Theme Creation

Create your own theme by extending the base styles:

```scss
// Custom Brand Theme
.vs-datatable.vs-theme-brand {
  --vs-primary: #ff6b35;
  --vs-secondary: #004e89;
  --vs-table-bg: #ffffff;
  --vs-table-header-bg: linear-gradient(135deg, #ff6b35, #004e89);
  --vs-table-header-color: #ffffff;
  
  .vs-table-container {
    border: 2px solid var(--vs-primary);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(255, 107, 53, 0.2);
  }
  
  .vs-pagination-button.vs-active {
    background: var(--vs-primary);
    transform: scale(1.05);
  }
}
```

### Component-Level Customization

Customize individual components with CSS classes:

```vue
<VsDataTable
  :columns="columns"
  :rows="data"
  container-class="my-custom-container"
  table-class="my-custom-table"
  header-class="my-custom-header"
  cell-class="my-custom-cell"
  search-class="my-custom-search"
  pagination-class="my-custom-pagination"
/>
```

### Advanced Customization

```scss
// Custom table styling
.vs-datatable {
  .vs-table {
    border: 2px solid var(--vs-primary);
    border-radius: 12px;
    overflow: hidden;
  }
  
  .vs-table thead th {
    background: linear-gradient(135deg, var(--vs-primary), var(--vs-secondary));
    color: white;
    font-weight: 700;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  .vs-table tbody tr:hover {
    background: linear-gradient(90deg, var(--vs-table-hover-bg), transparent);
    transform: scale(1.01);
  }
  
  .vs-pagination-button {
    border-radius: 50%;
    transition: all 0.3s ease;
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    &.vs-active {
      background: var(--vs-primary);
      transform: scale(1.1);
    }
  }
}
```

### Import Styles

```typescript
// Import default styles
import 'vs-datatable/style.css'

// Or import SCSS for advanced customization
import 'vs-datatable/style.scss'

// Import specific theme
import 'vs-datatable/style.css'
// Then apply theme class: <VsDataTable class="vs-theme-dark" />
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
        <span :class="`status-badge status-${getStatusColor(item.status)}`">
          {{ item.status }}
        </span>
      </template>
      
      <!-- Custom actions -->
      <template #cell-actions="{ item }">
        <button class="action-btn" @click="editUser(item)">
          Edit
        </button>
      </template>
    </VsDataTable>
    
    <!-- Bulk actions -->
    <div v-if="selectedUsers.length" class="bulk-actions">
      <button class="delete-btn" @click="deleteSelected">
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

<style scoped>
.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-success {
  background: #d4edda;
  color: #155724;
}

.status-danger {
  background: #f8d7da;
  color: #721c24;
}

.action-btn {
  padding: 4px 8px;
  border: 1px solid #007bff;
  background: transparent;
  color: #007bff;
  border-radius: 4px;
  cursor: pointer;
}

.bulk-actions {
  margin-top: 16px;
}

.delete-btn {
  padding: 8px 16px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
```

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Dependencies

- Vue 3.2+ (peer dependency)
- **Zero external dependencies** - No Bootstrap, FontAwesome, or other libraries required

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