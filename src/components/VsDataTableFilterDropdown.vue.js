/// <reference types="C:/Users/SegunOregunwa/Documents/OregsThings/dependency-projects/vs-datatable/node_modules/.vue-global-types/vue_3.5_0.d.ts" />
import { ref, watch, onMounted, onUnmounted, nextTick, computed } from 'vue';
import { computePosition, autoUpdate, flip, offset, shift } from '@floating-ui/dom';
import { initFilter, hasValue } from '@/utils/filters';
import VsDFlex from '@/components/layout/VsDFlex.vue';
import '@/styles/vs-layout.css';
import VsMultiSelect from '@/components/ui/VsMultiSelect.vue';
import { useAsyncOption } from '@/composables/useAsyncOption';
const props = withDefaults(defineProps(), {
    columnData: () => [],
});
const emit = defineEmits();
const { columnOrAsyncOptions, isLoading, clearCache, loadAsyncOptions } = useAsyncOption({
    asyncOptions: props.asyncOptions,
    columnData: props.columnData,
    cacheKey: props.field,
});
// default operators per type
const defaultOperators = {
    text: [
        'contains',
        'doesNotContains',
        'equals',
        'doesNotEqual',
        'startsWith',
        'endsWith',
        'empty',
        'notEmpty',
    ],
    'multi-select': [],
    'number-range': ['between', 'equals', 'notEqual', 'greaterThan', 'lessThan', 'empty', 'notEmpty'],
    'date-range': ['between', 'equals', 'notEqual', 'before', 'after', 'empty', 'notEmpty'],
    custom: [],
};
function formatOperator(op) {
    switch (op) {
        case 'notEqual':
            return 'Not Equal';
        case 'greaterThan':
            return 'Greater Than';
        case 'lessThan':
            return 'Less Than';
        case 'doesNotContains':
            return 'Does Not Contain';
        case 'doesNotEqual':
            return 'Does Not Equal';
        case 'startsWith':
            return 'Starts With';
        case 'endsWith':
            return 'Ends With';
        case 'notEmpty':
            return 'Not Empty';
        default:
            return op.charAt(0).toUpperCase() + op.slice(1);
    }
}
// pick operators
const availableOperators = computed(() => {
    if (props.type === 'custom')
        return [];
    return props.operators?.length ? props.operators : defaultOperators[props.type];
});
// refs for floating-ui
const referenceRef = ref(null);
const floatingRef = ref(null);
const cleanup = ref();
const isOpen = ref(false);
// Watch open state
watch(() => props.visible, async (val) => {
    isOpen.value = !!val;
    if (isOpen.value) {
        await nextTick();
        startPositioning();
        if (props.asyncOptions) {
            loadAsyncOptions();
        }
    }
    else {
        stopPositioning();
    }
}, { immediate: true });
// Local filter state
const localFilter = ref(initFilter(props.type, props.modelValue));
watch(() => props.modelValue, (newVal) => {
    localFilter.value = initFilter(props.type, newVal);
}, { immediate: true });
function toggleDropdown() {
    emit('open');
}
// Apply / Clear actions
function applyFilter() {
    emit('update:modelValue', { ...localFilter.value });
    emit('apply', { ...localFilter.value });
}
function clearFilter() {
    localFilter.value = initFilter(props.type);
    emit('update:modelValue', { ...localFilter.value });
    emit('clear');
    closeDropdown();
}
function closeDropdown() {
    emit('close');
}
// Floating-ui positioning
function startPositioning() {
    if (!referenceRef.value || !floatingRef.value)
        return;
    cleanup.value = autoUpdate(referenceRef.value, floatingRef.value, () => {
        computePosition(referenceRef.value, floatingRef.value, {
            placement: 'bottom-start',
            middleware: [offset(6), flip(), shift({ padding: 8 })],
        }).then(({ x, y }) => {
            Object.assign(floatingRef.value.style, {
                left: `${x}px`,
                top: `${y}px`,
                position: 'absolute',
                zIndex: 2000,
            });
        });
    });
}
function stopPositioning() {
    cleanup.value?.();
    cleanup.value = undefined;
}
// Click outside & Escape
function onClickOutside(e) {
    const target = e.target;
    if (isOpen.value &&
        referenceRef.value &&
        floatingRef.value &&
        !referenceRef.value.contains(target) &&
        !floatingRef.value.contains(target)) {
        closeDropdown();
    }
}
function onEscapeKey(e) {
    if (e.key === 'Escape' && isOpen.value) {
        closeDropdown();
    }
}
onMounted(() => {
    document.addEventListener('click', onClickOutside);
    document.addEventListener('keydown', onEscapeKey);
});
onUnmounted(() => {
    document.removeEventListener('click', onClickOutside);
    document.removeEventListener('keydown', onEscapeKey);
    stopPositioning();
});
/* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    columnData: () => [],
});
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ onClick: (__VLS_ctx.toggleDropdown) },
    ref: "referenceRef",
    ...{ class: "vs-column-filter" },
    ...{ class: ({
            'is-active': __VLS_ctx.hasValue(__VLS_ctx.localFilter),
            'in-active': !__VLS_ctx.hasValue(__VLS_ctx.localFilter),
        }) },
});
/** @type {typeof __VLS_ctx.referenceRef} */ ;
// @ts-ignore
[toggleDropdown, hasValue, hasValue, localFilter, localFilter, referenceRef,];
__VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
    xmlns: "http://www.w3.org/2000/svg",
    height: "24px",
    viewBox: "0 -960 960 960",
    width: "24px",
    fill: "currentColor",
});
__VLS_asFunctionalElement(__VLS_elements.path)({
    d: "M400-240v-80h160v80H400ZM240-440v-80h480v80H240ZM120-640v-80h720v80H120Z",
});
const __VLS_0 = {}.teleport;
/** @type {[typeof __VLS_components.Teleport, typeof __VLS_components.teleport, typeof __VLS_components.Teleport, typeof __VLS_components.teleport, ]} */ ;
// @ts-ignore
Teleport;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "body",
}));
const __VLS_2 = __VLS_1({
    to: "body",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_4 } = __VLS_3.slots;
const __VLS_5 = {}.transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
// @ts-ignore
Transition;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    name: "fade",
}));
const __VLS_7 = __VLS_6({
    name: "fade",
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
const { default: __VLS_9 } = __VLS_8.slots;
if (__VLS_ctx.isOpen) {
    // @ts-ignore
    [isOpen,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ onClick: () => { } },
        ref: "floatingRef",
        ...{ class: "vs-filter-dropdown" },
        ...{ style: {} },
    });
    /** @type {typeof __VLS_ctx.floatingRef} */ ;
    // @ts-ignore
    [floatingRef,];
    if (__VLS_ctx.localFilter.type === 'text') {
        // @ts-ignore
        [localFilter,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "vs-filter-text" },
        });
        if (__VLS_ctx.availableOperators.length > 1) {
            // @ts-ignore
            [availableOperators,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "vs-pb-sm" },
            });
            __VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)({
                value: (__VLS_ctx.localFilter.operator),
                ...{ class: "vs-operator-select vs-mx-auto vs-w-full" },
            });
            // @ts-ignore
            [localFilter,];
            for (const [op] of __VLS_getVForSourceType((__VLS_ctx.availableOperators))) {
                // @ts-ignore
                [availableOperators,];
                __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
                    key: (op),
                    value: (op),
                });
                (__VLS_ctx.formatOperator(op));
                // @ts-ignore
                [formatOperator,];
            }
        }
        /** @type {[typeof VsDFlex, typeof VsDFlex, ]} */ ;
        // @ts-ignore
        const __VLS_10 = __VLS_asFunctionalComponent(VsDFlex, new VsDFlex({
            direction: "row",
            ...{ class: "mb-6" },
        }));
        const __VLS_11 = __VLS_10({
            direction: "row",
            ...{ class: "mb-6" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_10));
        const { default: __VLS_13 } = __VLS_12.slots;
        __VLS_asFunctionalElement(__VLS_elements.input)({
            type: "text",
            value: (__VLS_ctx.localFilter.value),
            placeholder: "Search...",
            ...{ class: "vs-input vs-mx-auto vs-w-full" },
        });
        // @ts-ignore
        [localFilter,];
        var __VLS_12;
    }
    else if (__VLS_ctx.localFilter.type === 'multi-select') {
        // @ts-ignore
        [localFilter,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "vs-filter-multi" },
        });
        /** @type {[typeof VsDFlex, typeof VsDFlex, ]} */ ;
        // @ts-ignore
        const __VLS_14 = __VLS_asFunctionalComponent(VsDFlex, new VsDFlex({
            direction: "row",
            ...{ class: "mb-6 vs-align-center vs-justify-end" },
        }));
        const __VLS_15 = __VLS_14({
            direction: "row",
            ...{ class: "mb-6 vs-align-center vs-justify-end" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_14));
        const { default: __VLS_17 } = __VLS_16.slots;
        if (__VLS_ctx.asyncOptions) {
            // @ts-ignore
            [asyncOptions,];
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.isOpen))
                            return;
                        if (!!(__VLS_ctx.localFilter.type === 'text'))
                            return;
                        if (!(__VLS_ctx.localFilter.type === 'multi-select'))
                            return;
                        if (!(__VLS_ctx.asyncOptions))
                            return;
                        __VLS_ctx.loadAsyncOptions(true);
                        // @ts-ignore
                        [loadAsyncOptions,];
                    } },
                ...{ class: "vs-cursor-pointer" },
            });
            __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
                xmlns: "http://www.w3.org/2000/svg",
                height: "24px",
                viewBox: "0 -960 960 960",
                width: "24px",
                fill: "var(--vs-inactive)",
            });
            __VLS_asFunctionalElement(__VLS_elements.path)({
                d: "M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z",
            });
        }
        var __VLS_16;
        /** @type {[typeof VsMultiSelect, ]} */ ;
        // @ts-ignore
        const __VLS_18 = __VLS_asFunctionalComponent(VsMultiSelect, new VsMultiSelect({
            isLoading: (__VLS_ctx.isLoading),
            columnData: (__VLS_ctx.columnOrAsyncOptions),
            modelValue: (__VLS_ctx.localFilter.value),
            placeholder: "Select values...",
        }));
        const __VLS_19 = __VLS_18({
            isLoading: (__VLS_ctx.isLoading),
            columnData: (__VLS_ctx.columnOrAsyncOptions),
            modelValue: (__VLS_ctx.localFilter.value),
            placeholder: "Select values...",
        }, ...__VLS_functionalComponentArgsRest(__VLS_18));
        // @ts-ignore
        [localFilter, isLoading, columnOrAsyncOptions,];
    }
    else if (__VLS_ctx.localFilter.type === 'number-range') {
        // @ts-ignore
        [localFilter,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "vs-filter-range" },
        });
        if (__VLS_ctx.availableOperators.length > 1) {
            // @ts-ignore
            [availableOperators,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "vs-pb-sm" },
            });
            __VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)({
                value: (__VLS_ctx.localFilter.operator),
                ...{ class: "vs-operator-select vs-w-full" },
            });
            // @ts-ignore
            [localFilter,];
            for (const [op] of __VLS_getVForSourceType((__VLS_ctx.availableOperators))) {
                // @ts-ignore
                [availableOperators,];
                __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
                    key: (op),
                    value: (op),
                });
                (__VLS_ctx.formatOperator(op));
                // @ts-ignore
                [formatOperator,];
            }
        }
        else {
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
                ...{ class: "vs-operator-fixed" },
            });
            (__VLS_ctx.localFilter.operator);
            // @ts-ignore
            [localFilter,];
        }
        if (__VLS_ctx.localFilter.operator === 'between') {
            // @ts-ignore
            [localFilter,];
            /** @type {[typeof VsDFlex, typeof VsDFlex, ]} */ ;
            // @ts-ignore
            const __VLS_22 = __VLS_asFunctionalComponent(VsDFlex, new VsDFlex({
                justify: "between",
                align: "center",
                gap: "4",
                ...{ class: "mb-6" },
            }));
            const __VLS_23 = __VLS_22({
                justify: "between",
                align: "center",
                gap: "4",
                ...{ class: "mb-6" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_22));
            const { default: __VLS_25 } = __VLS_24.slots;
            __VLS_asFunctionalElement(__VLS_elements.input)({
                type: "number",
                placeholder: "Min",
                ...{ class: "vs-input vs-w-full" },
            });
            (__VLS_ctx.localFilter.min);
            // @ts-ignore
            [localFilter,];
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
            __VLS_asFunctionalElement(__VLS_elements.input)({
                type: "number",
                placeholder: "Max",
                ...{ class: "vs-input vs-w-full" },
            });
            (__VLS_ctx.localFilter.max);
            // @ts-ignore
            [localFilter,];
            var __VLS_24;
        }
        else if (['equals', 'notEqual', 'greaterThan', 'lessThan'].includes(__VLS_ctx.localFilter.operator || '')) {
            // @ts-ignore
            [localFilter,];
            /** @type {[typeof VsDFlex, typeof VsDFlex, ]} */ ;
            // @ts-ignore
            const __VLS_26 = __VLS_asFunctionalComponent(VsDFlex, new VsDFlex({
                direction: "row",
            }));
            const __VLS_27 = __VLS_26({
                direction: "row",
            }, ...__VLS_functionalComponentArgsRest(__VLS_26));
            const { default: __VLS_29 } = __VLS_28.slots;
            __VLS_asFunctionalElement(__VLS_elements.input)({
                type: "number",
                placeholder: "Enter number",
                ...{ class: "vs-input vs-w-full" },
            });
            (__VLS_ctx.localFilter.value);
            // @ts-ignore
            [localFilter,];
            var __VLS_28;
        }
        else if (['empty', 'notEmpty'].includes(__VLS_ctx.localFilter.operator || '')) {
            // @ts-ignore
            [localFilter,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "vs-muted vs-text-center vs-pt-sm" },
            });
        }
    }
    else if (__VLS_ctx.localFilter.type === 'date-range') {
        // @ts-ignore
        [localFilter,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "vs-filter-date" },
        });
        if (__VLS_ctx.availableOperators.length > 1) {
            // @ts-ignore
            [availableOperators,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "vs-pb-sm" },
            });
            __VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)({
                value: (__VLS_ctx.localFilter.operator),
                ...{ class: "vs-operator-select vs-w-full" },
            });
            // @ts-ignore
            [localFilter,];
            for (const [op] of __VLS_getVForSourceType((__VLS_ctx.availableOperators))) {
                // @ts-ignore
                [availableOperators,];
                __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
                    key: (op),
                    value: (op),
                });
                (__VLS_ctx.formatOperator(op));
                // @ts-ignore
                [formatOperator,];
            }
        }
        else {
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
                ...{ class: "vs-operator-fixed" },
            });
            (__VLS_ctx.localFilter.operator);
            // @ts-ignore
            [localFilter,];
        }
        if (__VLS_ctx.localFilter.operator === 'between') {
            // @ts-ignore
            [localFilter,];
            /** @type {[typeof VsDFlex, typeof VsDFlex, ]} */ ;
            // @ts-ignore
            const __VLS_30 = __VLS_asFunctionalComponent(VsDFlex, new VsDFlex({
                justify: "between",
                align: "center",
                gap: "4",
                ...{ class: "mb-6" },
            }));
            const __VLS_31 = __VLS_30({
                justify: "between",
                align: "center",
                gap: "4",
                ...{ class: "mb-6" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_30));
            const { default: __VLS_33 } = __VLS_32.slots;
            __VLS_asFunctionalElement(__VLS_elements.input)({
                type: "date",
                ...{ class: "vs-input vs-w-full" },
            });
            (__VLS_ctx.localFilter.start);
            // @ts-ignore
            [localFilter,];
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
            __VLS_asFunctionalElement(__VLS_elements.input)({
                type: "date",
                ...{ class: "vs-input vs-w-full" },
            });
            (__VLS_ctx.localFilter.end);
            // @ts-ignore
            [localFilter,];
            var __VLS_32;
        }
        else if (['equals', 'notEqual', 'before', 'after'].includes(__VLS_ctx.localFilter.operator || '')) {
            // @ts-ignore
            [localFilter,];
            /** @type {[typeof VsDFlex, typeof VsDFlex, ]} */ ;
            // @ts-ignore
            const __VLS_34 = __VLS_asFunctionalComponent(VsDFlex, new VsDFlex({
                direction: "row",
                ...{ class: "vs-filter-single-date" },
            }));
            const __VLS_35 = __VLS_34({
                direction: "row",
                ...{ class: "vs-filter-single-date" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_34));
            const { default: __VLS_37 } = __VLS_36.slots;
            __VLS_asFunctionalElement(__VLS_elements.input)({
                type: "date",
                ...{ class: "vs-input vs-w-full" },
            });
            (__VLS_ctx.localFilter.value);
            // @ts-ignore
            [localFilter,];
            var __VLS_36;
        }
        else if (['empty', 'notEmpty'].includes(__VLS_ctx.localFilter.operator || '')) {
            // @ts-ignore
            [localFilter,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "vs-muted vs-text-center vs-pt-sm" },
            });
        }
    }
    if (__VLS_ctx.localFilter.type !== 'custom') {
        // @ts-ignore
        [localFilter,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "vs-filter-actions" },
        });
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (__VLS_ctx.applyFilter) },
            ...{ class: "vs-btn vs-btn-primary" },
        });
        // @ts-ignore
        [applyFilter,];
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (__VLS_ctx.clearFilter) },
            ...{ class: "vs-btn vs-btn-secondary" },
        });
        // @ts-ignore
        [clearFilter,];
    }
    var __VLS_38 = {
        filter: (__VLS_ctx.localFilter),
        apply: (__VLS_ctx.applyFilter),
        clear: (__VLS_ctx.clearFilter),
    };
    // @ts-ignore
    [localFilter, applyFilter, clearFilter,];
}
var __VLS_8;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['vs-column-filter']} */ ;
/** @type {__VLS_StyleScopedClasses['is-active']} */ ;
/** @type {__VLS_StyleScopedClasses['in-active']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-filter-dropdown']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-filter-text']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-pb-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-operator-select']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-input']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-filter-multi']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-filter-range']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-pb-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-operator-select']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-operator-fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-input']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-input']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-input']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-muted']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-pt-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-filter-date']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-pb-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-operator-select']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-operator-fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-input']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-input']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-filter-single-date']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-input']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-muted']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-pt-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-filter-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['vs-btn-secondary']} */ ;
// @ts-ignore
var __VLS_39 = __VLS_38;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        hasValue: hasValue,
        VsDFlex: VsDFlex,
        VsMultiSelect: VsMultiSelect,
        columnOrAsyncOptions: columnOrAsyncOptions,
        isLoading: isLoading,
        loadAsyncOptions: loadAsyncOptions,
        formatOperator: formatOperator,
        availableOperators: availableOperators,
        referenceRef: referenceRef,
        floatingRef: floatingRef,
        isOpen: isOpen,
        localFilter: localFilter,
        toggleDropdown: toggleDropdown,
        applyFilter: applyFilter,
        clearFilter: clearFilter,
    }),
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
const __VLS_component = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
