<script setup>
/**
 * A single count-up statistic. Wraps `useCountUp` so it can live inside a
 * `v-for` (composables can't be called per-item in a loop).
 */
import { computed } from 'vue'
import { useCountUp } from '@/composables/useCountUp'

const props = defineProps({
  value: { type: Number, required: true },
  label: { type: String, required: true },
  prefix: { type: String, default: '' },
  suffix: { type: String, default: '' },
  /** Render the value exactly (e.g. a year) rather than counting up. */
  raw: { type: Boolean, default: false },
  reducedMotion: { type: Boolean, default: false },
})

const { value: animated, elRef } = useCountUp(props.value, {
  reducedMotion: computed(() => props.reducedMotion),
})

const display = computed(() => {
  const n = props.raw ? props.value : Math.round(animated.value)
  return n.toLocaleString('en-US')
})
</script>

<template>
  <!-- Colours are the light-surface set: this renders inside the off-white
       “By the numbers” panel. The figures were white on the old dark-green
       surface, which is invisible on cream. -->
  <div ref="elRef" class="flex flex-col gap-2">
    <span
      class="font-display text-display-sm font-semibold leading-none tracking-[-0.03em] text-ink-900"
    >
      <span aria-hidden="true">{{ prefix }}{{ display }}{{ suffix }}</span>
      <span class="sr-only">{{ prefix }}{{ value.toLocaleString('en-US') }}{{ suffix }}</span>
    </span>
    <span class="text-sm leading-snug text-ink-900/60">{{ label }}</span>
  </div>
</template>
