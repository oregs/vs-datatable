/// <reference types="C:/Users/SegunOregunwa/Documents/OregsThings/dependency-projects/vs-datatable/node_modules/.vue-global-types/vue_3.5_0.d.ts" />
import { defineProps, defineEmits } from 'vue';
const props = defineProps();
const emit = defineEmits(['update:modelValue', 'inputTyped']);
const onInput = (event) => {
    const input = event.target;
    emit('update:modelValue', input.value);
    emit('inputTyped', input.value);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "vs-search" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "vs-search-icon" },
});
__VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
    xmlns: "http://www.w3.org/2000/svg",
    height: "22px",
    viewBox: "0 -960 960 960",
    width: "22px",
    fill: "#e3e3e3",
});
__VLS_asFunctionalElement(__VLS_elements.path)({
    d: "M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z",
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    ...{ onInput: (__VLS_ctx.onInput) },
    type: "text",
    ...{ class: "vs-search-input" },
    placeholder: (__VLS_ctx.placeholder),
    value: (__VLS_ctx.modelValue),
});
// @ts-ignore
[onInput, placeholder, modelValue,];
/** @type {__VLS_StyleScopedClasses['vs-search']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-search-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-search-input']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        onInput: onInput,
    }),
    emits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    emits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
