<template>
  <tfoot v-if="footerCells.length">
    <tr class="vs-footer-row">
      <!-- Auto-detect expand / checkbox columns -->
      <td v-if="expandable" class="vs-footer-cell vs-expand-column"></td>
      <td v-if="isItemSelectedControlled" class="vs-footer-cell vs-checkbox-column"></td>

      <!-- Render ONLY leaf columns in footer -->
      <template v-for="(cell, index) in footerCells" :key="index">
        <td
          :data-field="cell.field"
          class="vs-footer-cell"
          :class="cell.footerClass || ''"
          :style="cell.footerStyle || {}"
        >
          <slot
            v-if="cell.hasFooter"
            :name="`footer-${cell.field}`"
            :column="cell"
            :value="cell.footerValue"
            :rows="rows"
          >
            {{ cell.formattedValue }}
          </slot>
        </td>
      </template>
    </tr>
  </tfoot>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Column, Row } from '@/types'

const props = defineProps<{
  columns: Column[]
  rows: Row[]
  expandable?: boolean
  isItemSelectedControlled?: boolean
}>()

/**
 * 🔹 Get all leaf columns in correct order (ignores group headers)
 */
const footerCells = computed(() => {
  const leafColumns: Column[] = []
  
  function collectLeafColumns(columns: Column[]) {
    for (const col of columns) {
      if (col.hidden) continue
      
      if (col.children && col.children.length) {
        // This is a group column - process its children but don't add it to footer
        collectLeafColumns(col.children)
      } else {
        // This is a leaf column - add to footer
        leafColumns.push(col)
      }
    }
  }
  
  collectLeafColumns(props.columns)
  
  // Calculate footer values for each leaf column
  return leafColumns.map(col => {
    const hasFooter = col.footerValue !== undefined
    let footerValue: any = null
    
    if (typeof col.footerValue === 'function') {
      try {
        footerValue = col.footerValue(props.rows)
      } catch (err) {
        console.warn(`Error computing footerValue for column "${col.field}"`, err)
      }
    } else if (col.footerValue !== undefined) {
      footerValue = col.footerValue
    }
    
    return {
      ...col,
      hasFooter,
      footerValue,
      formattedValue: formatValue(col, footerValue)
    }
  })
})

/**
 * 🔹 Format a value using column formatter
 */
function formatValue(col: Column, value: any): string {
  if (value == null) return ''
  
  if (col.footerFormatter) {
    try {
      return col.footerFormatter(value, col)
    } catch (err) {
      console.warn(`Error in footerFormatter for column "${col.field}"`, err)
      return String(value)
    }
  }
  
  if (typeof value === 'number') {
    // Special handling for currency
    if (col.field === 'price') {
      return `$${value.toFixed(2)}`
    }
    if (col.field === 'tax') {
      return value.toFixed(2)
    }
    return value.toLocaleString()
  }
  
  return String(value)
}
</script>

<style scoped>
.vs-footer-row {
  background: var(--vs-table-footer-bg, #fafafa);
  font-weight: 600;
  border-top: 1px solid var(--vs-border-color, #ddd);
}
.vs-footer-cell {
  padding: 0.75rem;
  color: var(--vs-table-footer-text, #333);
  white-space: nowrap;
  background: var(--vs-table-footer-bg, #fff);
}
</style>