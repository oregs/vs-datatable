<template>
    <div class="p-4">
      <!-- Header -->
      <VsDFlex justify="between" align="center" gap="4" class="mb-6">
        <h1 class="text-xl font-bold">Dashboard</h1>
        <button class="px-4 py-2 bg-blue-600 text-white rounded">New Item</button>
      </VsDFlex>
  
      <!-- Two-column layout -->
      <VsRow gap="6" :responsive="{ sm: { direction: 'column', gap: 4 } }">
        <!-- Left Column -->
        <VsColumn span="8" :responsive="{ sm: { span: 12 } }">
          <VsRow gap="4">
            <VsColumn span="6" :responsive="{ sm: { span: 12 } }">
              <div class="p-4 bg-gray-100 rounded">Card 1</div>
            </VsColumn>
            <VsColumn span="6" :responsive="{ sm: { span: 12 } }">
              <div class="p-4 bg-gray-100 rounded">Card 2</div>
            </VsColumn>
          </VsRow>
  
          <!-- <div class="mt-4 p-4 bg-gray-200 rounded">
            <h2 class="font-semibold mb-2">Main Content</h2>
            <p>This area can hold tables, charts, or forms.</p>
          </div> -->
        </VsColumn>
  
        <!-- Right Column -->
        <VsColumn span="4" :responsive="{ sm: { span: 12 } }">
          <div class="bg-gray-100 rounded mb-4">
            <h2 class="font-semibold mb-2">Notifications</h2>
            <ul class="list-disc ml-4">
              <li>Notification 1</li>
              <li>Notification 2</li>
              <li>Notification 3</li>
            </ul>
          </div>
          <div class="p-4 bg-gray-100 rounded">
            <h2 class="font-semibold mb-2">Tasks</h2>
            <ul class="list-disc ml-4">
              <li>Task 1</li>
              <li>Task 2</li>
              <li>Task 3</li>
            </ul>
          </div>
        </VsColumn>
      </VsRow>
  
      <!-- Footer -->
      <VsDFlex justify="center" align="center" class="mt-6 p-4 bg-gray-300 rounded">
        <span>© 2025 My Dashboard. All rights reserved.</span>
      </VsDFlex>
    </div>
  </template>
  
  <script setup lang="ts">
  import VsRow from '@/components/layout/VsRow.vue'
  import VsColumn from '@/components/layout/VsColumn.vue'
  import VsDFlex from '@/components/layout/VsDFlex.vue'
  import '@/styles/vs-layout.css'
  </script>
  
  <style scoped>
  /* Optional minimal styling */
  body {
    font-family: system-ui, sans-serif;
  }
  </style>
  