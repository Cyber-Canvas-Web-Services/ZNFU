<script setup>
/**
 * Membership — split into two panels: the five routes into the Union, then a
 * closing image panel carrying the calls to action.
 */
import { ArrowRight } from '@lucide/vue'

import StackedPanel from '@/components/sections/StackedPanel.vue'
import { membership } from '@/data/home'
</script>

<template>
  <!-- Panel 1 — five ways to belong -->
  <StackedPanel id="membership" surface="bg-forest-50" :first="true">
    <div class="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
      <div>
        <p class="eyebrow text-forest-600" v-reveal>{{ membership.eyebrow }}</p>
        <h2 class="section-title mt-5 text-forest-950" v-reveal="{ delay: 60 }">
          {{ membership.title }}
        </h2>
        <p class="lede mt-5 max-w-md text-ink-900/65" v-reveal="{ delay: 110 }">
          {{ membership.lede }}
        </p>

        <div class="mt-9 flex flex-wrap gap-3" v-reveal="{ delay: 150 }">
          <a :href="membership.cta.href" class="btn btn--forest">
            {{ membership.cta.label }}
            <ArrowRight class="h-4 w-4" aria-hidden="true" />
          </a>
          <a :href="membership.secondaryCta.href" class="btn btn--outline">
            {{ membership.secondaryCta.label }}
          </a>
        </div>
      </div>

      <!-- Two columns keeps the list inside one screen -->
      <ol class="grid gap-x-10 sm:grid-cols-2">
        <li
          v-for="(way, index) in membership.ways"
          :key="way.number"
          v-reveal="{ delay: 120 + index * 70 }"
          class="group border-b border-forest-900/10 py-5"
        >
          <span class="font-display text-sm font-semibold tracking-[0.2em] text-maize-600">
            {{ way.number }}
          </span>
          <span
            class="mt-2 block font-display text-lg font-medium tracking-[-0.02em] text-forest-950 transition group-hover:text-forest-700"
          >
            {{ way.title }}
          </span>
          <span class="mt-1.5 block text-[0.9rem] leading-relaxed text-ink-900/60">
            {{ way.body }}
          </span>
        </li>
      </ol>
    </div>
  </StackedPanel>

  <!-- Panel 2 — closing image panel -->
  <StackedPanel surface="bg-forest-950" tone="text-cream-50" bleed>
    <div class="relative flex min-h-[360px] flex-1 flex-col sm:min-h-[440px] lg:min-h-screen">
      <img
        :src="membership.image"
        :alt="membership.imageAlt"
        class="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/55 to-forest-950/25"
        aria-hidden="true"
      />

      <div
        class="relative mt-auto mx-auto w-full max-w-7xl px-5 pb-14 pt-32 sm:px-8 lg:pb-20"
        v-reveal
      >
        <p class="eyebrow eyebrow--plain text-maize-400">{{ membership.imageCaption }}</p>
        <h2
          class="mt-4 max-w-3xl font-display text-[clamp(1.8rem,4vw,3rem)] font-medium leading-[1.12] tracking-[-0.03em] text-cream-50"
        >
          Whoever you are in Zambian agriculture, there is a seat for you at the table.
        </h2>
        <div class="mt-8 flex flex-wrap gap-3">
          <a :href="membership.cta.href" class="btn btn--maize">
            {{ membership.cta.label }}
            <ArrowRight class="h-4 w-4" aria-hidden="true" />
          </a>
          <a :href="membership.secondaryCta.href" class="btn btn--ghost">
            {{ membership.secondaryCta.label }}
          </a>
        </div>
      </div>
    </div>
  </StackedPanel>
</template>
