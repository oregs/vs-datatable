/// <reference types="C:/Users/SegunOregunwa/Documents/OregsThings/dependency-projects/vs-datatable/node_modules/.vue-global-types/vue_3.5_0.d.ts" />
import VsSearch from '@/components/VsSearch.vue';
const __VLS_props = defineProps();
const emit = defineEmits();
const onInput = (val) => {
    emit('update:searchQuery', val);
    emit('search', val);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "vs-datatable-toolbar vs-layout-row" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "vs-layout-start" },
});
if (__VLS_ctx.showSearch) {
    // @ts-ignore
    [showSearch,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "vs-search-container" },
    });
    /** @type {[typeof VsSearch, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(VsSearch, new VsSearch({
        ...{ 'onUpdate:modelValue': {} },
        modelValue: (__VLS_ctx.searchQuery),
        placeholder: (__VLS_ctx.searchPlaceholder),
        ...{ class: (__VLS_ctx.searchClass) },
    }));
    const __VLS_1 = __VLS_0({
        ...{ 'onUpdate:modelValue': {} },
        modelValue: (__VLS_ctx.searchQuery),
        placeholder: (__VLS_ctx.searchPlaceholder),
        ...{ class: (__VLS_ctx.searchClass) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    let __VLS_3;
    let __VLS_4;
    const __VLS_5 = ({ 'update:modelValue': {} },
        { 'onUpdate:modelValue': (__VLS_ctx.onInput) });
    // @ts-ignore
    [searchQuery, searchPlaceholder, searchClass, onInput,];
    var __VLS_2;
}
var __VLS_7 = {};
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "vs-layout-end" },
});
var __VLS_9 = {};
/** @type {__VLS_StyleScopedClasses['vs-datatable-toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-layout-row']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-layout-start']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-search-container']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-layout-end']} */ ;
// @ts-ignore
var __VLS_8 = __VLS_7, __VLS_10 = __VLS_9;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        VsSearch: VsSearch,
        onInput: onInput,
    }),
    __typeEmits: {},
    __typeProps: {},
});
const __VLS_component = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
