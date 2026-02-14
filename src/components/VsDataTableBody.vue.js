/// <reference types="C:/Users/SegunOregunwa/Documents/OregsThings/dependency-projects/vs-datatable/node_modules/.vue-global-types/vue_3.5_0.d.ts" />
import { defineProps, defineEmits, computed, ref } from 'vue';
const props = defineProps();
const emit = defineEmits();
const safeRowKey = computed(() => props.rowKey ?? 'id');
const bodyRef = ref(null);
/**
 * Flatten grouped columns to match header structure
 */
const flatColumns = computed(() => {
    return props.columns.flatMap(col => 'children' in col ? col.children : [col]);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.tbody, __VLS_elements.tbody)({
    ref: "bodyRef",
});
/** @type {typeof __VLS_ctx.bodyRef} */ ;
// @ts-ignore
[bodyRef,];
if (__VLS_ctx.loading) {
    // @ts-ignore
    [loading,];
    __VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({});
    __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({
        colspan: (__VLS_ctx.totalColumns),
        ...{ class: "vs-loading" },
    });
    // @ts-ignore
    [totalColumns,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "vs-spinner" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    (__VLS_ctx.loadingText);
    // @ts-ignore
    [loadingText,];
}
else if (!__VLS_ctx.paginatedRows.length) {
    // @ts-ignore
    [paginatedRows,];
    __VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({});
    __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({
        colspan: (__VLS_ctx.totalColumns),
        ...{ class: "vs-no-data" },
    });
    // @ts-ignore
    [totalColumns,];
    var __VLS_0 = {};
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "vs-no-data-icon" },
    });
    __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
        viewBox: "0 0 24 24",
        fill: "currentColor",
    });
    __VLS_asFunctionalElement(__VLS_elements.path)({
        d: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z",
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "vs-no-data-message" },
    });
    (__VLS_ctx.noDataText);
    // @ts-ignore
    [noDataText,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "vs-no-data-description" },
    });
    (__VLS_ctx.noDataDescription);
    // @ts-ignore
    [noDataDescription,];
}
else {
    for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.paginatedRows))) {
        (__VLS_ctx.getRowKey(item, index));
        // @ts-ignore
        [paginatedRows, getRowKey,];
        __VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.loading))
                        return;
                    if (!!(!__VLS_ctx.paginatedRows.length))
                        return;
                    __VLS_ctx.$emit('row-click', item, index);
                    // @ts-ignore
                    [$emit,];
                } },
            ...{ class: ([
                    __VLS_ctx.rowClass,
                    { 'vs-row-clickable': __VLS_ctx.hasRowClick },
                    { 'vs-row-selected': __VLS_ctx.isRowSelected(item, __VLS_ctx.selectedItems, __VLS_ctx.safeRowKey) },
                ]) },
        });
        // @ts-ignore
        [rowClass, hasRowClick, isRowSelected, selectedItems, safeRowKey,];
        if (__VLS_ctx.expandable) {
            // @ts-ignore
            [expandable,];
            __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({
                ...{ onClick: () => { } },
                ...{ class: "vs-expand-column" },
                'data-field': "_expand",
            });
            __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.loading))
                            return;
                        if (!!(!__VLS_ctx.paginatedRows.length))
                            return;
                        if (!(__VLS_ctx.expandable))
                            return;
                        __VLS_ctx.toggleRowExpansion(item, index);
                        // @ts-ignore
                        [toggleRowExpansion,];
                    } },
                ...{ class: "vs-expand-btn" },
                type: "button",
                'aria-expanded': (__VLS_ctx.isRowExpanded(item, index)),
                'aria-controls': (`row-details-${__VLS_ctx.getRowKey(item, index)}`),
            });
            // @ts-ignore
            [getRowKey, isRowExpanded,];
            if (__VLS_ctx.isRowExpanded(item, index)) {
                // @ts-ignore
                [isRowExpanded,];
                __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
                __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
                    xmlns: "http://www.w3.org/2000/svg",
                    height: "24px",
                    viewBox: "0 -960 960 960",
                    width: "24px",
                    fill: "var(--vs-gray-800)",
                });
                __VLS_asFunctionalElement(__VLS_elements.path)({
                    d: "M480-345 240-585l56-56 184 183 184-183 56 56-240 240Z",
                });
            }
            else {
                __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
                __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
                    xmlns: "http://www.w3.org/2000/svg",
                    height: "24px",
                    viewBox: "0 -960 960 960",
                    width: "24px",
                    fill: "var(--vs-gray-800)",
                });
                __VLS_asFunctionalElement(__VLS_elements.path)({
                    d: "M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z",
                });
            }
        }
        if (__VLS_ctx.isItemSelectedControlled) {
            // @ts-ignore
            [isItemSelectedControlled,];
            __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({
                ...{ onClick: () => { } },
                ...{ class: "vs-checkbox-column" },
                'data-field': "_checkbox",
            });
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "vs-checkbox" },
            });
            __VLS_asFunctionalElement(__VLS_elements.input)({
                ...{ onChange: (...[$event]) => {
                        if (!!(__VLS_ctx.loading))
                            return;
                        if (!!(!__VLS_ctx.paginatedRows.length))
                            return;
                        if (!(__VLS_ctx.isItemSelectedControlled))
                            return;
                        __VLS_ctx.toggleRow(item, index);
                        // @ts-ignore
                        [toggleRow,];
                    } },
                type: "checkbox",
                id: (__VLS_ctx.tablename + '-checkbox-' + __VLS_ctx.getRowKey(item, index)),
                value: (item),
                checked: (__VLS_ctx.selectedItems.some((r, i) => __VLS_ctx.getRowKey(r, i) === __VLS_ctx.getRowKey(item, index))),
            });
            // @ts-ignore
            [getRowKey, getRowKey, getRowKey, selectedItems, tablename,];
            __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
                for: (__VLS_ctx.tablename + '-checkbox-' + __VLS_ctx.getRowKey(item, index)),
            });
            // @ts-ignore
            [getRowKey, tablename,];
        }
        for (const [column] of __VLS_getVForSourceType((__VLS_ctx.flatColumns))) {
            // @ts-ignore
            [flatColumns,];
            if (column && column.field) {
                __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({
                    key: (column.field),
                    ...{ class: (__VLS_ctx.cellClass) },
                    'data-field': (column.field),
                });
                // @ts-ignore
                [cellClass,];
                var __VLS_2 = {
                    item: (item),
                    value: (__VLS_ctx.getValue(item, column.field)),
                    column: (column),
                    index: (index),
                };
                var __VLS_3 = __VLS_tryAsConstant(`cell-${column.field}`);
                // @ts-ignore
                [getValue,];
                (__VLS_ctx.getValue(item, column.field));
                // @ts-ignore
                [getValue,];
            }
        }
        if (__VLS_ctx.expandable) {
            // @ts-ignore
            [expandable,];
            if (__VLS_ctx.isRowExpanded(item, index)) {
                // @ts-ignore
                [isRowExpanded,];
                __VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({
                    ...{ class: "vs-row-expanded" },
                });
                __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({
                    colspan: (__VLS_ctx.totalColumns),
                    ...{ class: "vs-expanded-cell" },
                });
                // @ts-ignore
                [totalColumns,];
                if (__VLS_ctx.isRowLoading(item, index)) {
                    // @ts-ignore
                    [isRowLoading,];
                    var __VLS_6 = {
                        item: (item),
                        index: (index),
                    };
                    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                        ...{ class: "vs-loader-bar" },
                    });
                    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                        ...{ class: "vs-loader-bar-inner" },
                    });
                }
                else {
                    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                        ...{ class: "vs-expanded-content" },
                    });
                    var __VLS_8 = {
                        item: (item),
                        index: (index),
                    };
                    __VLS_asFunctionalElement(__VLS_elements.b, __VLS_elements.b)({});
                    (__VLS_ctx.getRowKey(item, index));
                    // @ts-ignore
                    [getRowKey,];
                }
            }
        }
    }
}
/** @type {__VLS_StyleScopedClasses['vs-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-no-data']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-no-data-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-no-data-message']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-no-data-description']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-row-clickable']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-row-selected']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-expand-column']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-expand-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-checkbox-column']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-checkbox']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-row-expanded']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-expanded-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-loader-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-loader-bar-inner']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-expanded-content']} */ ;
// @ts-ignore
var __VLS_1 = __VLS_0, __VLS_4 = __VLS_3, __VLS_5 = __VLS_2, __VLS_7 = __VLS_6, __VLS_9 = __VLS_8;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        safeRowKey: safeRowKey,
        bodyRef: bodyRef,
        flatColumns: flatColumns,
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
