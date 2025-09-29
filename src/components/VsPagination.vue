<template>
  <div class="vs-pagination" :id="tablename + '-pagination'">
    <button
      @click="prevRecord"
      type="button"
      class="vs-pagination-button vs-pagination-nav"
      :disabled="currentPage === 1"
    >
      ‹‹
    </button>
    
    <button 
      v-if="startPage > 1" 
      type="button" 
      class="vs-pagination-button" 
      @click="navigateTable(1)"
    >
      1
    </button>
    
    <span v-if="startPage > 2" class="vs-pagination-ellipsis">...</span>
    
    <button
      v-for="page in visiblePages"
      :key="page"
      type="button"
      :class="[
        'vs-pagination-button',
        { 'vs-active': currentPage === page }
      ]"
      :id="tablename + '-page-' + page"
      @click="navigateTable(page)"
    >
      {{ page }}
    </button>
    
    <span v-if="endPage < totalPages - 1" class="vs-pagination-ellipsis">...</span>
    
    <button 
      v-if="endPage < totalPages" 
      type="button" 
      class="vs-pagination-button" 
      @click="navigateTable(totalPages)"
    >
      {{ totalPages }}
    </button>
    
    <button
      @click="nextRecord"
      type="button"
      class="vs-pagination-button vs-pagination-nav"
      :disabled="currentPage === totalPages"
    >
      ››
    </button>
  </div>
</template>
  
  <script setup lang="ts">
  import { computed, defineProps, defineEmits } from 'vue';
  import { calcTotalPages } from '@/utils/datatable'
  
  interface Props {
    modelValue: number;
    totalRecords: number;
    rowsPerPage: number;
    tablename: string;
    maxVisible?: number;
    paginationClass?: string | string[] | Record<string, any>;
  }
  
  const props = defineProps<Props>();
  const emit = defineEmits(['update:modelValue', 'page-changed']);
  
  const maxVisible = props.maxVisible ?? 3;
  
  const currentPage = computed({
    get: () => props.modelValue,
    set: (value: number) => {
        emit('update:modelValue', value)
        emit('page-changed', value);
    }
  });
  
  const startPage = computed(() => {
    if (currentPage.value <= Math.floor(maxVisible / 2)) return 1;
    if (currentPage.value >= totalPages.value - Math.floor(maxVisible / 2))
      return Math.max(totalPages.value - maxVisible + 1, 1);
    return currentPage.value - Math.floor(maxVisible / 2);
  });
  
  const endPage = computed(() => Math.min(startPage.value + maxVisible - 1, totalPages.value));

  const totalPages = computed(() => calcTotalPages(props.totalRecords, props.rowsPerPage))
  
  const visiblePages = computed(() => {
    const pages = [];
    for (let i = startPage.value; i <= endPage.value; i++) {
      pages.push(i);
    }
    return pages;
  });
  
  const navigateTable = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };
  
  const prevRecord = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };
  
  const nextRecord = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };
</script>
  
<style scoped>
  .vs-pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--vs-spacing-sm);
    flex-wrap: wrap;
  }
  
  .vs-pagination-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;
    padding: 0 var(--vs-spacing-sm);
    border: 1px solid var(--vs-table-border);
    background-color: var(--vs-table-bg);
    color: var(--vs-dark);
    text-decoration: none;
    border-radius: var(--vs-border-radius);
    font-size: var(--vs-font-size-sm);
    transition: var(--vs-transition-fast);
    cursor: pointer;
  }
  
  .vs-pagination-button:hover:not(:disabled) {
    background-color: var(--vs-table-hover-bg);
    border-color: var(--vs-primary);
  }
  
  .vs-pagination-button.vs-active {
    background-color: var(--vs-primary);
    border-color: var(--vs-primary);
    color: white;
  }
  
  .vs-pagination-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .vs-pagination-nav {
    font-weight: var(--vs-font-weight-bold);
  }
  
  .vs-pagination-ellipsis {
    color: var(--vs-secondary);
    padding: 0 var(--vs-spacing-sm);
    font-size: var(--vs-font-size-sm);
  }
  
  @media (max-width: 768px) {
    .vs-pagination-button {
      min-width: 28px;
      height: 28px;
      font-size: 12px;
    }
  }
</style>
  