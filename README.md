# VsDataTable

A lightweight, feature-rich Vue 3 data table component with sorting, pagination, search, and row selection capabilities. **Completely library-independent** with extensive customization options and zero external dependencies.

## Features

- 🔍 **Advanced Search & Filtering** - Built-in search with column-specific filters and operators
- 📊 **Enhanced Sorting** - Multi-column sorting with priority badges and visual indicators
- 📄 **Flexible Pagination** - Server-side and client-side pagination with customizable controls
- ✅ **Row Selection** - Single and multi-row selection with checkbox controls
- 📁 **Expandable Rows** - Row expansion with accordion mode and loading states
- 🎨 **Highly Customizable** - Extensive CSS variables, themes, and slot support
- 📱 **Responsive Design** - Mobile-friendly with no external dependencies
- 🚀 **Performance Optimized** - Optimized for large datasets with server-side support
- 🎯 **TypeScript** - Full TypeScript support with comprehensive type definitions
- 🎭 **Zero Dependencies** - No Bootstrap, FontAwesome, or other external libraries
- 🎨 **Theme System** - Built-in themes and easy customization via CSS variables
- 🔧 **Column Filters** - Multiple filter types: text, multi-select, number-range, date-range, custom
- 📈 **Async Options** - Support for async filter options with caching
- 🎪 **Floating UI** - Modern dropdown positioning with @floating-ui/dom

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

### 🔄 **Enhanced Sorting**
- Client-side and server-side sorting support
- Multi-column sorting with priority badges
- Visual sort indicators with SVG icons
- v-model:sort support for reactive sorting
- Priority-based sorting with numbered badges

### 📁 **Expandable Rows**
- Row expansion with custom content slots
- Accordion mode for single-row expansion
- Loading states for async content
- Programmatic control of expanded rows
- Custom expand/collapse icons

### 🔧 **Advanced Column Filtering**
- Multiple filter types: text, multi-select, number-range, date-range, custom
- Rich operators for each filter type
- Async filter options with caching
- Custom filter slots for complex scenarios
- Floating UI positioning with collision detection

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
| `showHeader` | `boolean` | `true` | Show/hide table header |
| `showFooter` | `boolean` | `true` | Show/hide table footer |
| `headerText` | `string` | `''` | Header text for the table |
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
| `rowsPerPage` | `number` | `10` | Initial rows per page |
| `rowKey` | `string \| ((item: any, index: number) => string \| number)` | `'id'` | Key field for row identification |
| `expandable` | `boolean` | `false` | Enable row expansion functionality |
| `accordion` | `boolean` | `false` | Accordion mode (only one row expanded at a time) |
| `expanded` | `(string \| number)[]` | `[]` | Controlled expanded rows state |

### Column Definition

```typescript
interface Column {
  label: string;           // Display name
  field: string;          // Data field path (supports nested: 'user.profile.name')
  width?: string;         // Column width percentage
  sortable?: boolean;     // Enable sorting
  isKey?: boolean;        // Primary key field
  filter?: {              // Column filter configuration
    type: 'text' | 'multi-select' | 'number-range' | 'date-range' | 'custom';
    operators?: string[]; // Custom operators for the filter
    asyncOptions?: () => Promise<string[]>; // Async options for multi-select
    filterFn?: (cellValue: any, filterValue: any, row: any) => boolean; // Custom filter function
    filterKey?: string;   // Key for custom filter functions
    custom?: string;      // Custom filter slot name
  };
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
| `update:expanded` | `(expanded: (string \| number)[])` | Fired when expanded rows change |
| `expand-row` | `{ row: any, index: number, rowId: string \| number }` | Fired when a row is expanded |
| `collapse-row` | `{ row: any, index: number, rowId: string \| number }` | Fired when a row is collapsed |
| `filter-change` | `Record<string, ColumnFilter>` | Fired when column filters change |
| `table-mounted` | `()` | Fired when table is mounted |
| `table-unmounted` | `()` | Fired when table is unmounted |
| `table-before-mount` | `()` | Fired before table mounts |
| `data-loaded` | `(data: any[])` | Fired when data is loaded |
| `data-error` | `(error: any)` | Fired when data loading fails |

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

### Expandable Row Slots
```vue
<template #row-expanded="{ item, index }">
  <div class="expanded-content">
    <h4>Details for {{ item.name }}</h4>
    <p>{{ item.description }}</p>
  </div>
