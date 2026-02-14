/// <reference types="C:/Users/SegunOregunwa/Documents/OregsThings/dependency-projects/vs-datatable/node_modules/.vue-global-types/vue_3.5_0.d.ts" />
import { computed } from 'vue';
const props = defineProps();
/**
 * 🔹 Get all leaf columns in correct order (ignores group headers)
 */
const footerCells = computed(() => {
    const leafColumns = [];
    function collectLeafColumns(columns) {
        for (const col of columns) {
            if (col.hidden)
                continue;
            if (col.children && col.children.length) {
                // This is a group column - process its children but don't add it to footer
                collectLeafColumns(col.children);
            }
            else {
                // This is a leaf column - add to footer
                leafColumns.push(col);
            }
        }
    }
    collectLeafColumns(props.columns);
    // Calculate footer values for each leaf column
    return leafColumns.map(col => {
        const hasFooter = col.footerValue !== undefined;
        let footerValue = null;
        if (typeof col.footerValue === 'function') {
            try {
                footerValue = col.footerValue(props.rows);
            }
            catch (err) {
                console.warn(`Error computing footerValue for column "${col.field}"`, err);
            }
        }
        else if (col.footerValue !== undefined) {
            footerValue = col.footerValue;
        }
        return {
            ...col,
            hasFooter,
            footerValue,
            formattedValue: formatValue(col, footerValue)
        };
    });
});
/**
 * 🔹 Format a value using column formatter
 */
function formatValue(col, value) {
    if (value == null)
        return '';
    if (col.footerFormatter) {
        try {
            return col.footerFormatter(value, col);
        }
        catch (err) {
            console.warn(`Error in footerFormatter for column "${col.field}"`, err);
            return String(value);
        }
    }
    if (typeof value === 'number') {
        // Special handling for currency
        if (col.field === 'price') {
            return `$${value.toFixed(2)}`;
        }
        if (col.field === 'tax') {
            return value.toFixed(2);
        }
        return value.toLocaleString();
    }
    return String(value);
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
if (__VLS_ctx.footerCells.length) {
    // @ts-ignore
    [footerCells,];
    __VLS_asFunctionalElement(__VLS_elements.tfoot, __VLS_elements.tfoot)({});
    __VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({
        ...{ class: "vs-footer-row" },
    });
    if (__VLS_ctx.expandable) {
        // @ts-ignore
        [expandable,];
        __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({
            ...{ class: "vs-footer-cell vs-expand-column" },
        });
    }
    if (__VLS_ctx.isItemSelectedControlled) {
        // @ts-ignore
        [isItemSelectedControlled,];
        __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({
            ...{ class: "vs-footer-cell vs-checkbox-column" },
        });
    }
    for (const [cell, index] of __VLS_getVForSourceType((__VLS_ctx.footerCells))) {
        // @ts-ignore
        [footerCells,];
        __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({
            'data-field': (cell.field),
            ...{ class: "vs-footer-cell" },
            ...{ class: (cell.footerClass || '') },
            ...{ style: (cell.footerStyle || {}) },
        });
        if (cell.hasFooter) {
            var __VLS_0 = {
                column: (cell),
                value: (cell.footerValue),
                rows: (__VLS_ctx.rows),
            };
            var __VLS_1 = __VLS_tryAsConstant(`footer-${cell.field}`);
            // @ts-ignore
            [rows,];
            (cell.formattedValue);
        }
    }
}
/** @type {__VLS_StyleScopedClasses['vs-footer-row']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-footer-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-expand-column']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-footer-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-checkbox-column']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-footer-cell']} */ ;
// @ts-ignore
var __VLS_2 = __VLS_1, __VLS_3 = __VLS_0;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        footerCells: footerCells,
    }),
    __typeProps: {},
});
const __VLS_component = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
