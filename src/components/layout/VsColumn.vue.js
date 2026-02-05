/// <reference types="C:/Users/SegunOregunwa/Documents/OregsThings/dependency-projects/vs-datatable/node_modules/.vue-global-types/vue_3.5_0.d.ts" />
import { defineComponent, computed } from 'vue';
export default defineComponent({
    name: 'VsColumn',
    inheritAttrs: false,
    props: {
        span: { type: [Number, String], default: 12 },
        offset: { type: [Number, String], default: 0 },
        responsive: {
            type: Object,
            default: () => ({})
        }
    },
    setup(props, { attrs }) {
        const makeClass = (prefix, value) => `${prefix}-${value}`;
        const colClasses = computed(() => {
            const classes = ['vs-col', makeClass('vs-col-span', props.span)];
            if (props.offset)
                classes.push(makeClass('vs-col-offset', props.offset));
            Object.entries(props.responsive).forEach(([bp, cfg]) => {
                const prefix = bp + ':';
                if (cfg.span)
                    classes.push(prefix + makeClass('vs-col-span', cfg.span));
                if (cfg.offset)
                    classes.push(prefix + makeClass('vs-col-offset', cfg.offset));
            });
            return classes;
        });
        return { colClasses, attrs };
    }
});
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: (__VLS_ctx.colClasses) },
    ...(__VLS_ctx.attrs),
});
// @ts-ignore
[colClasses, attrs,];
var __VLS_0 = {};
// @ts-ignore
var __VLS_1 = __VLS_0;
var __VLS_dollars;
let __VLS_self;