</template>

<template #row-expanded-loader="{ item, index }">
  <div class="custom-loader">
    Loading details for {{ item.name }}...
  </div>
</template>
```

### Custom Filter Slots
```vue
<!-- Custom filter slot -->
<template #StatusFilterSlot="{ filter, apply, clear }">
  <div class="custom-filter">
    <label>Status Filter</label>
    <select v-model="filter.value">
      <option value="">All</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
    <button @click="apply">Apply</button>
    <button @click="clear">Clear</button>
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

### Enhanced Sorting with Priority Badges

VsDataTable features advanced sorting capabilities with visual priority indicators:

#### Priority-Based Sorting
When multiple columns are sorted, each column displays a priority badge showing its sort order:

```vue
<template>
  <VsDataTable
    :columns="columns"
    :rows="data"
    v-model:sort="sortState"
  />
</template>

<script setup lang="ts">
const sortState = ref([
  { field: 'name', order: 'asc', priority: 1 },    // Primary sort
  { field: 'age', order: 'desc', priority: 2 },    // Secondary sort
  { field: 'salary', order: 'asc', priority: 3 }   // Tertiary sort
])
</script>
```

#### Visual Priority Indicators
- **Priority 1**: Primary sort column (highest priority)
- **Priority 2**: Secondary sort column
- **Priority 3+**: Additional sort columns
- **Badge Display**: Small numbered badges appear next to sort icons
- **Color Coding**: Different colors for different priority levels

#### Interactive Sorting
Users can click column headers to:
- **First Click**: Sort ascending with priority 1
- **Second Click**: Sort descending with priority 1  
- **Third Click**: Remove sort
- **Shift+Click**: Add as secondary sort with priority 2
- **Ctrl+Click**: Add as tertiary sort with priority 3

#### Sort State Management
```vue
<script setup lang="ts">
// Reactive sort state
const sortState = ref([])

// Programmatic sort control
const setSort = (field: string, order: 'asc' | 'desc', priority: number = 1) => {
  // Remove existing sort for this field
  sortState.value = sortState.value.filter(s => s.field !== field)
  
  // Add new sort with priority
  sortState.value.push({ field, order, priority })
  
  // Reorder by priority
  sortState.value.sort((a, b) => a.priority - b.priority)
}

// Clear all sorts
const clearSorts = () => {
  sortState.value = []
}

// Clear specific field sort
const clearFieldSort = (field: string) => {
  sortState.value = sortState.value.filter(s => s.field !== field)
}
</script>
```

#### Server-Side Sorting Integration
For server-side sorting, the sort state is automatically sent to your server:

```vue
<script setup lang="ts">
const handleServerOptionsChange = async (options) => {
  const response = await fetch('/api/data', {
    method: 'POST',
    body: JSON.stringify({
      page: options.page,
      limit: options.rowsPerPage,
      sort: options.sort // Array of { field, order, priority }
    })
  })
  
  return response.json()
}
</script>
```

#### Custom Sort Icons
You can customize the sort icons by overriding the CSS:

```css
.vs-sort-icon {
  /* Custom sort icon styling */
}

.vs-sort-priority {
  /* Custom priority badge styling */
  background: var(--vs-primary);
  color: white;
  border-radius: 50%;
  font-size: 10px;
  font-weight: bold;
}
```

## Column Filtering

VsDataTable provides powerful column-level filtering with multiple filter types and operators.

### Filter Types

#### Text Filter
```typescript
const columns = [
  {
    label: 'Name',
    field: 'name',
    filter: {
      type: 'text',
      operators: ['contains', 'equals', 'startsWith', 'endsWith']
    }
  }
]
```

