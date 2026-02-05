/// <reference types="C:/Users/SegunOregunwa/Documents/OregsThings/dependency-projects/vs-datatable/node_modules/.vue-global-types/vue_3.5_0.d.ts" />
import { computed, defineProps, defineEmits } from 'vue';
import { calcTotalPages } from '@/utils/datatable';
const props = defineProps();
const emit = defineEmits(['update:modelValue', 'pageChanged']);
const maxVisible = props.maxVisible ?? 3;
const currentPage = computed({
    get: () => props.modelValue,
    set: (value) => {
        emit('update:modelValue', value);
        emit('pageChanged', value);
    }
});
const startPage = computed(() => {
    if (currentPage.value <= Math.floor(maxVisible / 2))
        return 1;
    if (currentPage.value >= totalPages.value - Math.floor(maxVisible / 2))
        return Math.max(totalPages.value - maxVisible + 1, 1);
    return currentPage.value - Math.floor(maxVisible / 2);
});
const endPage = computed(() => Math.min(startPage.value + maxVisible - 1, totalPages.value));
const totalPages = computed(() => calcTotalPages(props.totalRecords, props.rowsPerPage));
const visiblePages = computed(() => {
    const pages = [];
    for (let i = startPage.value; i <= endPage.value; i++) {
        pages.push(i);
    }
    return pages;
});
const navigateTable = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
};
const prevRecord = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};
const nextRecord = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['vs-pagination-button']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-pagination-button']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-pagination-button']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-pagination-button']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "vs-pagination" },
    id: (__VLS_ctx.tablename + '-pagination'),
});
// @ts-ignore
[tablename,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.prevRecord) },
    type: "button",
    ...{ class: "vs-pagination-button vs-pagination-nav" },
    disabled: (__VLS_ctx.currentPage === 1),
});
// @ts-ignore
[prevRecord, currentPage,];
if (__VLS_ctx.startPage > 1) {
    // @ts-ignore
    [startPage,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.startPage > 1))
                    return;
                __VLS_ctx.navigateTable(1);
                // @ts-ignore
                [navigateTable,];
            } },
        type: "button",
        ...{ class: "vs-pagination-button" },
    });
}
if (__VLS_ctx.startPage > 2) {
    // @ts-ignore
    [startPage,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "vs-pagination-ellipsis" },
    });
}
for (const [page] of __VLS_getVForSourceType((__VLS_ctx.visiblePages))) {
    // @ts-ignore
    [visiblePages,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.navigateTable(page);
                // @ts-ignore
                [navigateTable,];
            } },
        key: (page),
        type: "button",
        ...{ class: ([
                'vs-pagination-button',
                { 'vs-active': __VLS_ctx.currentPage === page }
            ]) },
        id: (__VLS_ctx.tablename + '-page-' + page),
    });
    // @ts-ignore
    [tablename, currentPage,];
    (page);
}
if (__VLS_ctx.endPage < __VLS_ctx.totalPages - 1) {
    // @ts-ignore
    [endPage, totalPages,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "vs-pagination-ellipsis" },
    });
}
if (__VLS_ctx.endPage < __VLS_ctx.totalPages) {
    // @ts-ignore
    [endPage, totalPages,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.endPage < __VLS_ctx.totalPages))
                    return;
                __VLS_ctx.navigateTable(__VLS_ctx.totalPages);
                // @ts-ignore
                [navigateTable, totalPages,];
            } },
        type: "button",
        ...{ class: "vs-pagination-button" },
    });
    (__VLS_ctx.totalPages);
    // @ts-ignore
    [totalPages,];
}
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.nextRecord) },
    type: "button",
    ...{ class: "vs-pagination-button vs-pagination-nav" },
    disabled: (__VLS_ctx.currentPage === __VLS_ctx.totalPages),
});
// @ts-ignore
[currentPage, totalPages, nextRecord,];
/** @type {__VLS_StyleScopedClasses['vs-pagination']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-pagination-button']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-pagination-nav']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-pagination-button']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-pagination-ellipsis']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-pagination-button']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-active']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-pagination-ellipsis']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-pagination-button']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-pagination-button']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-pagination-nav']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        currentPage: currentPage,
        startPage: startPage,
        endPage: endPage,
        totalPages: totalPages,
        visiblePages: visiblePages,
        navigateTable: navigateTable,
        prevRecord: prevRecord,
        nextRecord: nextRecord,
    }),
    emits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    emits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
