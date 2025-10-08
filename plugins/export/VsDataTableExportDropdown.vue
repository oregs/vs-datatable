<template>
  <div class="export-dropdown">
    <button class="export-btn" ref="toggleBtn" @click.stop="toggleMenu">
      Export ▾
    </button>
    <ul class="export-menu" ref="menu" :class="{ active: isOpen }">
      <li><button @click="exportToCSV()">Export CSV</button></li>
      <li><button @click="exportToExcel()">Export Excel</button></li>
      <li><button>Export PDF</button></li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import type { Column, Row } from '@/types'
import { useDataTableExport } from './useDataTableExport';

const props = defineProps<{
  rows: Row[]
  columns: Column[]
}>()

const isOpen = ref(false)
const menu = ref<HTMLElement | null>(null)

function toggleMenu() {
  isOpen.value = !isOpen.value
}

function closeMenu() {
  isOpen.value = false
}

const { exportToCSV, exportToExcel } = useDataTableExport(ref(props.rows), props.columns)

onMounted(() => {
  document.addEventListener('click', closeMenu)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeMenu)
})
</script>

<style scoped>

</style>
