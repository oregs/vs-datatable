<template>
    <div class="vs-rows-per-page">
      <span class="vs-rows-label">Items Per Page</span>
      <select
        class="vs-items-dropdown"
        :value="modelValue"
        @change="onChange"
      >
        <option v-for="option in options" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits } from 'vue'
  
  const props = defineProps<{
    modelValue: number
    options?: number[]
  }>()
  
  const emit = defineEmits<{
    (e: 'update:modelValue', value: number): void
    (e: 'rowsPerPageChanged', value: number): void
  }>()
  
  // Default options if not passed in
  const options = props.options ?? [10, 25, 50, 100]
  
  const onChange = (event: Event) => {
    const value = Number((event.target as HTMLSelectElement).value)
    emit('update:modelValue', value)
    emit('rowsPerPageChanged', value)
  }
  </script>
  
  <style scoped>
  .vs-rows-per-page {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
  }
  
  .vs-rows-label {
    white-space: nowrap;
  }
  </style>
  