<template>
    <tfoot v-if="visibleColumns.length">
      <tr class="vs-footer-row">
        <!-- 🔹 Auto-detect expand / checkbox columns -->
        <td v-if="expandable" class="vs-footer-cell vs-expand-column"></td>
        <td v-if="isItemSelectedControlled" class="vs-footer-cell vs-checkbox-column"></td>
  
        <!-- 🔹 Render grouped and leaf columns -->
        <template v-for="(col, index) in visibleColumns" :key="index">
          <!-- Parent group columns (no field, have children) -->
          <td
            v-if="col.children && col.children.length"
            class="vs-footer-cell vs-footer-group"
            :colspan="countLeafColumns(col)"
          ></td>
  
          <!-- Leaf columns -->
          <td
            v-else
            class="vs-footer-cell"
            :class="col.footerClass || ''"
            :style="col.footerStyle || {}"
          >
            <slot
              v-if="col.field"
              :name="`footer-${col.field}`"
              :column="col"
              :value="footerValues[col.field]"
              :rows="rows"
            >
              {{ formatFooterValue(col, footerValues[col.field]) }}
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
   * 🔹 Utility: count leaf columns under a group
   */
  function countLeafColumns(col: Column): number {
    if (!col.children || !col.children.length) return 1
    return col.children.reduce((sum, child) => sum + countLeafColumns(child), 0)
  }
  
  /**
   * 🔹 Recursive flatten
   */
  function flattenColumns(cols: Column[]): Column[] {
    const result: Column[] = []
    for (const col of cols) {
      if (col.children && col.children.length) {
        result.push(...flattenColumns(col.children))
      } else {
        result.push(col)
      }
    }
    return result
  }
  
  /**
   * 🔹 Compute only visible columns (keep parent structure)
   */
  function filterVisibleColumns(cols: Column[]): Column[] {
    return cols
      .filter((c) => !c.hidden)
      .map((c) => ({
        ...c,
        children: c.children ? filterVisibleColumns(c.children) : undefined,
      }))
  }
  
  const visibleColumns = computed(() => filterVisibleColumns(props.columns))
  const flatColumns = computed(() => flattenColumns(visibleColumns.value))

  
  /**
   * 🔹 Compute footer values
   */
  const footerValues = computed(() => {
    const result: Record<string, any> = {}
  
    for (const col of flatColumns.value) {
      if (!col.field) continue
      let value: any = null
  
      if (typeof col.footerValue === 'function') {
        try {
          value = col.footerValue(props.rows)
        } catch (err) {
          console.warn(`Error computing footerValue for column "${col.field}"`, err)
        }
      } else if (col.footerValue !== undefined) {
        value = col.footerValue
      }
  
      result[col.field] = value
    }
  
    return result
  })
  
  /**
   * 🔹 Apply formatter (optional)
   */
  function formatFooterValue(col: Column, value: any) {
    if (col.footerFormatter) {
      try {
        return col.footerFormatter(value, col)
      } catch (err) {
        console.warn(`Error in footerFormatter for column "${col.field}"`, err)
        return value
      }
    }
  
    if (typeof value === 'number') return value.toLocaleString()
    return value ?? ''
  }
  </script>
  
  <style scoped>
  .vs-footer-row {
    background: var(--vs-footer-bg, #fafafa);
    font-weight: 600;
    border-top: 1px solid var(--vs-border-color, #ddd);
  }
  .vs-footer-cell {
    padding: 0.75rem;
    text-align: right;
    color: var(--vs-footer-text, #333);
    white-space: nowrap;
  }
  .vs-footer-group {
    background: var(--vs-footer-bg, #fafafa);
  }
  .vs-expand-column,
  .vs-checkbox-column {
    text-align: center;
    width: 40px;
  }
  </style>
  