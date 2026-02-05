/// <reference types="C:/Users/SegunOregunwa/Documents/OregsThings/dependency-projects/vs-datatable/node_modules/.vue-global-types/vue_3.5_0.d.ts" />
import { ref, computed, watch } from 'vue';
import VsDFlex from '../layout/VsDFlex.vue';
const props = defineProps();
const emit = defineEmits();
const search = ref('');
const selectedValues = ref([...(props.modelValue ?? [])]);
// Unique options
const options = computed(() => {
    const unique = new Set(props.columnData.filter(Boolean));
    return Array.from(unique);
});
// Filtered list
const filteredOptions = computed(() => {
    const q = search.value.toLowerCase();
    return options.value.filter(opt => opt.toString().toLowerCase().includes(q));
});
// Counts
const selectedCount = computed(() => selectedValues.value.length);
const unselectedCount = computed(() => options.value.length - selectedValues.value.length);
// Toggle item
const toggleOption = (option) => {
    const idx = selectedValues.value.indexOf(option);
    if (idx > -1)
        selectedValues.value.splice(idx, 1);
    else
        selectedValues.value.push(option);
    emit('update:modelValue', [...selectedValues.value]);
};
// Bulk actions
const selectAll = () => {
    selectedValues.value = [...options.value];
    emit('update:modelValue', [...selectedValues.value]);
};
const deselectAll = () => {
    selectedValues.value = [];
    emit('update:modelValue', []);
};
// Sync prop changes
watch(() => props.modelValue, val => {
    selectedValues.value = [...(val || [])];
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "vs-multiselect" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "vs-multiselect-actions" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.selectAll) },
});
// @ts-ignore
[selectAll,];
(__VLS_ctx.unselectedCount);
// @ts-ignore
[unselectedCount,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.deselectAll) },
});
// @ts-ignore
[deselectAll,];
(__VLS_ctx.selectedCount);
// @ts-ignore
[selectedCount,];
/** @type {[typeof VsDFlex, typeof VsDFlex, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(VsDFlex, new VsDFlex({
    direction: "row",
}));
const __VLS_1 = __VLS_0({
    direction: "row",
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
const { default: __VLS_3 } = __VLS_2.slots;
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "text",
    value: (__VLS_ctx.search),
    placeholder: "Search...",
    ...{ class: "vs-multiselect-search vs-w-full" },
});
// @ts-ignore
[search,];
var __VLS_2;
if (__VLS_ctx.isLoading) {
    // @ts-ignore
    [isLoading,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "vs-py-4 vs-text-center vs-text-primary" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_elements.ul, __VLS_elements.ul)({
        ...{ class: "vs-multiselect-options" },
    });
    for (const [option] of __VLS_getVForSourceType((__VLS_ctx.filteredOptions))) {
        // @ts-ignore
        [filteredOptions,];
        __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.isLoading))
                        return;
                    __VLS_ctx.toggleOption(option);
                    // @ts-ignore
                    [toggleOption,];
                } },
            key: (option),
            ...{ class: ({ selected: __VLS_ctx.selectedValues.includes(option) }) },
        });
        // @ts-ignore
        [selectedValues,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "option-label" },
        });
        (option);
        if (__VLS_ctx.selectedValues.includes(option)) {
            // @ts-ignore
            [selectedValues,];
            __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
                xmlns: "http://www.w3.org/2000/svg",
                ...{ class: "check-icon" },
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
            });
            __VLS_asFunctionalElement(__VLS_elements.path)({
                'stroke-linecap': "round",
                'stroke-linejoin': "round",
                'stroke-width': "2",
                d: "M5 13l4 4L19 7",
            });
        }
    }
}
/** @type {__VLS_StyleScopedClasses['vs-multiselect']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-multiselect-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-multiselect-search']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-multiselect-options']} */ ;
/** @type {__VLS_StyleScopedClasses['selected']} */ ;
/** @type {__VLS_StyleScopedClasses['option-label']} */ ;
/** @type {__VLS_StyleScopedClasses['check-icon']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        VsDFlex: VsDFlex,
        search: search,
        selectedValues: selectedValues,
        filteredOptions: filteredOptions,
        selectedCount: selectedCount,
        unselectedCount: unselectedCount,
        toggleOption: toggleOption,
        selectAll: selectAll,
        deselectAll: deselectAll,
    }),
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
