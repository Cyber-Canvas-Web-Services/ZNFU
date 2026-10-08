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
       flush top edge — its rounded corners used to show the page background
       through them once the panel pinned.

       `bg-cream-100` rather than the site's lighter `cream-50`: this panel sits
       directly above PurposeVision, which is `cream-50`, and the two share an
       edge. On the same colour that edge would vanish and the card-stack read
       as a flat block, so this one steps one shade warmer to hold the join. -->
  <StackedPanel surface="bg-cream-100" tone="text-ink-900" dense first>
    <!-- Decorative glow + gold hairline -->
    <div
      class="glow -right-40 top-0 h-[420px] w-[420px] bg-[radial-gradient(closest-side,rgba(233,168,18,0.15),transparent)]"
      aria-hidden="true"
    />
    <div
      class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-maize-500/40 to-transparent"
      aria-hidden="true"
    />

    <div class="relative">
      <div class="max-w-2xl" v-reveal>
        <!-- The accent gold is `maize-700`, not the `maize-400` this used to
             carry. Measured against this cream panel: 400 lands at 1.44:1 and
             600 — the site's usual light-background gold — at 2.78:1. Both
             fail WCAG AA, which needs 4.5:1 for text this size. 700 reads
             4.58:1 and is still unmistakably the brand gold. -->
        <p class="eyebrow text-maize-700">{{ stats.eyebrow }}</p>
        <h2 class="section-title mt-3 text-ink-900">{{ stats.title }}</h2>
      </div>

      <!-- The gap above the grid is load-bearing, not decorative: it is what
           keeps the figures clear of the peeking edge at every viewport, so
           the count-up always has to be scrolled to. It is generous because
           the heading above it grows with the viewport while the peek does
           not — at 1920 the heading reaches ~115px down and the figures start
           ~148px down, and this spacing is what holds that window open.

           Do not tighten this to make the panel shorter. Everything that
           shrinks the panel has to happen below the grid. -->
      <div class="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 sm:mt-12 sm:gap-x-10 lg:grid-cols-4">
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
