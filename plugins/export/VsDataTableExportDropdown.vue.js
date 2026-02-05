/// <reference types="C:/Users/SegunOregunwa/Documents/OregsThings/dependency-projects/vs-datatable/node_modules/.vue-global-types/vue_3.5_0.d.ts" />
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useDataTableExport } from './useDataTableExport';
const props = defineProps();
const isOpen = ref(false);
const menu = ref(null);
function toggleMenu() {
    isOpen.value = !isOpen.value;
}
function closeMenu() {
    isOpen.value = false;
}
const { exportToCSV, exportToExcel } = useDataTableExport(ref(props.rows), props.columns);
onMounted(() => {
    document.addEventListener('click', closeMenu);
});
onBeforeUnmount(() => {
    document.removeEventListener('click', closeMenu);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "export-dropdown" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.toggleMenu) },
    ...{ class: "export-btn" },
    ref: "toggleBtn",
});
/** @type {typeof __VLS_ctx.toggleBtn} */ ;
// @ts-ignore
[toggleMenu, toggleBtn,];
__VLS_asFunctionalElement(__VLS_elements.ul, __VLS_elements.ul)({
    ...{ class: "export-menu" },
    ref: "menu",
    ...{ class: ({ active: __VLS_ctx.isOpen }) },
});
/** @type {typeof __VLS_ctx.menu} */ ;
// @ts-ignore
[isOpen, menu,];
__VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.exportToCSV();
            // @ts-ignore
            [exportToCSV,];
        } },
});
__VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.exportToExcel();
            // @ts-ignore
            [exportToExcel,];
        } },
});
__VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({});
/** @type {__VLS_StyleScopedClasses['export-dropdown']} */ ;
/** @type {__VLS_StyleScopedClasses['export-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['export-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        isOpen: isOpen,
        menu: menu,
        toggleMenu: toggleMenu,
        exportToCSV: exportToCSV,
        exportToExcel: exportToExcel,
    }),
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
