<template>
    <div class="flex-fill position-relative">
      <div class="input-group">
        <div
          class="input-group-text position-absolute top-0 bottom-0 bg-none border-0"
          style="z-index: 1020;"
        >
          <i class="fa fa-search opacity-5"></i>
        </div>
        <input
          type="text"
          class="form-control ps-35px"
          :placeholder="placeholder"
          :value="modelValue"
          @input="onInput"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps<{
    modelValue: string;
    placeholder?: string;
  }>();
  
  const emit = defineEmits(['update:modelValue', 'input-typed']);
  
  const onInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    emit('update:modelValue', input.value);
    emit('input-typed', input.value);
  };
  </script>
  