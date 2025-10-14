<template>
  <!-- Filter trigger -->
  <span
    ref="referenceRef"
    class="vs-column-filter"
    @click.stop="toggleDropdown"
    :class="{
      'is-active': hasValue(localFilter),
      'in-active': !hasValue(localFilter),
    }"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="currentColor"
    >
      <path
        d="M440-160q-17 0-28.5-11.5T400-200v-240L168-736q-15-20-4.5-42t36.5-22h560q26 0 36.5 22t-4.5 42L560-440v240q0 17-11.5 28.5T520-160h-80Zm40-308 198-252H282l198 252Zm0 0Z"
      />
    </svg>
  </span>

  <!-- Dropdown (teleported outside table for responsiveness) -->
  <teleport to="body">
    <transition name="fade">
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
          <div v-if="availableOperators.length > 1" class="vs-pb-sm">
            <select v-model="localFilter.operator" class="vs-operator-select vs-mx-auto vs-w-full">
              <option v-for="op in availableOperators" :key="op" :value="op">
                {{ formatOperator(op) }}
              </option>
            </select>
          </div>
          <VsDFlex direction="row" class="mb-6">
            <input
              type="text"
              v-model="localFilter.value"
              placeholder="Search..."
              class="vs-input vs-mx-auto vs-w-full"
          /></VsDFlex>
        </div>

        <!-- Multi-select filter -->
        <div v-else-if="localFilter.type === 'multi-select'" class="vs-filter-multi">
          <VsDFlex direction="row" class="mb-6 vs-align-center vs-justify-end">
            <span v-if="asyncOptions" @click="loadAsyncOptions(true)" class="vs-cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="var(--vs-inactive)"
              >
                <path
                  d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"
                />
              </svg>
            </span>
          </VsDFlex>

          <VsMultiSelect
            :isLoading="isLoading"
            :columnData="columnOrAsyncOptions"
            v-model="localFilter.value"
            placeholder="Select values..."
          />
        </div>

        <!-- Number filter -->
        <div v-else-if="localFilter.type === 'number-range'" class="vs-filter-range">
          <div v-if="availableOperators.length > 1" class="vs-pb-sm">
            <select v-model="localFilter.operator" class="vs-operator-select vs-w-full">
              <option v-for="op in availableOperators" :key="op" :value="op">
                {{ formatOperator(op) }}
              </option>
            </select>
          </div>
          <div v-else>
            <span class="vs-operator-fixed">{{ localFilter.operator }}</span>
          </div>

          <!-- Between -->
          <VsDFlex
            v-if="localFilter.operator === 'between'"
            justify="between"
            align="center"
            gap="4"
            class="mb-6"
          >
            <input
              type="number"
              v-model.number="localFilter.min"
              placeholder="Min"
              class="vs-input vs-w-full"
            />
            <span>-</span>
            <input
              type="number"
              v-model.number="localFilter.max"
              placeholder="Max"
              class="vs-input vs-w-full"
            />
          </VsDFlex>

          <!-- Equals / Not Equal / GreaterThan / LessThan -->
          <VsDFlex
            v-else-if="
              ['equals', 'notEqual', 'greaterThan', 'lessThan'].includes(localFilter.operator || '')
            "
            direction="row"
          >
            <input
              type="number"
              v-model.number="localFilter.value"
              placeholder="Enter number"
              class="vs-input vs-w-full"
            />
          </VsDFlex>

          <!-- Empty / Not Empty -->
          <div v-else-if="['empty', 'notEmpty'].includes(localFilter.operator || '')">
            <div class="vs-muted vs-text-center vs-pt-sm">No input required</div>
          </div>
        </div>

        <!-- Date range filter -->
        <div v-else-if="localFilter.type === 'date-range'" class="vs-filter-date">
          <div v-if="availableOperators.length > 1" class="vs-pb-sm">
            <select v-model="localFilter.operator" class="vs-operator-select vs-w-full">
              <option v-for="op in availableOperators" :key="op" :value="op">
                {{ formatOperator(op) }}
              </option>
            </select>
          </div>
          <div v-else>
            <span class="vs-operator-fixed">{{ localFilter.operator }}</span>
          </div>

          <!-- Between -->
          <VsDFlex
            v-if="localFilter.operator === 'between'"
            justify="between"
            align="center"
            gap="4"
            class="mb-6"
          >
            <input type="date" v-model="localFilter.start" class="vs-input vs-w-full" />
            <span>-</span>
            <input type="date" v-model="localFilter.end" class="vs-input vs-w-full" />
          </VsDFlex>

          <!-- Equals / Not Equal / Before / After -->
          <VsDFlex
            v-else-if="
              ['equals', 'notEqual', 'before', 'after'].includes(localFilter.operator || '')
            "
            direction="row"
            class="vs-filter-single-date"
          >
            <input type="date" v-model="localFilter.value" class="vs-input vs-w-full" />
          </VsDFlex>

          <!-- Empty / Not Empty -->
          <div
            v-else-if="['empty', 'notEmpty'].includes(localFilter.operator || '')"
            class="vs-muted vs-text-center vs-pt-sm"
          >
            No date input required
          </div>
        </div>

        <!-- Footer actions -->
        <div v-if="localFilter.type !== 'custom'" class="vs-filter-actions">
          <button class="vs-btn vs-btn-primary" @click="applyFilter">Apply</button>
          <button class="vs-btn vs-btn-secondary" @click="clearFilter">Clear</button>
        </div>

        <!-- Custom slot -->
        <slot name="custom" :filter="localFilter" :apply="applyFilter" :clear="clearFilter" />
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { computePosition, autoUpdate, flip, offset, shift } from '@floating-ui/dom'
import { initFilter, hasValue } from '@/utils/filters'
import type { ColumnFilter } from '@/types/datatable'
import VsDFlex from '@/components/layout/VsDFlex.vue'
import '@/styles/vs-layout.css'
import VsMultiSelect from '@/components/ui/VsMultiSelect.vue'
import { useAsyncOption } from '@/composables/useAsyncOption'

