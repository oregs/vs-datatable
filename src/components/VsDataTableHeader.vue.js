/// <reference types="C:/Users/SegunOregunwa/Documents/OregsThings/dependency-projects/vs-datatable/node_modules/.vue-global-types/vue_3.5_0.d.ts" />
import { computed, ref } from 'vue';
import HeaderCell from '@/components/ui/HeaderCell.vue';
const props = defineProps();
const emit = defineEmits();
function toggleAll(event) {
    emit('toggleAll', event);
}
const localFilters = computed({
    get: () => props.filters,
    set: (val) => emit('update:filters', val),
});
// Filter Column
const openFilter = ref(null);
function handleOpenFilter(field) {
    openFilter.value = field;
}
function handleCloseFilter(field) {
    if (openFilter.value === field)
        openFilter.value = null;
}
const headerRef = ref(null);
// Computed properties
const hasGroups = computed(() => props.columns.some((col) => col.children && col.children.length));
// 🟢 FIX: Updated flatColumns to maintain proper order
const flatColumns = computed(() => {
    const flattened = [];
    props.columns.forEach(col => {
        if (col.children && col.children.length) {
            flattened.push(...col.children);
        }
        else {
            flattened.push(col);
        }
    });
    return flattened;
});
// 🟢 NEW: Check if a column is a child of a grouped column
function isGroupedColumnChild(column) {
    if (!hasGroups.value)
        return true;
    return props.columns.some(parentCol => parentCol.children &&
        parentCol.children.some(child => child.field === column.field));
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.thead, __VLS_elements.thead)({
    ref: "headerRef",
});
/** @type {typeof __VLS_ctx.headerRef} */ ;
// @ts-ignore
[headerRef,];
if (__VLS_ctx.hasGroups) {
    // @ts-ignore
    [hasGroups,];
    __VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({});
    if (__VLS_ctx.expandable) {
        // @ts-ignore
        [expandable,];
        __VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({
            ...{ class: "vs-expand-column" },
            rowspan: "2",
            ...{ style: {} },
            'data-field': "_expand",
        });
    }
    if (__VLS_ctx.isItemSelectedControlled) {
        // @ts-ignore
        [isItemSelectedControlled,];
        __VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({
            ...{ class: "vs-checkbox-column" },
            rowspan: "2",
            ...{ style: {} },
            'data-field': "_checkbox",
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "vs-checkbox" },
        });
        __VLS_asFunctionalElement(__VLS_elements.input)({
            ...{ onChange: (__VLS_ctx.toggleAll) },
            type: "checkbox",
            id: (__VLS_ctx.tablename + '-main-checkbox'),
            checked: (__VLS_ctx.isAllChecked),
            indeterminate: (__VLS_ctx.isSomeChecked),
        });
        // @ts-ignore
        [toggleAll, tablename, isAllChecked, isSomeChecked,];
        __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
            for: (__VLS_ctx.tablename + '-main-checkbox'),
        });
        // @ts-ignore
        [tablename,];
    }
    for (const [column] of __VLS_getVForSourceType((props.columns))) {
        (column.field || column.label);
        if (!column.children || !column.children.length) {
            /** @type {[typeof HeaderCell, typeof HeaderCell, ]} */ ;
            // @ts-ignore
            const __VLS_0 = __VLS_asFunctionalComponent(HeaderCell, new HeaderCell({
                ...{ 'onApplyFilter': {} },
                ...{ 'onClearFilter': {} },
                ...{ 'onOpenFilter': {} },
                ...{ 'onCloseFilter': {} },
                ...{ 'onUpdate:filters': {} },
                column: (column),
                rows: (__VLS_ctx.rows),
                rowspan: (2),
                sortHelpers: (__VLS_ctx.sortHelpers),
                filters: (__VLS_ctx.localFilters),
                openFilter: (__VLS_ctx.openFilter),
                headerClass: (__VLS_ctx.headerClass),
                tablename: (__VLS_ctx.tablename),
            }));
            const __VLS_1 = __VLS_0({
                ...{ 'onApplyFilter': {} },
                ...{ 'onClearFilter': {} },
                ...{ 'onOpenFilter': {} },
                ...{ 'onCloseFilter': {} },
                ...{ 'onUpdate:filters': {} },
                column: (column),
                rows: (__VLS_ctx.rows),
                rowspan: (2),
                sortHelpers: (__VLS_ctx.sortHelpers),
                filters: (__VLS_ctx.localFilters),
                openFilter: (__VLS_ctx.openFilter),
                headerClass: (__VLS_ctx.headerClass),
                tablename: (__VLS_ctx.tablename),
            }, ...__VLS_functionalComponentArgsRest(__VLS_0));
            let __VLS_3;
            let __VLS_4;
            const __VLS_5 = ({ applyFilter: {} },
                { onApplyFilter: ((field, val) => __VLS_ctx.emit('applyFilter', field, val)) });
            const __VLS_6 = ({ clearFilter: {} },
                { onClearFilter: ((field) => __VLS_ctx.emit('clearFilter', field)) });
            const __VLS_7 = ({ openFilter: {} },
                { onOpenFilter: (__VLS_ctx.handleOpenFilter) });
            const __VLS_8 = ({ closeFilter: {} },
                { onCloseFilter: (__VLS_ctx.handleCloseFilter) });
            const __VLS_9 = ({ 'update:filters': {} },
                { 'onUpdate:filters': ((filters) => __VLS_ctx.emit('update:filters', filters)) });
            const { default: __VLS_10 } = __VLS_2.slots;
            // @ts-ignore
            [tablename, rows, sortHelpers, localFilters, openFilter, headerClass, emit, emit, emit, handleOpenFilter, handleCloseFilter,];
            for (const [_, slotName] of __VLS_getVForSourceType((__VLS_ctx.$slots))) {
                // @ts-ignore
                [$slots,];
                {
                    const { [__VLS_tryAsConstant(slotName)]: __VLS_11 } = __VLS_2.slots;
                    const [slotProps] = __VLS_getSlotParameters(__VLS_11);
                    var __VLS_12 = {
                        ...(slotProps),
                    };
                    var __VLS_13 = __VLS_tryAsConstant(slotName);
                }
            }
            var __VLS_2;
        }
        else {
            __VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({
                colspan: (column.children.length),
                'data-field': (`group-${column.label}`),
                ...{ class: "vs-group-header" },
                ...{ style: ({ textAlign: 'center' }) },
            });
            (column.label);
        }
    }
}
__VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({});
if (__VLS_ctx.expandable && !__VLS_ctx.hasGroups) {
    // @ts-ignore
    [hasGroups, expandable,];
    __VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({
        ...{ class: "vs-expand-column" },
        ...{ style: {} },
        'data-field': "_expand",
    });
}
if (__VLS_ctx.isItemSelectedControlled && !__VLS_ctx.hasGroups) {
    // @ts-ignore
    [hasGroups, isItemSelectedControlled,];
    __VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({
        ...{ class: "vs-checkbox-column" },
        ...{ style: {} },
        'data-field': "_checkbox",
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "vs-checkbox" },
    });
    __VLS_asFunctionalElement(__VLS_elements.input)({
        ...{ onChange: (__VLS_ctx.toggleAll) },
        type: "checkbox",
        id: (__VLS_ctx.tablename + '-main-checkbox'),
        checked: (__VLS_ctx.isAllChecked),
        indeterminate: (__VLS_ctx.isSomeChecked),
    });
    // @ts-ignore
    [toggleAll, tablename, isAllChecked, isSomeChecked,];
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
        for: (__VLS_ctx.tablename + '-main-checkbox'),
    });
    // @ts-ignore
    [tablename,];
}
for (const [column] of __VLS_getVForSourceType((__VLS_ctx.flatColumns))) {
    (column.field);
    // @ts-ignore
    [flatColumns,];
    if (column.field && __VLS_ctx.isGroupedColumnChild(column)) {
        // @ts-ignore
        [isGroupedColumnChild,];
        /** @type {[typeof HeaderCell, typeof HeaderCell, ]} */ ;
        // @ts-ignore
        const __VLS_16 = __VLS_asFunctionalComponent(HeaderCell, new HeaderCell({
            ...{ 'onApplyFilter': {} },
            ...{ 'onClearFilter': {} },
            ...{ 'onOpenFilter': {} },
            ...{ 'onCloseFilter': {} },
            ...{ 'onUpdate:filters': {} },
            column: (column),
            rows: (__VLS_ctx.rows),
            sortHelpers: (__VLS_ctx.sortHelpers),
            filters: (__VLS_ctx.localFilters),
            openFilter: (__VLS_ctx.openFilter),
            headerClass: (__VLS_ctx.headerClass),
            tablename: (__VLS_ctx.tablename),
        }));
        const __VLS_17 = __VLS_16({
            ...{ 'onApplyFilter': {} },
            ...{ 'onClearFilter': {} },
            ...{ 'onOpenFilter': {} },
            ...{ 'onCloseFilter': {} },
            ...{ 'onUpdate:filters': {} },
            column: (column),
            rows: (__VLS_ctx.rows),
            sortHelpers: (__VLS_ctx.sortHelpers),
            filters: (__VLS_ctx.localFilters),
            openFilter: (__VLS_ctx.openFilter),
            headerClass: (__VLS_ctx.headerClass),
            tablename: (__VLS_ctx.tablename),
        }, ...__VLS_functionalComponentArgsRest(__VLS_16));
        let __VLS_19;
        let __VLS_20;
        const __VLS_21 = ({ applyFilter: {} },
            { onApplyFilter: ((field, val) => __VLS_ctx.emit('applyFilter', field, val)) });
        const __VLS_22 = ({ clearFilter: {} },
            { onClearFilter: ((field) => __VLS_ctx.emit('clearFilter', field)) });
        const __VLS_23 = ({ openFilter: {} },
            { onOpenFilter: (__VLS_ctx.handleOpenFilter) });
        const __VLS_24 = ({ closeFilter: {} },
            { onCloseFilter: (__VLS_ctx.handleCloseFilter) });
        const __VLS_25 = ({ 'update:filters': {} },
            { 'onUpdate:filters': ((filters) => __VLS_ctx.emit('update:filters', filters)) });
        const { default: __VLS_26 } = __VLS_18.slots;
        // @ts-ignore
        [tablename, rows, sortHelpers, localFilters, openFilter, headerClass, emit, emit, emit, handleOpenFilter, handleCloseFilter,];
        for (const [_, slotName] of __VLS_getVForSourceType((__VLS_ctx.$slots))) {
            // @ts-ignore
            [$slots,];
            {
                const { [__VLS_tryAsConstant(slotName)]: __VLS_27 } = __VLS_18.slots;
                const [slotProps] = __VLS_getSlotParameters(__VLS_27);
                var __VLS_28 = {
                    ...(slotProps),
                };
                var __VLS_29 = __VLS_tryAsConstant(slotName);
            }
        }
        var __VLS_18;
    }
}
/** @type {__VLS_StyleScopedClasses['vs-expand-column']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-checkbox-column']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-checkbox']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-group-header']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-expand-column']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-checkbox-column']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-checkbox']} */ ;
// @ts-ignore
var __VLS_14 = __VLS_13, __VLS_15 = __VLS_12, __VLS_30 = __VLS_29, __VLS_31 = __VLS_28;
[__VLS_dollars.$attrs, __VLS_dollars.$attrs,];
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        HeaderCell: HeaderCell,
        emit: emit,
        toggleAll: toggleAll,
        localFilters: localFilters,
        openFilter: openFilter,
        handleOpenFilter: handleOpenFilter,
        handleCloseFilter: handleCloseFilter,
        headerRef: headerRef,
        hasGroups: hasGroups,
        flatColumns: flatColumns,
        isGroupedColumnChild: isGroupedColumnChild,
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
