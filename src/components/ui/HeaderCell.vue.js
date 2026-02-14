/// <reference types="C:/Users/SegunOregunwa/Documents/OregsThings/dependency-projects/vs-datatable/node_modules/.vue-global-types/vue_3.5_0.d.ts" />
import { computed } from 'vue';
import VsDataTableFilterDropdown from '../VsDataTableFilterDropdown.vue';
const props = defineProps();
const emit = defineEmits();
const localFilters = computed({
    get: () => props.filters,
    set: (val) => emit('update:filters', val),
});
function onSort(event) {
    if (props.column.sortable && props.column.field) {
        props.sortHelpers.handleSort(props.column.field, event);
    }
}
function getColumnData() {
    if (!props.column.field)
        return [];
    return props.rows.map((r) => r[props.column.field]);
}
function onApplyFilter(val) {
    if (props.column.field)
        emit('applyFilter', props.column.field, val);
}
function onClearFilter() {
    if (props.column.field)
        emit('clearFilter', props.column.field);
}
function onCloseFilter() {
    if (props.column.field)
        emit('closeFilter', props.column.field);
}
function onOpenFilter() {
    if (props.column.field)
        emit('openFilter', props.column.field);
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['vs-sort-icon']} */ ;
// CSS variable injection 
// CSS variable injection end 
if (__VLS_ctx.column && __VLS_ctx.column.field) {
    // @ts-ignore
    [column, column,];
    __VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({
        ...{ onClick: (__VLS_ctx.onSort) },
        ...{ style: ([
                {
                    width: __VLS_ctx.column.width + '%',
                    textAlign: 'center',
                },
            ]) },
        'data-field': (__VLS_ctx.column.field || __VLS_ctx.column.label),
        rowspan: (__VLS_ctx.rowspan),
        ...{ class: "vs-group-header" },
        ...{ class: ([
                __VLS_ctx.headerClass,
                __VLS_ctx.column.colHeaderClass,
                __VLS_ctx.column.sortable ? 'vs-sortable' : '',
            ]) },
    });
    // @ts-ignore
    [column, column, column, column, column, onSort, rowspan, headerClass,];
    var __VLS_0 = {
        column: (__VLS_ctx.column),
    };
    var __VLS_1 = __VLS_tryAsConstant(`header-${__VLS_ctx.column.field}`);
    // @ts-ignore
    [column, column,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "vs-header-content" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "vs-header-label" },
    });
    (__VLS_ctx.column.label);
    // @ts-ignore
    [column,];
    if (__VLS_ctx.column.sortable) {
        // @ts-ignore
        [column,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "vs-sort-icons" },
        });
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "vs-sort-icon vs-sort-asc" },
            ...{ class: ({
                    'vs-active': __VLS_ctx.sortHelpers.isColumnSorted(__VLS_ctx.column.field) &&
                        __VLS_ctx.sortHelpers.getSortOrder(__VLS_ctx.column.field) === 'asc',
                }) },
        });
        // @ts-ignore
        [column, column, sortHelpers, sortHelpers,];
        __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
            xmlns: "http://www.w3.org/2000/svg",
            height: "24px",
            viewBox: "0 -960 960 960",
            width: "24px",
            fill: "var(--vs-gray-800)",
        });
        __VLS_asFunctionalElement(__VLS_elements.path)({
            d: "m280-400 200-200 200 200H280Z",
        });
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "vs-sort-icon vs-sort-desc" },
            ...{ class: ({
                    'vs-active': __VLS_ctx.sortHelpers.isColumnSorted(__VLS_ctx.column.field) &&
                        __VLS_ctx.sortHelpers.getSortOrder(__VLS_ctx.column.field) === 'desc',
                }) },
        });
        // @ts-ignore
        [column, column, sortHelpers, sortHelpers,];
        __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
            xmlns: "http://www.w3.org/2000/svg",
            height: "24px",
            viewBox: "0 -960 960 960",
            width: "24px",
        });
        __VLS_asFunctionalElement(__VLS_elements.path)({
            d: "M480-360 280-560h400L480-360Z",
        });
    }
    if (__VLS_ctx.sortHelpers.getSortPriority(__VLS_ctx.column.field) !== null) {
        // @ts-ignore
        [column, sortHelpers,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "vs-sort-priority" },
        });
        (__VLS_ctx.sortHelpers.getSortPriority(__VLS_ctx.column.field));
        // @ts-ignore
        [column, sortHelpers,];
    }
    if (__VLS_ctx.column.filter) {
        // @ts-ignore
        [column,];
        /** @type {[typeof VsDataTableFilterDropdown, typeof VsDataTableFilterDropdown, ]} */ ;
        // @ts-ignore
        const __VLS_4 = __VLS_asFunctionalComponent(VsDataTableFilterDropdown, new VsDataTableFilterDropdown({
            ...{ 'onApply': {} },
            ...{ 'onClear': {} },
            ...{ 'onClose': {} },
            ...{ 'onOpen': {} },
            type: (__VLS_ctx.column.filter.type),
            asyncOptions: (__VLS_ctx.column.filter.asyncOptions),
            field: (__VLS_ctx.column.field),
            operators: (__VLS_ctx.column.filter.operators),
            modelValue: (__VLS_ctx.localFilters[__VLS_ctx.column.field]),
            visible: (__VLS_ctx.openFilter === __VLS_ctx.column.field),
            columnData: (__VLS_ctx.getColumnData()),
        }));
        const __VLS_5 = __VLS_4({
            ...{ 'onApply': {} },
            ...{ 'onClear': {} },
            ...{ 'onClose': {} },
            ...{ 'onOpen': {} },
            type: (__VLS_ctx.column.filter.type),
            asyncOptions: (__VLS_ctx.column.filter.asyncOptions),
            field: (__VLS_ctx.column.field),
            operators: (__VLS_ctx.column.filter.operators),
            modelValue: (__VLS_ctx.localFilters[__VLS_ctx.column.field]),
            visible: (__VLS_ctx.openFilter === __VLS_ctx.column.field),
            columnData: (__VLS_ctx.getColumnData()),
        }, ...__VLS_functionalComponentArgsRest(__VLS_4));
        let __VLS_7;
        let __VLS_8;
        const __VLS_9 = ({ apply: {} },
            { onApply: ((val) => __VLS_ctx.onApplyFilter(val)) });
        const __VLS_10 = ({ clear: {} },
            { onClear: (__VLS_ctx.onClearFilter) });
        const __VLS_11 = ({ close: {} },
            { onClose: (__VLS_ctx.onCloseFilter) });
        const __VLS_12 = ({ open: {} },
            { onOpen: (__VLS_ctx.onOpenFilter) });
        const { default: __VLS_13 } = __VLS_6.slots;
        // @ts-ignore
        [column, column, column, column, column, column, localFilters, openFilter, getColumnData, onApplyFilter, onClearFilter, onCloseFilter, onOpenFilter,];
        if (__VLS_ctx.column.filter.custom) {
            // @ts-ignore
            [column,];
            {
                const { custom: __VLS_14 } = __VLS_6.slots;
                const [{ filter, apply, clear }] = __VLS_getSlotParameters(__VLS_14);
                var __VLS_15 = {
                    filter: (filter),
                    apply: (apply),
                    clear: (clear),
                };
                var __VLS_16 = __VLS_tryAsConstant(__VLS_ctx.column.filter.custom);
                // @ts-ignore
                [column,];
            }
        }
        var __VLS_6;
    }
}
/** @type {__VLS_StyleScopedClasses['vs-group-header']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-header-content']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-header-label']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-sort-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-sort-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-sort-asc']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-active']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-sort-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-sort-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-active']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-sort-priority']} */ ;
// @ts-ignore
var __VLS_2 = __VLS_1, __VLS_3 = __VLS_0, __VLS_17 = __VLS_16, __VLS_18 = __VLS_15;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        VsDataTableFilterDropdown: VsDataTableFilterDropdown,
        localFilters: localFilters,
        onSort: onSort,
        getColumnData: getColumnData,
        onApplyFilter: onApplyFilter,
        onClearFilter: onClearFilter,
        onCloseFilter: onCloseFilter,
        onOpenFilter: onOpenFilter,
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
