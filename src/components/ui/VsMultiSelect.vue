<template>
  <div class="vs-multiselect">
    <!-- Select/Deselect All with counts -->
    <div class="vs-multiselect-actions">
      <button @click.stop="selectAll">Select All ({{ unselectedCount }})</button>
      <button @click.stop="deselectAll">Deselect All ({{ selectedCount }})</button>
    </div>

    <!-- Search -->
    <VsDFlex direction="row">
      <input
        type="text"
        v-model="search"
        placeholder="Search..."
        class="vs-multiselect-search vs-w-full"
      />
    </VsDFlex>

    <template v-if="isLoading">
      <div class="vs-py-4 vs-text-center vs-text-primary">Loading options...</div>
    </template>

    <!-- Options -->
    <template v-else>
      <ul class="vs-multiselect-options">
        <li
          v-for="option in filteredOptions"
          :key="option"
          @click.stop="toggleOption(option)"
          :class="{ selected: selectedValues.includes(option) }"
        >
          <span class="option-label">{{ option }}</span>
  
          <!-- Check icon at end when selected -->
          <svg
            v-if="selectedValues.includes(option)"
            xmlns="http://www.w3.org/2000/svg"
            class="check-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </li>
      </ul>
    </template>
  </div>
</template>
  
<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import VsDFlex from '../layout/VsDFlex.vue'
  
  // Define props directly
  const props = defineProps<{
    columnData: any[]
    modelValue?: any[]
    isLoading: boolean
  }>()
  
  const emit = defineEmits<{
    (e: 'update:modelValue', value: any[]): void
  }>()
  
  const search = ref('')
  const selectedValues = ref([...(props.modelValue ?? [])])
  
  // Unique options
  const options = computed(() => {
    const unique = new Set(props.columnData.filter(Boolean))
    return Array.from(unique)
  })
  
  // Filtered list
  const filteredOptions = computed(() => {
    const q = search.value.toLowerCase()
    return options.value.filter(opt => opt.toString().toLowerCase().includes(q))
  })
  
  // Counts
  const selectedCount = computed(() => selectedValues.value.length)
  const unselectedCount = computed(() => options.value.length - selectedValues.value.length)
  
  // Toggle item
  const toggleOption = (option: any) => {
    const idx = selectedValues.value.indexOf(option)
    if (idx > -1) selectedValues.value.splice(idx, 1)
    else selectedValues.value.push(option)
    emit('update:modelValue', [...selectedValues.value])
  }
  
  // Bulk actions
  const selectAll = () => {
    selectedValues.value = [...options.value]
    emit('update:modelValue', [...selectedValues.value])
  }
  
  const deselectAll = () => {
    selectedValues.value = []
    emit('update:modelValue', [])
  }
  
  // Sync prop changes
  watch(
    () => props.modelValue,
    val => {
      selectedValues.value = [...(val || [])]
    }
  )
  </script>
  
  <style scoped>

  </style>
  