**Available Operators:**
- `contains` - Contains text
- `doesNotContains` - Does not contain text
- `equals` - Exact match
- `doesNotEqual` - Not equal
- `startsWith` - Starts with text
- `endsWith` - Ends with text
- `empty` - Field is empty
- `notEmpty` - Field is not empty

#### Multi-Select Filter
```typescript
const columns = [
  {
    label: 'Status',
    field: 'status',
    filter: {
      type: 'multi-select',
      operators: ['in', 'notIn']
    }
  }
]
```

#### Number Range Filter
```typescript
const columns = [
  {
    label: 'Age',
    field: 'age',
    filter: {
      type: 'number-range',
      operators: ['between', 'equals', 'greaterThan', 'lessThan', 'empty', 'notEmpty']
    }
  }
]
```

#### Date Range Filter
```typescript
const columns = [
  {
    label: 'Created Date',
    field: 'createdAt',
    filter: {
      type: 'date-range',
      operators: ['between', 'equals', 'before', 'after', 'empty', 'notEmpty']
    }
  }
]
```

#### Custom Filter
```typescript
const columns = [
  {
    label: 'Custom Field',
    field: 'custom',
    filter: {
      type: 'custom',
      custom: 'CustomFilterSlot'
    }
  }
]
```

### Async Filter Options

For multi-select filters, you can load options asynchronously:

```typescript
const columns = [
  {
    label: 'Department',
    field: 'department',
    filter: {
      type: 'multi-select',
      asyncOptions: async () => {
        const response = await fetch('/api/departments')
        return response.json()
      }
    }
  }
]
```

### Complete Filtering Example

```vue
<template>
  <VsDataTable
    :columns="columns"
    :rows="data"
    @filter-change="handleFilterChange"
  >
    <!-- Custom filter slot -->
    <template #CustomFilterSlot="{ filter, apply, clear }">
      <div class="custom-filter">
        <label>Custom Filter</label>
        <input 
          type="text" 
          v-model="filter.value" 
          placeholder="Enter custom value"
        />
        <button @click="apply">Apply</button>
        <button @click="clear">Clear</button>
      </div>
    </template>
  </VsDataTable>
</template>

<script setup lang="ts">
const columns = [
  { label: 'ID', field: 'id', width: '10%' },
  { 
    label: 'Name', 
    field: 'name', 
    filter: {
      type: 'text',
      operators: ['contains', 'equals', 'startsWith']
    }
  },
  { 
    label: 'Age', 
    field: 'age', 
    filter: {
      type: 'number-range',
      operators: ['between', 'greaterThan', 'lessThan']
    }
  },
  { 
    label: 'Status', 
    field: 'status', 
    filter: {
      type: 'multi-select',
      asyncOptions: async () => {
        return ['Active', 'Inactive', 'Pending']
      }
    }
  },
  { 
    label: 'Created Date', 
    field: 'createdAt', 
    filter: {
      type: 'date-range',
      operators: ['between', 'before', 'after']
    }
  }
]

const handleFilterChange = (filters) => {
  console.log('Active filters:', filters)
  // Handle filter changes for server-side filtering
}
</script>
```

## Expandable Rows

VsDataTable supports row expansion functionality with custom content, loading states, and accordion mode.

### Basic Expandable Rows

```vue
<template>
  <VsDataTable
    :columns="columns"
    :rows="data"
    expandable
    @expand-row="handleExpand"
    @collapse-row="handleCollapse"
  >
    <template #row-expanded="{ item, index }">
      <div class="expanded-content">
        <h4>Details for {{ item.name }}</h4>
        <p><strong>Description:</strong> {{ item.description }}</p>
        <p><strong>Created:</strong> {{ item.createdAt }}</p>
      </div>
    </template>
  </VsDataTable>
</template>

<script setup lang="ts">
const handleExpand = ({ row, index, rowId }) => {
  console.log('Row expanded:', row)
}

const handleCollapse = ({ row, index, rowId }) => {
  console.log('Row collapsed:', row)
}
</script>
```

### Accordion Mode

Enable accordion mode to allow only one row to be expanded at a time:

```vue
<template>
  <VsDataTable
    :columns="columns"
    :rows="data"
    expandable
    accordion
    @expand-row="handleExpand"
  >
    <template #row-expanded="{ item, index }">
      <div class="expanded-content">
        <!-- Custom expanded content -->
      </div>
    </template>
  </VsDataTable>
</template>
```

### Controlled Expansion State

You can control which rows are expanded using the `expanded` prop:

```vue
<template>
  <VsDataTable
    :columns="columns"
    :rows="data"
    expandable
    v-model:expanded="expandedRows"
  >
    <template #row-expanded="{ item, index }">
      <div class="expanded-content">
        <!-- Custom content -->
      </div>
    </template>
  </VsDataTable>
</template>

<script setup lang="ts">
const expandedRows = ref<(string | number)[]>(['1', '3'])

// Programmatically expand/collapse rows
const toggleRow = (rowId: string | number) => {
  const index = expandedRows.value.indexOf(rowId)
  if (index > -1) {
    expandedRows.value.splice(index, 1)
  } else {
    expandedRows.value.push(rowId)
  }
}
</script>
```

### Loading States

You can show loading states while fetching expanded content:

```vue
<template>
  <VsDataTable
    ref="tableRef"
    :columns="columns"
    :rows="data"
    expandable
    @expand-row="handleExpand"
  >
    <template #row-expanded="{ item, index }">
      <div class="expanded-content">
        <h4>Details for {{ item.name }}</h4>
        <p>{{ item.details }}</p>
      </div>
    </template>
    
    <template #row-expanded-loader="{ item, index }">
      <div class="loading-spinner">
        Loading details for {{ item.name }}...
      </div>
    </template>
  </VsDataTable>
</template>

<script setup lang="ts">
const tableRef = ref()

const handleExpand = async ({ row, index, rowId }) => {
  // Set loading state
  tableRef.value.setRowLoading(rowId, true)
  
  try {
    // Fetch additional data
    const details = await fetchRowDetails(row.id)
    row.details = details
  } finally {
    // Clear loading state
    tableRef.value.setRowLoading(rowId, false)
  }
}
</script>
```

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

### Advanced Example with All Features

Here's a comprehensive example showcasing all the new features including column filtering, expandable rows, enhanced sorting, and more:

