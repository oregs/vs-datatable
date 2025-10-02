<template>
    <teleport to="body">
      <div
        v-if="visible"
        ref="dropdownRef"
        class="vs-filter-popover"
        :style="popoverStyle"
        role="dialog"
        @mousedown.stop
      >
        <!-- Operators -->
        <div v-if="operators?.length" class="vs-filter-operators">
          <select v-model="localFilter.operator" class="vs-operator-select">
            <option v-for="op in operators" :key="op.value" :value="op.value">
              {{ op.label }}
            </option>
          </select>
        </div>
  
        <!-- Built-in filter bodies -->
        <div v-if="type === 'text'" class="vs-filter-body">
          <input v-model="localFilter.value" class="vs-input" placeholder="Search..." />
        </div>
  
        <div v-else-if="type === 'multi-select'" class="vs-filter-body">
          <div class="vs-multi-actions">
            <button @click="selectAll" type="button">Select all</button>
            <button @click="clearAll" type="button">Clear</button>
          </div>
          <input v-model="search" class="vs-input" placeholder="Search..." />
          <div class="vs-options" ref="optionsList">
            <label v-for="opt in filteredOptions" :key="opt" class="vs-option">
              <input
                type="checkbox"
                :value="opt"
                v-model="(localFilter as any).value"
              />
              <span>{{ opt }}</span>
            </label>
          </div>
        </div>
  
        <div v-else-if="type === 'number-range'" class="vs-filter-body">
          <div class="vs-range-row">
            <input type="number" v-model.number="(localFilter as any).min" class="vs-input" placeholder="Min" />
            <span class="vs-range-sep">to</span>
            <input type="number" v-model.number="(localFilter as any).max" class="vs-input" placeholder="Max" />
          </div>
        </div>
  
        <div v-else-if="type === 'date-range'" class="vs-filter-body">
          <div class="vs-range-row">
            <input type="date" v-model="(localFilter as any).start" class="vs-input" />
            <span class="vs-range-sep">to</span>
            <input type="date" v-model="(localFilter as any).end" class="vs-input" />
          </div>
        </div>
  
        <!-- Custom slot override (developer can inject via VsDataTable wrapper) -->
        <slot name="custom" v-if="$slots.custom" :filter="localFilter" :apply="apply" :clear="clear" />
  
        <!-- Footer -->
        <div class="vs-filter-footer">
          <button class="vs-btn vs-apply" @click="apply">Apply</button>
          <button class="vs-btn vs-clear" @click="clear">Clear</button>
        </div>
      </div>
    </teleport>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
  import type { FilterType, ColumnFilter, FilterOperator } from "@/types/datatable";
  
  const props = defineProps<{
    type: FilterType;
    options?: string[];
    operators?: FilterOperator[];
    modelValue?: ColumnFilter | null;
    anchorEl: HTMLElement | null; // required for positioning
    visible?: boolean;
  }>();
  
  const emit = defineEmits<{
    (e: "update:modelValue", value: ColumnFilter): void;
    (e: "apply", value: ColumnFilter): void;
    (e: "clear"): void;
    (e: "close"): void;
  }>();
  
  const dropdownRef = ref<HTMLElement | null>(null);
  const optionsList = ref<HTMLElement | null>(null);
  
  const visible = computed(() => !!props.visible && !!props.anchorEl);
  
  const localFilter = ref<ColumnFilter>(props.modelValue ?? ({ type: props.type } as ColumnFilter));
  watch(() => props.modelValue, (v) => {
    localFilter.value = v ?? ({ type: props.type } as ColumnFilter);
  }, { deep: true });
  
  const search = ref("");
  const filteredOptions = computed(() => {
    if (!props.options) return [];
    if (!search.value) return props.options;
    return props.options.filter((o) => o.toLowerCase().includes(search.value.toLowerCase()));
  });
  
  const popoverStyle = ref<Record<string, string>>({
    position: "absolute",
    top: "0px",
    left: "0px",
    zIndex: "2147483647",
    minWidth: "220px",
  });
  
  function updatePosition() {
    const anchor = props.anchorEl;
    const dd = dropdownRef.value;
    if (!anchor || !dd) return;
  
    const aRect = anchor.getBoundingClientRect();
    const ddRect = dd.getBoundingClientRect();
    const viewportW = document.documentElement.clientWidth;
    const viewportH = document.documentElement.clientHeight;
  
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
  
    // default place below anchor, left aligned
    let top = aRect.bottom + 8 + scrollY;
    let left = aRect.left + scrollX;
  
    // if right overflow, shift left
    if (left + ddRect.width > scrollX + viewportW - 8) {
      left = Math.max(8 + scrollX, scrollX + viewportW - ddRect.width - 8);
    }
  
    // if bottom overflow, open above anchor
    if (top + ddRect.height > scrollY + viewportH - 8) {
      top = aRect.top - ddRect.height - 8 + scrollY;
    }
  
    popoverStyle.value.top = `${Math.round(top)}px`;
    popoverStyle.value.left = `${Math.round(left)}px`;
  }
  
  function handleDocDown(e: MouseEvent) {
    const t = e.target as Node | null;
    if (!dropdownRef.value) return;
    // if click is inside dropdown or inside anchor, ignore
    if (dropdownRef.value.contains(t)) return;
    if (props.anchorEl && props.anchorEl.contains(t)) return;
    emit("close");
  }
  
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") emit("close");
  }
  
  onMounted(() => {
    document.addEventListener("mousedown", handleDocDown);
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
  });
  
  onBeforeUnmount(() => {
    document.removeEventListener("mousedown", handleDocDown);
    window.removeEventListener("keydown", handleKeydown);
    window.removeEventListener("resize", updatePosition);
    window.removeEventListener("scroll", updatePosition, true);
  });
  
  watch([() => props.anchorEl, () => visible.value], async () => {
    if (visible.value) {
      await nextTick();
      updatePosition();
    }
  });
  
  function apply() {
    emit("update:modelValue", localFilter.value);
    emit("apply", localFilter.value);
  }
  
  function clear() {
    // reset to an empty typed filter
    localFilter.value = ({ type: props.type } as ColumnFilter);
    emit("update:modelValue", localFilter.value);
    emit("clear");
  }
  
  function selectAll() {
    if (props.type !== "multi-select" || !props.options) return;
    localFilter.value = { type: "multi-select", value: [...props.options] } as ColumnFilter;
  }
  
  function clearAll() {
    if (props.type !== "multi-select") return;
    localFilter.value = { type: "multi-select", value: [] } as ColumnFilter;
  }
  </script>
  
  <style scoped>
  .vs-filter-popover {
    background: white;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.12);
    padding: 12px;
    font-size: 14px;
    color: var(--vs-gray-800, #333);
    border: 1px solid rgba(0,0,0,0.06);
    min-width: 220px;
    max-width: 360px;
  }
  .vs-filter-operators { margin-bottom: 8px; }
  .vs-operator-select, .vs-input {
    width: 100%;
    box-sizing: border-box;
    padding: 8px;
    border-radius: 6px;
    border: 1px solid #e6e6e6;
    outline: none;
  }
  .vs-multi-actions {
    display:flex;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 8px;
  }
  .vs-options {
    max-height: 180px;
    overflow-y: auto;
    margin-top: 8px;
  }
  .vs-option { display:flex; align-items:center; gap:8px; padding:6px 0; }
  .vs-range-row { display:flex; gap:8px; align-items:center; }
  .vs-range-sep { color: #777; }
  .vs-filter-footer { display:flex; justify-content:flex-end; gap:8px; margin-top:12px; }
  .vs-btn { padding:8px 12px; border-radius:6px; border:1px solid #ddd; background:#fff; cursor:pointer; }
  .vs-apply { background:#f5f7fa; }
  .vs-clear { background:#fff; }
  </style>
  