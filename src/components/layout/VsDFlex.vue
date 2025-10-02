<template>
  <div :class="flexClasses" v-bind="attrs">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl'

export default defineComponent({
  name: 'VsDFlex',
  inheritAttrs: false,
  props: {
    direction: String,
    justify: String,
    align: String,
    wrap: Boolean,
    gap: [String, Number],
    responsive: Object as () => Partial<Record<Breakpoint, {
      direction?: string,
      justify?: string,
      align?: string,
      wrap?: boolean,
      gap?: string | number
    }>>
  },
  setup(props, { attrs }) {

    const makeClass = (prefix: string, value: string | number) => `${prefix}-${value}`

    const flexClasses = computed(() => {
      const classes: string[] = ['vs-d-flex']
      if (props.direction) classes.push(makeClass('vs-row', props.direction))
      if (props.justify) classes.push(makeClass('vs-justify', props.justify))
      if (props.align) classes.push(makeClass('vs-align', props.align))
      if (props.wrap !== undefined) classes.push(props.wrap ? 'vs-wrap' : 'vs-nowrap')
      if (props.gap) classes.push(makeClass('vs-gap', props.gap))

      // Responsive
      Object.entries(props.responsive || {}).forEach(([bp, cfg]) => {
        const prefix = bp + ':'
        if (cfg.direction) classes.push(prefix + makeClass('vs-row', cfg.direction))
        if (cfg.justify) classes.push(prefix + makeClass('vs-justify', cfg.justify))
        if (cfg.align) classes.push(prefix + makeClass('vs-align', cfg.align))
        if (cfg.wrap !== undefined) classes.push(prefix + (cfg.wrap ? 'vs-wrap' : 'vs-nowrap'))
        if (cfg.gap) classes.push(prefix + makeClass('vs-gap', cfg.gap))
      })

      return classes
    })

    return { flexClasses, attrs }
  }
})
</script>
