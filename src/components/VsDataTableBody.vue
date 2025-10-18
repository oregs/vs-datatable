<template>
  <tbody ref="bodyRef">
    <!-- Loading State -->
    <tr v-if="loading">
      <td :colspan="totalColumns" class="vs-loading">
        <div class="vs-spinner"></div>
        <span>{{ loadingText }}</span>
      </td>
    </tr>

    <!-- No Data -->
    <tr v-else-if="!paginatedRows.length">
      <td :colspan="totalColumns" class="vs-no-data">
        <slot name="no-data">
          <div class="vs-no-data-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
              />
            </svg>
          </div>
          <div class="vs-no-data-message">{{ noDataText }}</div>
          <div class="vs-no-data-description">{{ noDataDescription }}</div>
        </slot>
      </td>
    </tr>

    <!-- Table Rows -->
    <template v-else v-for="(item, index) in paginatedRows" :key="getRowKey(item, index)">
      <tr
        :class="[
          rowClass,
          { 'vs-row-clickable': hasRowClick },
          { 'vs-row-selected': isRowSelected(item, selectedItems, safeRowKey) },
        ]"
        @click="$emit('row-click', item, index)"
      >
        <!-- Expand toggle cell -->
        <td v-if="expandable" class="vs-expand-column" @click.stop>
          <button
            class="vs-expand-btn"
            type="button"
            :aria-expanded="isRowExpanded(item, index)"
            :aria-controls="`row-details-${getRowKey(item, index)}`"
            @click.stop="toggleRowExpansion(item, index)"
          >
            <span v-if="isRowExpanded(item, index)">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="var(--vs-gray-800)"
              >
                <path d="M480-345 240-585l56-56 184 183 184-183 56 56-240 240Z" />
              </svg>
            </span>
            <span v-else>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="var(--vs-gray-800)"
              >
                <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
              </svg>
            </span>
          </button>
        </td>

        <!-- Checkbox -->
        <td v-if="isItemSelectedControlled" @click.stop class="vs-checkbox-column">
          <div class="vs-checkbox">
            <input
              type="checkbox"
              :id="tablename + '-checkbox-' + getRowKey(item, index)"
              :value="item"
              :checked="selectedItems.some((r, i) => getRowKey(r, i) === getRowKey(item, index))"
              @change="toggleRow(item, index)"
            />
            <label :for="tablename + '-checkbox-' + getRowKey(item, index)"></label>
          </div>
        </td>

        <!-- Data Cells -->
        <!-- ✅ CHANGED: now uses flatColumns -->
         <template  v-for="column in flatColumns">
           <td 
             v-if="column && column.field"
            :key="column.field"
             :class="cellClass"
             :data-field="column.field"
           >
             <slot
               :name="`cell-${column.field}`"
               :item="item"
               :value="getValue(item, column.field)"
               :column="column"
               :index="index"
               :class="[
                 column.sticky ? `vs-sticky-${column.sticky}` : '',
               ]"
             >
               {{ getValue(item, column.field) }}
             </slot>
           </td>
         </template>
      </tr>

      <!-- Expanded content -->
      <template v-if="expandable">
        <tr v-if="isRowExpanded(item, index)" class="vs-row-expanded">
          <td :colspan="totalColumns" class="vs-expanded-cell">
            <!-- Loader (sticks to top) -->
            <slot
              v-if="isRowLoading(item, index)"
              name="row-expanded-loader"
              :item="item"
              :index="index"
            >
              <div class="vs-loader-bar">
                <div class="vs-loader-bar-inner"></div>
              </div>
            </slot>

            <!-- Expanded Content -->
            <div v-else class="vs-expanded-content">
              <slot name="row-expanded" :item="item" :index="index">
                Expanded details for row <b>{{ getRowKey(item, index) }}</b>
              </slot>
            </div>
          </td>
        </tr>
      </template>
    </template>
  </tbody>
</template>

<script setup lang="ts">
import type { Column } from '@/types'
import { defineProps, defineEmits, computed, ref } from 'vue'

const props = defineProps<{
  loading: boolean
  loadingText: string
  noDataText: string
  noDataDescription: string
  paginatedRows: Record<string, unknown>[]
  totalColumns: number
  expandable?: boolean
  isItemSelectedControlled: boolean
  selectedItems: Record<string, unknown>[]
  tablename: string
  columns: (Column | { title: string; children: Column[] })[] // ✅ CHANGED: support groups
  rowKey?: string | ((item: unknown, index: number) => string | number)
  rowClass?: string | string[] | Record<string, unknown>
  cellClass?: string | string[] | Record<string, unknown>
  hasRowClick: boolean
  getRowKey: (item: unknown, index: number) => string | number
  getValue: (item: unknown, field: string) => unknown
  isRowExpanded: (item: unknown, index: number) => boolean
  isRowLoading: (item: unknown, index: number) => boolean
  toggleRowExpansion: (item: unknown, index: number) => void
  toggleRow: (item: unknown, index: number) => void
  isRowSelected: (
    item: unknown,
    selected: unknown[],
    key: string | ((item: unknown, index: number) => string | number)
  ) => boolean,
}>()

const emit = defineEmits<{
  (e: 'row-click', item: unknown, index: number): void
}>()

const safeRowKey = computed(() => props.rowKey ?? 'id')

const bodyRef = ref<HTMLElement | null>(null)

/**
 * ✅ CHANGED: Flatten grouped columns
 * This ensures tbody aligns perfectly with grouped thead
 */
const flatColumns = computed(() => {
  return props.columns.flatMap(col =>
    'children' in col ? col.children : [col]
  )
})
</script>

<style scoped>
.vs-checkbox-column {
  width: 50px;
  text-align: center;
}

.vs-row-clickable {
  cursor: pointer;
}

.vs-row-selected {
  background-color: rgba(var(--vs-primary), 0.1);
}
</style>
