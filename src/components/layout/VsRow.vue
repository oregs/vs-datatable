<template>
  <div :class="rowClasses" v-bind="attrs">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl'

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
      type: Object as () => Partial<Record<Breakpoint, {
        direction?: string,
        justify?: string,
        align?: string,
        wrap?: boolean,
        gap?: string | number
      }>>, 
      default: () => ({})
    }
  },
  setup(props, { attrs }) {

    const makeClass = (prefix: string, value: string | number) => `${prefix}-${value}`

    const rowClasses = computed(() => {
      const classes: string[] = [
        'vs-row',
        makeClass('vs-row', props.direction),
        makeClass('vs-justify', props.justify),
        makeClass('vs-align', props.align),
        props.wrap ? 'vs-wrap' : 'vs-nowrap',
        props.gap ? makeClass('vs-gap', props.gap) : '',
      ]

      // Responsive classes
      Object.entries(props.responsive).forEach(([bp, cfg]) => {
        const prefix = bp + ':'
        if (cfg.direction) classes.push(prefix + makeClass('vs-row', cfg.direction))
        if (cfg.justify) classes.push(prefix + makeClass('vs-justify', cfg.justify))
        if (cfg.align) classes.push(prefix + makeClass('vs-align', cfg.align))
        if (cfg.wrap !== undefined) classes.push(prefix + (cfg.wrap ? 'vs-wrap' : 'vs-nowrap'))
        if (cfg.gap) classes.push(prefix + makeClass('vs-gap', cfg.gap))
      })

      return classes
    })

    return { rowClasses, attrs }
  }
})
</script>
