/// <reference types="C:/Users/SegunOregunwa/Documents/OregsThings/dependency-projects/vs-datatable/node_modules/.vue-global-types/vue_3.5_0.d.ts" />
import { defineComponent, computed } from 'vue';
export default defineComponent({
    name: 'VsDFlex',
    inheritAttrs: false,
    props: {
        direction: String,
        justify: String,
        align: String,
        wrap: Boolean,
        gap: [String, Number],
        responsive: Object
    },
    setup(props, { attrs }) {
        const makeClass = (prefix, value) => `${prefix}-${value}`;
        const flexClasses = computed(() => {
            const classes = ['vs-d-flex'];
            if (props.direction)
                classes.push(makeClass('vs-row', props.direction));
            if (props.justify)
                classes.push(makeClass('vs-justify', props.justify));
            if (props.align)
                classes.push(makeClass('vs-align', props.align));
            if (props.wrap !== undefined)
                classes.push(props.wrap ? 'vs-wrap' : 'vs-nowrap');
            if (props.gap)
                classes.push(makeClass('vs-gap', props.gap));
            // Responsive
            Object.entries(props.responsive || {}).forEach(([bp, cfg]) => {
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
        return { flexClasses, attrs };
    }
});
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: (__VLS_ctx.flexClasses) },
    ...(__VLS_ctx.attrs),
});
// @ts-ignore
[flexClasses, attrs,];
var __VLS_0 = {};
// @ts-ignore
var __VLS_1 = __VLS_0;
var __VLS_dollars;
let __VLS_self;
