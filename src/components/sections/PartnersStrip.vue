<script setup>
import { computed } from 'vue'
import { ShieldCheck } from '@lucide/vue'

import { partners } from '@/data/home'

/** Duplicated so the marquee can loop seamlessly at -50%. */
const marqueeItems = computed(() => [...partners.items, ...partners.items])
</script>

<template>
  <section class="relative border-y border-forest-900/10 bg-cream-100 py-16 sm:py-20">
    <div class="mx-auto max-w-7xl px-5 sm:px-8">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <p class="eyebrow eyebrow--plain shrink-0 text-forest-600">{{ partners.title }}</p>

        <!-- Affiliations -->
        <ul class="flex flex-wrap gap-3">
          <li
            v-for="affiliation in partners.affiliations"
            :key="affiliation.label"
            class="flex items-center gap-3 rounded-2xl border border-forest-900/10 bg-cream-50 px-4 py-2.5"
          >
            <ShieldCheck class="h-4 w-4 shrink-0 text-forest-600" aria-hidden="true" />
            <span>
              <span class="block text-xs font-bold uppercase tracking-[0.14em] text-forest-950">
                {{ affiliation.label }}
              </span>
              <span class="block text-[0.68rem] leading-tight text-ink-900/50">
                {{ affiliation.sub }}
              </span>
            </span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Marquee of partner organisations -->
    <div class="mask-fade-x mt-10 overflow-hidden" aria-label="Working with">
      <ul class="marquee gap-4">
        <li
          v-for="(item, index) in marqueeItems"
          :key="`${item}-${index}`"
          class="shrink-0 rounded-full border border-forest-900/10 bg-cream-50 px-6 py-3 text-sm font-medium whitespace-nowrap text-forest-950/75"
          :aria-hidden="index >= partners.items.length ? 'true' : undefined"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </section>
</template>
