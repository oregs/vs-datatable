/// <reference types="C:/Users/SegunOregunwa/Documents/OregsThings/dependency-projects/vs-datatable/node_modules/.vue-global-types/vue_3.5_0.d.ts" />
import { defineProps, defineEmits } from 'vue';
const props = defineProps();
const emit = defineEmits();
// Default options if not passed in
const options = props.options ?? [10, 25, 50, 100];
const onChange = (event) => {
    const value = Number(event.target.value);
    emit('update:modelValue', value);
    emit('rowsPerPageChanged', value);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "vs-rows-per-page" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "vs-rows-label" },
});
__VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)({
    ...{ onChange: (__VLS_ctx.onChange) },
    ...{ class: "vs-items-dropdown" },
    value: (__VLS_ctx.modelValue),
});
// @ts-ignore
[onChange, modelValue,];
for (const [option] of __VLS_getVForSourceType((__VLS_ctx.options))) {
    // @ts-ignore
    [options,];
    __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
        key: (option),
        value: (option),
    });
    (option);
}
/** @type {__VLS_StyleScopedClasses['vs-rows-per-page']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-rows-label']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-items-dropdown']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        options: options,
        onChange: onChange,
    }),
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
