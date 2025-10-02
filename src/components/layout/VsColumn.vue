<template>
  <div :class="colClasses" v-bind="attrs">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl'

export default defineComponent({
  name: 'VsColumn',
  inheritAttrs: false,
  props: {
    span: { type: [Number, String], default: 12 },
    offset: { type: [Number, String], default: 0 },
    responsive: { 
      type: Object as () => Partial<Record<Breakpoint, { span?: number; offset?: number }>>, 
      default: () => ({}) 
    }
  },
  setup(props, { attrs }) {

    const makeClass = (prefix: string, value: string | number) => `${prefix}-${value}`

    const colClasses = computed(() => {
      const classes: string[] = ['vs-col', makeClass('vs-col-span', props.span)]
      if (props.offset) classes.push(makeClass('vs-col-offset', props.offset))

      Object.entries(props.responsive).forEach(([bp, cfg]) => {
        const prefix = bp + ':'
        if (cfg.span) classes.push(prefix + makeClass('vs-col-span', cfg.span))
        if (cfg.offset) classes.push(prefix + makeClass('vs-col-offset', cfg.offset))
      })

      return classes
    })

    return { colClasses, attrs }
  }
})
</script>
