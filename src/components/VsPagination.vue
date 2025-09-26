<template>
    <div ref="vsPagination">
      <ul class="pagination pagination-sm mb-0 justify-content-center text-center" :id="tablename + '-paginate-parent'">
        <li class="page-item">
          <button
            @click="prevRecord"
            type="button"
            :class="[tablename + '-paginate-navigators page-link', { disabled: currentPage === 1 }]"
            :disabled="currentPage === 1"
          >
            &lt;&lt;
          </button>
        </li>
        <li v-if="startPage > 1" class="page-item d-flex">
          <button type="button" class="page-link me-2" @click="navigateTable(1)">1</button>
          <span v-if="startPage > 2" class="page-link disabled">...</span>
        </li>
        <li v-for="page in visiblePages" :key="page" class="page-item">
          <button
            type="button"
            :class="[currentPage === page ? 'active' : '', 'page-link', tablename + '-paginate-button']"
            :id="tablename + '-navigateButton-' + page"
            @click="navigateTable(page)"
          >
            {{ page }}
          </button>
        </li>
        <li v-if="endPage < totalPages" class="page-item d-flex">
          <span v-if="endPage < totalPages - 1" class="page-link me-2 disabled">...</span>
          <button type="button" class="page-link" @click="navigateTable(totalPages)">{{ totalPages }}</button>
        </li>
        <li class="page-item">
          <button
            @click="nextRecord"
            type="button"
            :class="[tablename + '-paginate-navigators page-link', { disabled: currentPage === totalPages }]"
            :disabled="currentPage === totalPages"
          >
            &gt;&gt;
          </button>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, defineProps, defineEmits } from 'vue';
  
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

  const totalPages = computed(() => Math.ceil(props.totalRecords / props.rowsPerPage))
  
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
 @media only screen and (min-width: 1199px) {
  .pagination .page-item .page-link {
    padding: 4px 8px !important;  /* smaller height & width */
    font-size: 12px !important;   /* smaller text */
    line-height: 1 !important;    /* keeps button compact */
  }
}

@media only screen and (max-width: 768px) {
  .pagination .page-item .page-link {
    padding: 4px 8px !important;  /* very compact for small screens */
    font-size: 10px !important;
    line-height: 1 !important;
  }
}
</style>
  