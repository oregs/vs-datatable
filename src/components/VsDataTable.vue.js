/// <reference types="C:/Users/SegunOregunwa/Documents/OregsThings/dependency-projects/vs-datatable/node_modules/.vue-global-types/vue_3.5_0.d.ts" />
import { computed, defineProps, defineEmits, withDefaults, useAttrs, onMounted, onUnmounted, onBeforeMount, shallowRef, watch, ref, nextTick, } from 'vue';
import VsPagination from '@/components/VsPagination.vue';
import VsRowsPerPage from './VsRowsPerPage.vue';
import VsDataTableHeader from './VsDataTableHeader.vue';
import VsDataTableBody from '@/components/VsDataTableBody.vue';
import VsDataTableToolbar from '@/components/VsDataTableToolbar.vue';
import VsDataTableFooter from '@/components/VsDataTableFooter.vue';
import { useDataTable } from '@/composables/useDataTable';
import { useDataTableSelection } from '@/composables/useDataTableSelection';
import { getValue, getRowKey, isRowSelected, calculateTotalColumns } from '@/utils/datatable';
import { useStickyColumns } from '@/composables/useStickyColumns';
import { useStickyResizeSync } from '@/composables/useStickyResizeSync';
const props = withDefaults(defineProps(), {
    rows: () => [],
    itemSelected: null,
    tablename: 'default-table',
    serverOptions: null,
    showHeader: true,
    showSearch: true,
    headerText: '',
    loading: false,
    showFooter: true,
    searchPlaceholder: 'Search...',
    loadingText: 'Loading...',
    noDataText: 'No data available',
    noDataDescription: 'Try adjusting your search criteria',
    entriesText: 'entries',
    maxVisiblePages: 5,
    rowsPerPage: 10,
    rowKey: 'id',
    stickyHeader: false,
    stickyFooter: false,
    showPagination: true
});
const internalRows = shallowRef(props.rows);
watch(() => props.rows, (newVal) => {
    internalRows.value = newVal;
}, { deep: false });
const emit = defineEmits();
// Component setup
const attrs = useAttrs();
const hasRowClick = computed(() => !!attrs['onRowClick']);
const headerRef = ref();
const bodyRef = ref();
// Use composables
const { page, rowsPerPage, totalRecords, recordRange, handlePageChange, handleRowsPerPage, paginatedRows, sortHelpers, searchQuery, onInputTyped, isRowExpanded, getRowId, toggleRowExpansion, setRowLoading, isRowLoading, filters, setFilter, clearFilter, tableRef, tableContainer, tableResponsiveRef, refresh, cleanup, } = useDataTable(props, emit, { header: props.stickyHeader, footer: props.stickyFooter }, internalRows);
const { selectedItems, isItemSelectedControlled, isAllChecked, isSomeChecked, toggleAll, toggleRow, } = useDataTableSelection(props, emit);
// Computed properties
const totalColumns = computed(() => calculateTotalColumns(props.columns, isItemSelectedControlled.value, props.expandable));
// const hasLeftShadow = ref(false)
// const hasRightShadow = ref(false)  
// const refreshSticky = () => {}
// Use sticky columns on the main table
const { hasLeftShadow, hasRightShadow, refreshSticky } = useStickyColumns(tableRef, computed(() => props.columns));
useStickyResizeSync(tableRef, refreshSticky);
// Refresh sticky when rows change (for dynamic content)
watch(() => paginatedRows.value, () => {
    nextTick(() => {
        refreshSticky();
    });
}, { deep: true });
// Refresh sticky when columns change
watch(() => props.columns, () => {
    nextTick(() => {
        refreshSticky();
    });
}, { deep: true });
// Expose
const __VLS_exposed = {
    toggleRowExpansion,
    setRowLoading,
    refreshSticky,
};
defineExpose(__VLS_exposed);
// Lifecycle hooks
onMounted(async () => {
    setTimeout(() => {
        refreshSticky();
    }, 100);
    await nextTick();
    refresh();
    emit('tableMounted');
    try {
        emit('dataLoaded', props.rows);
    }
    catch (err) {
        emit('dataError', err);
    }
});
onUnmounted(() => {
    emit('tableUnmounted');
});
onBeforeMount(() => {
    emit('tableBeforeMount');
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    rows: () => [],
    itemSelected: null,
    tablename: 'default-table',
    serverOptions: null,
    showHeader: true,
    showSearch: true,
    headerText: '',
    loading: false,
    showFooter: true,
    searchPlaceholder: 'Search...',
    loadingText: 'Loading...',
    noDataText: 'No data available',
    noDataDescription: 'Try adjusting your search criteria',
    entriesText: 'entries',
    maxVisiblePages: 5,
    rowsPerPage: 10,
    rowKey: 'id',
    stickyHeader: false,
    stickyFooter: false,
    showPagination: true
});
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "vs-datatable" },
});
/** @type {[typeof VsDataTableToolbar, typeof VsDataTableToolbar, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(VsDataTableToolbar, new VsDataTableToolbar({
    ...{ 'onSearch': {} },
    showSearch: (__VLS_ctx.showSearch),
    searchQuery: (__VLS_ctx.searchQuery),
    searchPlaceholder: (__VLS_ctx.searchPlaceholder),
    searchClass: (__VLS_ctx.searchClass),
}));
const __VLS_1 = __VLS_0({
    ...{ 'onSearch': {} },
    showSearch: (__VLS_ctx.showSearch),
    searchQuery: (__VLS_ctx.searchQuery),
    searchPlaceholder: (__VLS_ctx.searchPlaceholder),
    searchClass: (__VLS_ctx.searchClass),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
const __VLS_5 = ({ search: {} },
    { onSearch: (__VLS_ctx.onInputTyped) });
const { default: __VLS_6 } = __VLS_2.slots;
// @ts-ignore
[showSearch, searchQuery, searchPlaceholder, searchClass, onInputTyped,];
{
    const { left: __VLS_7 } = __VLS_2.slots;
    var __VLS_8 = {};
}
{
    const { right: __VLS_10 } = __VLS_2.slots;
    var __VLS_11 = {};
}
var __VLS_2;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ref: "tableContainer",
    ...{ class: "vs-table-container vs-position-relative vs-overflow-auto" },
    ...{ class: ([
            __VLS_ctx.containerClass,
            {
                'has-left-shadow': __VLS_ctx.hasLeftShadow,
                'has-right-shadow': __VLS_ctx.hasRightShadow,
            },
        ]) },
});
/** @type {typeof __VLS_ctx.tableContainer} */ ;
// @ts-ignore
[containerClass, hasLeftShadow, hasRightShadow, tableContainer,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ref: "tableResponsiveRef",
    ...{ class: "vs-table-wrapper" },
    ...{ class: ({ 'vs-sticky-header-wrapper': __VLS_ctx.stickyHeader }) },
});
/** @type {typeof __VLS_ctx.tableResponsiveRef} */ ;
// @ts-ignore
[stickyHeader, tableResponsiveRef,];
__VLS_asFunctionalElement(__VLS_elements.table, __VLS_elements.table)({
    ref: "tableRef",
    ...{ class: "vs-table" },
    ...{ class: (__VLS_ctx.tableClass) },
});
/** @type {typeof __VLS_ctx.tableRef} */ ;
// @ts-ignore
[tableClass, tableRef,];
/** @type {[typeof VsDataTableHeader, typeof VsDataTableHeader, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(VsDataTableHeader, new VsDataTableHeader({
    ...{ 'onToggleAll': {} },
    ...{ 'onApplyFilter': {} },
    ...{ 'onClearFilter': {} },
    ref: "headerRef",
    columns: (__VLS_ctx.columns),
    expandable: (__VLS_ctx.expandable),
    isItemSelectedControlled: (__VLS_ctx.isItemSelectedControlled),
    isAllChecked: (__VLS_ctx.isAllChecked),
    isSomeChecked: (__VLS_ctx.isSomeChecked),
    tablename: (__VLS_ctx.tablename),
    sortHelpers: (__VLS_ctx.sortHelpers),
    filters: (__VLS_ctx.filters),
    rows: (__VLS_ctx.rows),
    headerClass: (__VLS_ctx.headerClass),
}));
const __VLS_14 = __VLS_13({
    ...{ 'onToggleAll': {} },
    ...{ 'onApplyFilter': {} },
    ...{ 'onClearFilter': {} },
    ref: "headerRef",
    columns: (__VLS_ctx.columns),
    expandable: (__VLS_ctx.expandable),
    isItemSelectedControlled: (__VLS_ctx.isItemSelectedControlled),
    isAllChecked: (__VLS_ctx.isAllChecked),
    isSomeChecked: (__VLS_ctx.isSomeChecked),
    tablename: (__VLS_ctx.tablename),
    sortHelpers: (__VLS_ctx.sortHelpers),
    filters: (__VLS_ctx.filters),
    rows: (__VLS_ctx.rows),
    headerClass: (__VLS_ctx.headerClass),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
let __VLS_16;
let __VLS_17;
const __VLS_18 = ({ toggleAll: {} },
    { onToggleAll: (__VLS_ctx.toggleAll) });
const __VLS_19 = ({ applyFilter: {} },
    { onApplyFilter: ((field, val) => { __VLS_ctx.setFilter(field, val); __VLS_ctx.page = 1; }) });
const __VLS_20 = ({ clearFilter: {} },
    { onClearFilter: ((field) => { __VLS_ctx.clearFilter(field); __VLS_ctx.page = 1; }) });
/** @type {typeof __VLS_ctx.headerRef} */ ;
var __VLS_21 = {};
const { default: __VLS_23 } = __VLS_15.slots;
// @ts-ignore
[columns, expandable, isItemSelectedControlled, isAllChecked, isSomeChecked, tablename, sortHelpers, filters, rows, headerClass, toggleAll, setFilter, page, page, clearFilter, headerRef,];
for (const [_, name] of __VLS_getVForSourceType((__VLS_ctx.$slots))) {
    // @ts-ignore
    [$slots,];
    {
        const { [__VLS_tryAsConstant(name)]: __VLS_24 } = __VLS_15.slots;
        const [slotProps] = __VLS_getSlotParameters(__VLS_24);
        var __VLS_25 = {
            ...(slotProps),
        };
        var __VLS_26 = __VLS_tryAsConstant(name);
    }
}
var __VLS_15;
/** @type {[typeof VsDataTableBody, typeof VsDataTableBody, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(VsDataTableBody, new VsDataTableBody({
    ...{ 'onRowClick': {} },
    ref: "bodyRef",
    loading: (__VLS_ctx.loading),
    loadingText: (__VLS_ctx.loadingText),
    noDataText: (__VLS_ctx.noDataText),
    noDataDescription: (__VLS_ctx.noDataDescription),
    paginatedRows: (__VLS_ctx.paginatedRows),
    totalColumns: (__VLS_ctx.totalColumns),
    expandable: (__VLS_ctx.expandable),
    isItemSelectedControlled: (__VLS_ctx.isItemSelectedControlled),
    selectedItems: (__VLS_ctx.selectedItems),
    tablename: (__VLS_ctx.tablename),
    columns: (__VLS_ctx.columns),
    rowKey: (__VLS_ctx.rowKey),
    rowClass: (__VLS_ctx.rowClass),
    cellClass: (__VLS_ctx.cellClass),
    hasRowClick: (__VLS_ctx.hasRowClick),
    getRowKey: (__VLS_ctx.getRowKey),
    getValue: (__VLS_ctx.getValue),
    isRowExpanded: (__VLS_ctx.isRowExpanded),
    isRowLoading: (__VLS_ctx.isRowLoading),
    toggleRowExpansion: (__VLS_ctx.toggleRowExpansion),
    toggleRow: (__VLS_ctx.toggleRow),
    isRowSelected: (__VLS_ctx.isRowSelected),
}));
const __VLS_30 = __VLS_29({
    ...{ 'onRowClick': {} },
    ref: "bodyRef",
    loading: (__VLS_ctx.loading),
    loadingText: (__VLS_ctx.loadingText),
    noDataText: (__VLS_ctx.noDataText),
    noDataDescription: (__VLS_ctx.noDataDescription),
    paginatedRows: (__VLS_ctx.paginatedRows),
    totalColumns: (__VLS_ctx.totalColumns),
    expandable: (__VLS_ctx.expandable),
    isItemSelectedControlled: (__VLS_ctx.isItemSelectedControlled),
    selectedItems: (__VLS_ctx.selectedItems),
    tablename: (__VLS_ctx.tablename),
    columns: (__VLS_ctx.columns),
    rowKey: (__VLS_ctx.rowKey),
    rowClass: (__VLS_ctx.rowClass),
    cellClass: (__VLS_ctx.cellClass),
    hasRowClick: (__VLS_ctx.hasRowClick),
    getRowKey: (__VLS_ctx.getRowKey),
    getValue: (__VLS_ctx.getValue),
    isRowExpanded: (__VLS_ctx.isRowExpanded),
    isRowLoading: (__VLS_ctx.isRowLoading),
    toggleRowExpansion: (__VLS_ctx.toggleRowExpansion),
    toggleRow: (__VLS_ctx.toggleRow),
    isRowSelected: (__VLS_ctx.isRowSelected),
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
let __VLS_32;
let __VLS_33;
const __VLS_34 = ({ rowClick: {} },
    { onRowClick: ((item, index) => __VLS_ctx.$emit('rowClick', item, index)) });
/** @type {typeof __VLS_ctx.bodyRef} */ ;
var __VLS_35 = {};
const { default: __VLS_37 } = __VLS_31.slots;
// @ts-ignore
[columns, expandable, isItemSelectedControlled, tablename, loading, loadingText, noDataText, noDataDescription, paginatedRows, totalColumns, selectedItems, rowKey, rowClass, cellClass, hasRowClick, getRowKey, getValue, isRowExpanded, isRowLoading, toggleRowExpansion, toggleRow, isRowSelected, $emit, bodyRef,];
for (const [_, name] of __VLS_getVForSourceType((__VLS_ctx.$slots))) {
    // @ts-ignore
    [$slots,];
    {
        const { [__VLS_tryAsConstant(name)]: __VLS_38 } = __VLS_31.slots;
        const [slotProps] = __VLS_getSlotParameters(__VLS_38);
        var __VLS_39 = {
            ...(slotProps),
        };
        var __VLS_40 = __VLS_tryAsConstant(name);
    }
}
var __VLS_31;
if (__VLS_ctx.showFooter) {
    // @ts-ignore
    [showFooter,];
    /** @type {[typeof VsDataTableFooter, ]} */ ;
    // @ts-ignore
    const __VLS_43 = __VLS_asFunctionalComponent(VsDataTableFooter, new VsDataTableFooter({
        columns: (__VLS_ctx.columns),
        rows: (__VLS_ctx.paginatedRows),
        expandable: (__VLS_ctx.expandable),
        isItemSelectedControlled: (__VLS_ctx.isItemSelectedControlled),
    }));
    const __VLS_44 = __VLS_43({
        columns: (__VLS_ctx.columns),
        rows: (__VLS_ctx.paginatedRows),
        expandable: (__VLS_ctx.expandable),
        isItemSelectedControlled: (__VLS_ctx.isItemSelectedControlled),
    }, ...__VLS_functionalComponentArgsRest(__VLS_43));
    // @ts-ignore
    [columns, expandable, isItemSelectedControlled, paginatedRows,];
}
if (__VLS_ctx.showPagination) {
    // @ts-ignore
    [showPagination,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "vs-table-pagination" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "vs-pagination-left" },
    });
    /** @type {[typeof VsRowsPerPage, ]} */ ;
    // @ts-ignore
    const __VLS_47 = __VLS_asFunctionalComponent(VsRowsPerPage, new VsRowsPerPage({
        ...{ 'onRowsPerPageChanged': {} },
        modelValue: (__VLS_ctx.rowsPerPage),
    }));
    const __VLS_48 = __VLS_47({
        ...{ 'onRowsPerPageChanged': {} },
        modelValue: (__VLS_ctx.rowsPerPage),
    }, ...__VLS_functionalComponentArgsRest(__VLS_47));
    let __VLS_50;
    let __VLS_51;
    const __VLS_52 = ({ rowsPerPageChanged: {} },
        { onRowsPerPageChanged: (__VLS_ctx.handleRowsPerPage) });
    // @ts-ignore
    [rowsPerPage, handleRowsPerPage,];
    var __VLS_49;
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "vs-divider" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "vs-table-info" },
    });
    (__VLS_ctx.recordRange.start < 1 ? 0 : __VLS_ctx.recordRange.start);
    (__VLS_ctx.recordRange.end);
    (__VLS_ctx.totalRecords);
    (__VLS_ctx.entriesText);
    // @ts-ignore
    [recordRange, recordRange, recordRange, totalRecords, entriesText,];
    /** @type {[typeof VsPagination, ]} */ ;
    // @ts-ignore
    const __VLS_54 = __VLS_asFunctionalComponent(VsPagination, new VsPagination({
        ...{ 'onPageChanged': {} },
        modelValue: (__VLS_ctx.page),
        totalRecords: (__VLS_ctx.totalRecords),
        rowsPerPage: (__VLS_ctx.rowsPerPage),
        maxVisible: (__VLS_ctx.maxVisiblePages),
        tablename: (__VLS_ctx.tablename),
        ...{ class: (__VLS_ctx.paginationClass) },
    }));
    const __VLS_55 = __VLS_54({
        ...{ 'onPageChanged': {} },
        modelValue: (__VLS_ctx.page),
        totalRecords: (__VLS_ctx.totalRecords),
        rowsPerPage: (__VLS_ctx.rowsPerPage),
        maxVisible: (__VLS_ctx.maxVisiblePages),
        tablename: (__VLS_ctx.tablename),
        ...{ class: (__VLS_ctx.paginationClass) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_54));
    let __VLS_57;
    let __VLS_58;
    const __VLS_59 = ({ pageChanged: {} },
        { onPageChanged: (__VLS_ctx.handlePageChange) });
    // @ts-ignore
    [tablename, page, rowsPerPage, totalRecords, maxVisiblePages, paginationClass, handlePageChange,];
    var __VLS_56;
}
/** @type {__VLS_StyleScopedClasses['vs-datatable']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-table-container']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-position-relative']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-overflow-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['has-left-shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['has-right-shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-table-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-sticky-header-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-table']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-table-pagination']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-pagination-left']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-divider']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-table-info']} */ ;
// @ts-ignore
var __VLS_9 = __VLS_8, __VLS_12 = __VLS_11, __VLS_22 = __VLS_21, __VLS_27 = __VLS_26, __VLS_28 = __VLS_25, __VLS_36 = __VLS_35, __VLS_41 = __VLS_40, __VLS_42 = __VLS_39;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        VsPagination: VsPagination,
        VsRowsPerPage: VsRowsPerPage,
        VsDataTableHeader: VsDataTableHeader,
        VsDataTableBody: VsDataTableBody,
        VsDataTableToolbar: VsDataTableToolbar,
        VsDataTableFooter: VsDataTableFooter,
        getValue: getValue,
        getRowKey: getRowKey,
        isRowSelected: isRowSelected,
        hasRowClick: hasRowClick,
        headerRef: headerRef,
        bodyRef: bodyRef,
        page: page,
        rowsPerPage: rowsPerPage,
        totalRecords: totalRecords,
        recordRange: recordRange,
        handlePageChange: handlePageChange,
        handleRowsPerPage: handleRowsPerPage,
        paginatedRows: paginatedRows,
        sortHelpers: sortHelpers,
        searchQuery: searchQuery,
        onInputTyped: onInputTyped,
        isRowExpanded: isRowExpanded,
        toggleRowExpansion: toggleRowExpansion,
        isRowLoading: isRowLoading,
        filters: filters,
        setFilter: setFilter,
        clearFilter: clearFilter,
        tableRef: tableRef,
        tableContainer: tableContainer,
        tableResponsiveRef: tableResponsiveRef,
        selectedItems: selectedItems,
        isItemSelectedControlled: isItemSelectedControlled,
        isAllChecked: isAllChecked,
        isSomeChecked: isSomeChecked,
        toggleAll: toggleAll,
        toggleRow: toggleRow,
        totalColumns: totalColumns,
        hasLeftShadow: hasLeftShadow,
        hasRightShadow: hasRightShadow,
    }),
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
const __VLS_component = (await import('vue')).defineComponent({
    setup: () => (__VLS_exposed),
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