interface Props {
  modelValue?: ColumnFilter
  type: ColumnFilter['type']
  field?: string
  visible?: boolean
  operators?: string[]
  columnData: any[]
  asyncOptions?: () => Promise<string[]>
}

const props = withDefaults(defineProps<Props>(), {
  columnData: () => [],
})

const emit = defineEmits<{
  (e: 'update:modelValue', val: ColumnFilter): void
  (e: 'apply', val: ColumnFilter): void
  (e: 'clear'): void
  (e: 'open'): void
  (e: 'close'): void
}>()

const { columnOrAsyncOptions, isLoading, clearCache, loadAsyncOptions } = useAsyncOption({
  asyncOptions: props.asyncOptions,
  columnData: props.columnData,
  cacheKey: props.field,
})

// default operators per type
const defaultOperators: Record<ColumnFilter['type'], string[]> = {
  text: [
    'contains',
    'doesNotContains',
    'equals',
    'doesNotEqual',
    'startsWith',
    'endsWith',
    'empty',
    'notEmpty',
  ],
  'multi-select': [],
  'number-range': ['between', 'equals', 'notEqual', 'greaterThan', 'lessThan', 'empty', 'notEmpty'],
  'date-range': ['between', 'equals', 'notEqual', 'before', 'after', 'empty', 'notEmpty'],
  custom: [],
}

function formatOperator(op: string) {
  switch (op) {
    case 'notEqual':
      return 'Not Equal'
    case 'greaterThan':
      return 'Greater Than'
    case 'lessThan':
      return 'Less Than'
    case 'doesNotContains':
      return 'Does Not Contain'
    case 'doesNotEqual':
      return 'Does Not Equal'
    case 'startsWith':
      return 'Starts With'
    case 'endsWith':
      return 'Ends With'
    case 'notEmpty':
      return 'Not Empty'
    default:
      return op.charAt(0).toUpperCase() + op.slice(1)
  }
}

// pick operators
const availableOperators = computed(() => {
  if (props.type === 'custom') return []
  return props.operators?.length ? props.operators : defaultOperators[props.type]
})

// refs for floating-ui
const referenceRef = ref<HTMLElement | null>(null)
const floatingRef = ref<HTMLElement | null>(null)
const cleanup = ref<() => void>()

const isOpen = ref(false)

// Watch open state
watch(
  () => props.visible,
  async (val) => {
    isOpen.value = !!val
    if (isOpen.value) {
      await nextTick()
      startPositioning()

      if (props.asyncOptions) {
        loadAsyncOptions()
      }
    } else {
      stopPositioning()
    }
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
      Object.assign(floatingRef.value!.style, {
        left: `${x}px`,
        top: `${y}px`,
        position: 'absolute',
        zIndex: 2000,
      })
    })
  })
}

function stopPositioning() {
  cleanup.value?.()
  cleanup.value = undefined
}

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

<style scoped>
/* .vs-filter-dropdown {
  background: var(--vs-surface, #fff);
  border: 1px solid var(--vs-border, #ddd);
  border-radius: 6px;
  padding: 1rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  min-width: 200px;
} */
</style>
