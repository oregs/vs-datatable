# VsDataTable Refactoring Guide

## 🏗️ **Best Way to Organize VsDataTable.vue Script**

This guide shows the optimal way to organize the large VsDataTable.vue component into separate, maintainable files.

## 📁 **Proposed File Structure**

```
src/
├── components/
│   ├── VsDataTable.vue (main component - 200 lines vs 640 lines)
│   └── VsDataTableRefactored.vue (example refactored version)
├── types/
│   └── datatable.ts (all interfaces & types)
├── composables/
│   ├── useDataTableSort.ts (sorting logic)
│   ├── useDataTablePagination.ts (pagination logic)
│   ├── useDataTableSelection.ts (selection logic)
│   └── useDataTableSearch.ts (search logic)
└── utils/
    └── datatable.ts (utility functions)
```

## 🎯 **Benefits of This Organization**

### ✅ **Separation of Concerns**
- **Types**: All interfaces in one place
- **Composables**: Reusable logic for specific features
- **Utils**: Pure functions for data manipulation
- **Component**: Only template and composition logic

### ✅ **Maintainability**
- **Smaller files**: Easier to read and understand
- **Single responsibility**: Each file has one purpose
- **Testability**: Each composable can be tested independently
- **Reusability**: Composables can be used in other components

### ✅ **Developer Experience**
- **Better IntelliSense**: Clear type definitions
- **Easier debugging**: Isolated functionality
- **Code splitting**: Only load what you need
- **Team collaboration**: Multiple developers can work on different files

## 📋 **File Breakdown**

### 1. **Types (`src/types/datatable.ts`)**
```typescript
// All interfaces and types in one place
export interface Column { ... }
export interface Sort { ... }
export interface ServerOptions { ... }
export interface DataTableProps { ... }
export interface DataTableEmits { ... }
```

### 2. **Utils (`src/utils/datatable.ts`)**
```typescript
// Pure utility functions
export function getValue(obj: any, path: string): any
export function getRowKey(item: any, index: number, rowKey: any): string | number
export function sortArray(array: any[], sortCriteria: Sort[]): any[]
export function calculateRecordRange(page: number, rowsPerPage: number, totalRecords: number)
```

### 3. **Composables**

#### **Sorting (`src/composables/useDataTableSort.ts`)**
```typescript
export function useDataTableSort(props, emit) {
  // All sorting logic
  return { sortedRows, sortHelpers }
}
```

#### **Pagination (`src/composables/useDataTablePagination.ts`)**
```typescript
export function useDataTablePagination(props, emit) {
  // All pagination logic
  return { page, rowsPerPage, totalRecords, recordRange, handlePageChange }
}
```

#### **Selection (`src/composables/useDataTableSelection.ts`)**
```typescript
export function useDataTableSelection(props, emit) {
  // All selection logic
  return { selectedItems, isAllChecked, toggleAll, ... }
}
```

#### **Search (`src/composables/useDataTableSearch.ts`)**
```typescript
export function useDataTableSearch(emit) {
  // All search logic
  return { searchQuery, onInputTyped, clearSearch }
}
```

### 4. **Main Component (`src/components/VsDataTable.vue`)**
```vue
<script setup lang="ts">
// Import composables
import { useDataTableSort } from '@/composables/useDataTableSort'
import { useDataTablePagination } from '@/composables/useDataTablePagination'
import { useDataTableSelection } from '@/composables/useDataTableSelection'
import { useDataTableSearch } from '@/composables/useDataTableSearch'

// Use composables
const { sortedRows, sortHelpers } = useDataTableSort(props, emit)
const { page, rowsPerPage, totalRecords, recordRange, handlePageChange } = useDataTablePagination(props, emit)
const { selectedItems, isItemSelectedControlled, isAllChecked, toggleAll } = useDataTableSelection(props, emit)
const { searchQuery, onInputTyped } = useDataTableSearch(emit)
</script>
```

## 🔄 **Migration Steps**

### **Step 1: Create Type Definitions**
```bash
# Create types file
touch src/types/datatable.ts
```

### **Step 2: Extract Utility Functions**
```bash
# Create utils file
touch src/utils/datatable.ts
```

### **Step 3: Create Composables**
```bash
# Create composables directory
mkdir src/composables
touch src/composables/useDataTableSort.ts
touch src/composables/useDataTablePagination.ts
touch src/composables/useDataTableSelection.ts
touch src/composables/useDataTableSearch.ts
```

### **Step 4: Refactor Main Component**
- Import composables
- Remove inline logic
- Use composable returns
- Keep only template and composition logic

## 📊 **Before vs After**

### **Before (Current)**
- **File size**: 640 lines
- **Complexity**: High (all logic in one file)
- **Maintainability**: Difficult
- **Testability**: Hard to test individual features
- **Reusability**: Limited

### **After (Refactored)**
- **Main component**: ~200 lines
- **Composables**: 50-100 lines each
- **Types**: ~100 lines
- **Utils**: ~150 lines
- **Total**: Same functionality, better organization

## 🧪 **Testing Benefits**

### **Individual Composable Testing**
```typescript
// Test sorting composable
import { useDataTableSort } from '@/composables/useDataTableSort'

test('should sort data correctly', () => {
  const { sortedRows, sortHelpers } = useDataTableSort(mockProps, mockEmit)
  // Test sorting logic in isolation
})
```

### **Utility Function Testing**
```typescript
// Test utility functions
import { getValue, sortArray } from '@/utils/datatable'

test('getValue should return nested values', () => {
  expect(getValue({ user: { name: 'John' } }, 'user.name')).toBe('John')
})
```

## 🚀 **Performance Benefits**

### **Tree Shaking**
- Only import what you need
- Smaller bundle size
- Better code splitting

### **Lazy Loading**
```typescript
// Load composables only when needed
const { useDataTableSort } = await import('@/composables/useDataTableSort')
```

## 🔧 **Implementation Example**

### **Using the Refactored Component**
```vue
<template>
  <VsDataTable
    :columns="columns"
    :rows="data"
    v-model:sort="sortState"
    v-model:item-selected="selectedItems"
    @sort-changed="handleSort"
    @row-click="handleRowClick"
  />
</template>

<script setup lang="ts">
import { VsDataTable } from 'vs-datatable'
import type { Sort } from 'vs-datatable/types'

const sortState = ref<Sort[]>([])
const selectedItems = ref([])

const handleSort = ({ sort }) => {
  console.log('Sort changed:', sort)
}
</script>
```

## 📝 **Best Practices**

### **1. Keep Composables Focused**
- One composable = one feature
- Don't mix concerns
- Return only what's needed

### **2. Use TypeScript Strictly**
- Define all interfaces
- Use proper typing
- Export types for external use

### **3. Document Your Composables**
```typescript
/**
 * DataTable Sorting Composable
 * @param props - Component props
 * @param emit - Component emit function
 * @returns Sorting state and helpers
 */
export function useDataTableSort(props, emit) {
  // Implementation
}
```

### **4. Test Each Layer**
- Unit test utilities
- Test composables in isolation
- Integration test the component

## 🎉 **Conclusion**

This refactoring approach provides:

- **Better maintainability** through separation of concerns
- **Improved testability** with isolated functionality
- **Enhanced reusability** with composable functions
- **Better developer experience** with clear file organization
- **Performance benefits** through tree shaking and code splitting

The refactored structure makes the codebase more professional, maintainable, and scalable while preserving all existing functionality.
