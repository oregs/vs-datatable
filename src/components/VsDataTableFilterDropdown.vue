<template>
  <!-- Filter trigger -->
  <span
    ref="referenceRef"
    class="vs-column-filter"
    @click.stop="toggleDropdown"
    :class="{ 'is-active': hasValue(localFilter) }"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="#e3e3e3"
    >
      <path
        d="M440-160q-17 0-28.5-11.5T400-200v-240L168-736q-15-20-4.5-42t36.5-22h560q26 0 36.5 22t-4.5 42L560-440v240q0 17-11.5 28.5T520-160h-80Zm40-308 198-252H282l198 252Zm0 0Z"
      />
    </svg>
  </span>

  <!-- Floating dropdown -->
  <div
    v-if="isOpen"
    ref="floatingRef"
    class="vs-filter-dropdown"
    style="position: absolute; z-index: 1000"
    @click.stop
  >
    <!-- Text filter -->
    <div v-if="localFilter.type === 'text'" class="vs-filter-text">
      <div class="vs-pb-sm">
        <select v-model="localFilter.operator" class="vs-operator-select vs-mx-auto vs-w-full">
          <option value="contains">Contains</option>
          <option value="equals">Equals</option>
          <option value="startsWith">Starts With</option>
          <option value="endsWith">Ends With</option>
        </select>
      </div>
      <div>
        <input
          type="text"
          v-model="localFilter.value"
          placeholder="Search..."
          class="vs-input mx-auto vs-w-full"
        />
      </div>
    </div>

    <!-- Multi-select filter -->
    <div v-else-if="localFilter.type === 'multi-select'" class="vs-filter-multi">
      <div v-for="opt in options" :key="opt">
        <input type="checkbox" :value="opt" v-model="localFilter.value" />
        <label>{{ opt }}</label>
      </div>
    </div>

    <!-- Number range filter -->
    <div v-else-if="localFilter.type === 'number-range'" class="vs-filter-range">
      <div>
        <input type="number" v-model.number="localFilter.min" placeholder="Min" class="vs-input vs-w-full" />
      </div>
      <div class="vs-text-center">-----------to-----------</div>
      <div>
        <input type="number" v-model.number="localFilter.max" placeholder="Max" class="vs-input vs-w-full" />
      </div>
    </div>

    <!-- Date range filter -->
    <div v-else-if="localFilter.type === 'date-range'" class="vs-filter-date">
      <input type="date" v-model="localFilter.start" class="vs-input" />
      <span>to</span>
      <input type="date" v-model="localFilter.end" class="vs-input" />
    </div>

    <!-- Footer actions -->
    <div class="vs-filter-actions">
      <button class="vs-btn vs-btn-primary" @click="applyFilter">Apply</button>
      <button class="vs-btn vs-btn-secondary" @click="clearFilter">Clear</button>
    </div>

    <!-- Custom slot -->
    <slot name="custom" :filter="localFilter" :apply="applyFilter" :clear="clearFilter" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { computePosition, autoUpdate, flip, offset, shift } from '@floating-ui/dom'
import { initFilter, hasValue } from '@/utils/filters'
import type { ColumnFilter } from '@/types/datatable'

interface Props {
  modelValue?: ColumnFilter
  type: ColumnFilter['type']
  options?: string[]
  visible?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', val: ColumnFilter): void
  (e: 'apply', val: ColumnFilter): void
  (e: 'clear'): void
  (e: 'open'): void
  (e: 'close'): void
}>()

// refs for floating-ui
const referenceRef = ref<HTMLElement | null>(null)
const floatingRef = ref<HTMLElement | null>(null)
const cleanup = ref<() => void>()

const isOpen = ref(false)

watch(
  () => props.visible,
  (val) => {
    isOpen.value = !!val
    if (isOpen.value) startPositioning()
    else stopPositioning()
  },
  { immediate: true }
)

// Local filter state
const localFilter = ref<ColumnFilter>(initFilter(props.type, props.modelValue))

watch(
  () => props.modelValue,
  (newVal) => {
    localFilter.value = initFilter(props.type, newVal)
  },
  { immediate: true }
)

function toggleDropdown() {
  emit('open')
}

// Apply / Clear actions
function applyFilter() {
  emit('update:modelValue', { ...localFilter.value })
  emit('apply', { ...localFilter.value })
  // closeDropdown()
}

function clearFilter() {
  localFilter.value = initFilter(props.type)
  emit('update:modelValue', { ...localFilter.value })
  emit('clear')
  closeDropdown()
}

function closeDropdown() {
  emit('close')
}

// Floating-ui positioning
function startPositioning() {
  if (!referenceRef.value || !floatingRef.value) return
  cleanup.value = autoUpdate(referenceRef.value, floatingRef.value, () => {
    computePosition(referenceRef.value!, floatingRef.value!, {
      placement: 'bottom-start',
      middleware: [offset(6), flip(), shift({ padding: 8 })],
    }).then(({ x, y }) => {
      Object.assign(floatingRef.value!.style, { left: `${x}px`, top: `${y}px` })
    })
  })
}

function stopPositioning() {
  cleanup.value?.()
  cleanup.value = undefined
}

// Watch open state
watch(isOpen, async (open) => {
  if (open) {
    await nextTick()
    startPositioning()
  } else {
    stopPositioning()
    emit('close')
  }
})

// Click outside & Escape
function onClickOutside(e: MouseEvent) {
  const target = e.target as Node
  if (
    isOpen.value &&
    referenceRef.value &&
    floatingRef.value &&
    !referenceRef.value.contains(target) &&
    !floatingRef.value.contains(target)
  ) {
    closeDropdown()
  }
}

function onEscapeKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
  document.addEventListener('keydown', onEscapeKey)
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
  document.removeEventListener('keydown', onEscapeKey)
  stopPositioning()
})
</script>

<style scoped></style>
