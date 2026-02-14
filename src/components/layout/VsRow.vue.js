/// <reference types="C:/Users/SegunOregunwa/Documents/OregsThings/dependency-projects/vs-datatable/node_modules/.vue-global-types/vue_3.5_0.d.ts" />
import { defineComponent, computed } from 'vue';
export default defineComponent({
    name: 'VsRow',
    inheritAttrs: false,
    props: {
        direction: { type: String, default: 'row' },
        justify: { type: String, default: 'start' },
        align: { type: String, default: 'stretch' },
        wrap: { type: Boolean, default: false },
        gap: { type: [String, Number], default: 0 },
        responsive: {
            type: Object,
            default: () => ({})
        }
    },
    setup(props, { attrs }) {
        const makeClass = (prefix, value) => `${prefix}-${value}`;
        const rowClasses = computed(() => {
            const classes = [
                'vs-row',
                makeClass('vs-row', props.direction),
                makeClass('vs-justify', props.justify),
                makeClass('vs-align', props.align),
                props.wrap ? 'vs-wrap' : 'vs-nowrap',
                props.gap ? makeClass('vs-gap', props.gap) : '',
            ];
            // Responsive classes
            Object.entries(props.responsive).forEach(([bp, cfg]) => {
                const prefix = bp + ':';
                if (cfg.direction)
                    classes.push(prefix + makeClass('vs-row', cfg.direction));
                if (cfg.justify)
                    classes.push(prefix + makeClass('vs-justify', cfg.justify));
                if (cfg.align)
                    classes.push(prefix + makeClass('vs-align', cfg.align));
                if (cfg.wrap !== undefined)
                    classes.push(prefix + (cfg.wrap ? 'vs-wrap' : 'vs-nowrap'));
                if (cfg.gap)
                    classes.push(prefix + makeClass('vs-gap', cfg.gap));
            });
            return classes;
        });
        return { rowClasses, attrs };
    }
});
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: (__VLS_ctx.rowClasses) },
    ...(__VLS_ctx.attrs),
});
// @ts-ignore
[rowClasses, attrs,];
var __VLS_0 = {};
// @ts-ignore
var __VLS_1 = __VLS_0;
var __VLS_dollars;
let __VLS_self;
