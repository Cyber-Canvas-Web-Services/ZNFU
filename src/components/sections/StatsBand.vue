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

       `bg-cream-50` (the lightest surface) rather than the warmer `cream-100`:
       this panel sits directly above PurposeVision, which is `cream-100`, and
       the two share an edge. On the same colour that edge would vanish and the
       card-stack would read as a flat block, so the two surfaces stay one step
       apart — the whitest panel first, the off-white one below it. -->
  <StackedPanel surface="bg-cream-50" tone="text-ink-900" dense first>
    <!-- Decorative glow. The gold hairline that used to sit along this panel's
         top edge is gone at the client's request — against the near-white
         surface it read as a stray mustard line rather than an accent.

         The glow itself is also lighter than it was. It sits on a near-white
         panel, where a wide gold gradient reads as the panel being dimmed or
         smudged rather than as an accent; the supervisor asked for that to be
         pulled back everywhere it appears. -->
    <div
      class="glow -right-40 top-0 h-[420px] w-[420px] bg-[radial-gradient(closest-side,rgba(245,198,42,0.07),transparent)]"
      aria-hidden="true"
    />

    <div class="relative">
      <div class="max-w-2xl" v-reveal>
        <!-- Brand yellow `maize-400`. This used to be `maize-700`, an ochre
             that read as brown against the light panel; the darker maize steps
             have since been deleted from the palette entirely, so brown cannot
             come back. Note the trade-off this encodes: on this surface 400
             measures ~1.5:1, far below the 4.5:1 WCAG AA needs for text this
             size. It is a deliberate decorative choice, not an oversight —
             check before "fixing" it. -->
        <p class="eyebrow text-maize-400">{{ stats.eyebrow }}</p>
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