```vue
<template>
  <div class="advanced-datatable-demo">
    <h2>Advanced VsDataTable Demo</h2>
    
    <VsDataTable
      ref="tableRef"
      :columns="columns"
      :rows="employees"
      :server-options="serverOptions"
      :server-items-length="totalEmployees"
      :loading="loading"
      v-model:item-selected="selectedEmployees"
      v-model:sort="sortState"
      v-model:expanded="expandedRows"
      expandable
      accordion
      header-text="Employee Management System"
      @update:server-options="fetchEmployees"
      @sort-changed="handleSortChange"
      @expand-row="loadEmployeeDetails"
      @collapse-row="clearEmployeeDetails"
      @filter-change="handleFilterChange"
      @row-click="viewEmployee"
    >
      <!-- Custom avatar cell -->
      <template #cell-avatar="{ item }">
        <img :src="item.avatar" :alt="item.name" class="employee-avatar" />
      </template>
      
      <!-- Custom status cell -->
      <template #cell-status="{ item }">
        <span :class="`status-badge status-${item.status.toLowerCase()}`">
          {{ item.status }}
        </span>
      </template>
      
      <!-- Custom salary cell -->
      <template #cell-salary="{ item }">
        ${{ formatNumber(item.salary) }}
      </template>
      
      <!-- Custom actions cell -->
      <template #cell-actions="{ item }">
        <div class="action-buttons">
          <button class="btn-edit" @click.stop="editEmployee(item)">
            Edit
          </button>
          <button class="btn-delete" @click.stop="deleteEmployee(item)">
            Delete
          </button>
        </div>
      </template>
      
      <!-- Expanded row content -->
      <template #row-expanded="{ item, index }">
        <div class="employee-details">
          <div class="detail-grid">
            <div class="detail-section">
              <h4>Personal Information</h4>
              <p><strong>Email:</strong> {{ item.email }}</p>
              <p><strong>Phone:</strong> {{ item.phone }}</p>
              <p><strong>Birth Date:</strong> {{ formatDate(item.birthDate) }}</p>
            </div>
            
            <div class="detail-section">
              <h4>Work Information</h4>
              <p><strong>Department:</strong> {{ item.department }}</p>
              <p><strong>Position:</strong> {{ item.position }}</p>
              <p><strong>Hire Date:</strong> {{ formatDate(item.hireDate) }}</p>
            </div>
            
            <div class="detail-section">
              <h4>Address</h4>
              <p>{{ item.address.street }}</p>
              <p>{{ item.address.city }}, {{ item.address.state }} {{ item.address.zip }}</p>
            </div>
            
            <div class="detail-section">
              <h4>Recent Activity</h4>
              <ul class="activity-list">
                <li v-for="activity in item.recentActivity" :key="activity.id">
                  <span class="activity-action">{{ activity.action }}</span>
                  <span class="activity-date">{{ formatDate(activity.date) }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </template>
      
      <!-- Loading state for expanded rows -->
      <template #row-expanded-loader="{ item, index }">
        <div class="loading-details">
          <div class="spinner"></div>
          <span>Loading details for {{ item.name }}...</span>
        </div>
      </template>
      
      <!-- Custom filter for department -->
      <template #DepartmentFilterSlot="{ filter, apply, clear }">
        <div class="custom-filter">
          <label>Department Filter</label>
          <select v-model="filter.value" class="filter-select">
            <option value="">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="HR">Human Resources</option>
            <option value="Finance">Finance</option>
          </select>
          <div class="filter-actions">
            <button class="btn-apply" @click="apply">Apply</button>
            <button class="btn-clear" @click="clear">Clear</button>
          </div>
        </div>
      </template>
    </VsDataTable>
    
    <!-- Bulk actions -->
    <div v-if="selectedEmployees.length" class="bulk-actions">
      <h3>Bulk Actions ({{ selectedEmployees.length }} selected)</h3>
      <button class="btn-bulk-edit" @click="bulkEdit">Edit Selected</button>
      <button class="btn-bulk-delete" @click="bulkDelete">Delete Selected</button>
      <button class="btn-bulk-export" @click="exportSelected">Export Selected</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { VsDataTable } from 'vs-datatable'

const tableRef = ref()
const loading = ref(false)
const totalEmployees = ref(0)
const selectedEmployees = ref([])
const expandedRows = ref<(string | number)[]>([])

const sortState = ref([
  { field: 'name', order: 'asc', priority: 1 }
])

const serverOptions = ref({
  page: 1,
  rowsPerPage: 10,
  sort: sortState.value
})

const columns = [
  { label: 'Avatar', field: 'avatar', width: '8%' },
  { 
    label: 'Name', 
    field: 'name', 
    sortable: true,
    filter: {
      type: 'text',
      operators: ['contains', 'equals', 'startsWith']
    }
  },
  { 
    label: 'Department', 
    field: 'department', 
    sortable: true,
    filter: {
      type: 'custom',
      custom: 'DepartmentFilterSlot'
    }
  },
  { 
    label: 'Position', 
    field: 'position', 
    sortable: true,
    filter: {
      type: 'text',
      operators: ['contains', 'equals']
    }
  },
  { 
    label: 'Status', 
    field: 'status', 
    sortable: true,
    filter: {
      type: 'multi-select',
      asyncOptions: async () => ['Active', 'Inactive', 'On Leave', 'Terminated']
    }
  },
  { 
    label: 'Salary', 
    field: 'salary', 
    sortable: true,
    filter: {
      type: 'number-range',
      operators: ['between', 'greaterThan', 'lessThan']
    }
  },
  { 
    label: 'Hire Date', 
    field: 'hireDate', 
    sortable: true,
    filter: {
      type: 'date-range',
      operators: ['between', 'before', 'after']
    }
  },
  { label: 'Actions', field: 'actions', width: '12%' }
]

const employees = ref([
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@company.com',
    phone: '+1-555-0123',
    birthDate: '1985-03-15',
    department: 'Engineering',
    position: 'Senior Developer',
    status: 'Active',
    salary: 95000,
    hireDate: '2020-01-15',
    avatar: '/avatars/john.jpg',
    address: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102'
    },
    recentActivity: []
  }
  // ... more employees
])

// Utility functions
const formatNumber = (value: number): string => {
  return new Intl.NumberFormat().format(value)
}

const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('en-US').format(new Date(date))
}

// Event handlers
const fetchEmployees = async (options) => {
  loading.value = true
  try {
    const response = await api.getEmployees({
      page: options.page,
      limit: options.rowsPerPage,
      sort: options.sort,
      filters: getActiveFilters()
    })
    employees.value = response.data
    totalEmployees.value = response.total
    serverOptions.value = options
  } finally {
    loading.value = false
  }
}

const handleSortChange = ({ sort }) => {
  console.log('Sort changed:', sort)
  sortState.value = sort
}

const loadEmployeeDetails = async ({ row, index, rowId }) => {
  tableRef.value.setRowLoading(rowId, true)
  
  try {
    const activity = await api.getEmployeeActivity(row.id)
    row.recentActivity = activity
  } finally {
    tableRef.value.setRowLoading(rowId, false)
  }
}

const clearEmployeeDetails = ({ row, index, rowId }) => {
  row.recentActivity = []
}

const handleFilterChange = (filters) => {
  console.log('Filters changed:', filters)
  // Reset to first page when filters change
  serverOptions.value.page = 1
  fetchEmployees(serverOptions.value)
}

const viewEmployee = (employee) => {
  console.log('Viewing employee:', employee)
}

const editEmployee = (employee) => {
  console.log('Editing employee:', employee)
}

const deleteEmployee = (employee) => {
  console.log('Deleting employee:', employee)
}

const bulkEdit = () => {
  console.log('Bulk editing:', selectedEmployees.value)
}

const bulkDelete = () => {
  console.log('Bulk deleting:', selectedEmployees.value)
}

const exportSelected = () => {
  console.log('Exporting:', selectedEmployees.value)
}

const getActiveFilters = () => {
  // Return current active filters for server request
  return {}
}

onMounted(() => {
  fetchEmployees(serverOptions.value)
})
</script>

<style scoped>
.advanced-datatable-demo {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.employee-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-active {
  background: #d4edda;
  color: #155724;
}

.status-inactive {
  background: #f8d7da;
  color: #721c24;
}

.status-on-leave {
  background: #fff3cd;
  color: #856404;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-edit, .btn-delete {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.btn-edit {
  background: #007bff;
  color: white;
}

.btn-delete {
  background: #dc3545;
  color: white;
}

.employee-details {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.detail-section h4 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 16px;
}

.activity-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.activity-list li {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  border-bottom: 1px solid #eee;
}

.activity-action {
  font-weight: 500;
}

.activity-date {
  color: #666;
  font-size: 12px;
}

.loading-details {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px;
  justify-content: center;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.custom-filter {
  padding: 16px;
  min-width: 200px;
}

.custom-filter label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.filter-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 12px;
}

.filter-actions {
  display: flex;
  gap: 8px;
}

.btn-apply, .btn-clear {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.btn-apply {
  background: #007bff;
  color: white;
}

.btn-clear {
  background: #6c757d;
  color: white;
}

.bulk-actions {
  margin-top: 20px;
  padding: 16px;
  background: #e9ecef;
  border-radius: 8px;
}

.bulk-actions h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
}

.btn-bulk-edit, .btn-bulk-delete, .btn-bulk-export {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;
}

.btn-bulk-edit {
  background: #28a745;
  color: white;
}

.btn-bulk-delete {
  background: #dc3545;
  color: white;
}

.btn-bulk-export {
  background: #17a2b8;
  color: white;
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

## Support

- 📧 Email: [oregunwasegun@gmail.com]
- 🐛 Issues: [GitHub Issues](https://github.com/oregs/vs-datatable/issues)
- 📖 Documentation: [GitHub Wiki](https://github.com/oregs/vs-datatable/wiki)