<script setup>
import { usePrefersReducedMotion } from '@/composables/useMediaQuery'
import StackedPanel from '@/components/sections/StackedPanel.vue'
import StatCounter from '@/components/ui/StatCounter.vue'
import { stats } from '@/data/home'

const reducedMotion = usePrefersReducedMotion()
</script>

<template>
  <StackedPanel surface="bg-forest-950" tone="text-cream-50">
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
      <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-2xl" v-reveal>
          <p class="eyebrow text-maize-400">{{ stats.eyebrow }}</p>
          <h2 class="section-title mt-4 text-cream-50">{{ stats.title }}</h2>
        </div>
        <p v-reveal="{ delay: 100 }" class="max-w-xs text-sm leading-relaxed text-cream-200/55">
          {{ stats.footnote }}
        </p>
      </div>

      <div class="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-10 lg:grid-cols-4">
        <StatCounter
          v-for="(item, index) in stats.items"
          :key="item.label"
          v-reveal="{ delay: index * 90 }"
          v-bind="item"
          :reduced-motion="reducedMotion"
        />
      </div>
    </div>
  </StackedPanel>
</template>
