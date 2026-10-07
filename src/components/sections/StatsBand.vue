<script setup>
import { usePrefersReducedMotion } from '@/composables/useMediaQuery'
import StackedPanel from '@/components/sections/StackedPanel.vue'
import StatCounter from '@/components/ui/StatCounter.vue'
import { stats } from '@/data/home'

const reducedMotion = usePrefersReducedMotion()
</script>

<template>
  <!-- The panel peeks just far enough to show its heading — “By the numbers”
       and the sentence under it — and deliberately stops short of the figures.

       The figures used to be in that first screenful, which meant the
       count-up had already run to completion by the time anyone scrolled down
       to them (both the count and the reveal fire on visibility), so the
       animation was never actually seen. Keeping them below the fold is what
       gives the animation somewhere to happen.

       `dense` keeps the vertical rhythm tight, and `first` gives the panel a
       flush top edge — its rounded corners used to show the cream page
       background through them once the panel pinned. -->
  <StackedPanel surface="bg-forest-950" tone="text-cream-50" dense first>
    <!-- Decorative glow + gold hairline -->
    <div
      class="pointer-events-none absolute -right-40 top-0 h-[420px] w-[420px] rounded-full bg-maize-500/10 blur-3xl"
      aria-hidden="true"
    />
    <div
      class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-maize-500/40 to-transparent"
      aria-hidden="true"
    />

    <div class="relative">
      <div class="max-w-2xl" v-reveal>
        <p class="eyebrow text-maize-400">{{ stats.eyebrow }}</p>
        <h2 class="section-title mt-3 text-cream-50">{{ stats.title }}</h2>
      </div>

      <!-- The gap above the grid is load-bearing, not decorative: it is what
           keeps the figures clear of the peeking edge at every viewport, so
           the count-up always has to be scrolled to. -->
      <div class="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 sm:mt-10 sm:gap-x-10 lg:grid-cols-4">
        <StatCounter
          v-for="(item, index) in stats.items"
          :key="item.label"
          v-reveal="{ delay: index * 90 }"
          v-bind="item"
          :reduced-motion="reducedMotion"
        />
      </div>

      <p v-reveal="{ delay: 120 }" class="mt-5 max-w-2xl text-xs leading-relaxed text-cream-200/50">
        {{ stats.footnote }}
      </p>
    </div>
  </StackedPanel>
</template>
