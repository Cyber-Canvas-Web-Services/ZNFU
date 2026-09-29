<script setup>
/**
 * Member systems — split across one panel per system.
 *
 * There are three systems and each needs an image, copy, feature list and a
 * call to action, which is well over a screen of content. Rather than cram
 * them into one over-tall panel (which a sticky layout cannot scroll past),
 * each system becomes its own screen in the stack.
 */
import { ArrowRight } from '@lucide/vue'

import AppIcon from '@/components/ui/AppIcon.vue'
import StackedPanel from '@/components/sections/StackedPanel.vue'
import { systems } from '@/data/home'
</script>

<template>
  <StackedPanel
    v-for="(item, index) in systems.items"
    :id="item.id"
    :key="item.id"
    surface="bg-forest-950"
    tone="text-cream-50"
    :first="index === 0"
  >
    <div
      class="pointer-events-none absolute -left-40 top-1/4 h-[420px] w-[420px] rounded-full bg-forest-500/10 blur-3xl"
      aria-hidden="true"
    />

    <div
      class="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
      :class="index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''"
    >
      <!-- Visual -->
      <div v-reveal class="relative overflow-hidden rounded-3xl ring-1 ring-white/10">
        <img
          :src="item.image"
          :alt="item.imageAlt"
          class="h-[260px] w-full object-cover sm:h-[340px] lg:h-[440px]"
          loading="lazy"
          decoding="async"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-forest-950/70 to-transparent" />
        <p
          class="absolute bottom-5 left-6 font-display text-sm font-semibold tracking-[0.24em] text-cream-100/75"
        >
          {{ item.number }} / 03
        </p>
      </div>

      <!-- Copy -->
      <div v-reveal="{ delay: 90 }">
        <p class="eyebrow text-maize-400">Member systems</p>

        <h2 class="section-title mt-4 text-cream-50">{{ item.title }}</h2>
        <p class="mt-4 max-w-lg leading-relaxed text-cream-200/70">{{ item.body }}</p>

        <!-- e-Farm Prices shows a sample of the weekly book -->
        <dl v-if="item.prices" class="mt-7 max-w-lg divide-y divide-white/10 border-y border-white/10">
          <div
            v-for="row in item.prices"
            :key="row.commodity"
            class="flex items-baseline justify-between gap-4 py-2.5"
          >
            <dt class="text-sm text-cream-100/75">{{ row.commodity }}</dt>
            <dd class="text-right">
              <span class="font-display text-sm font-semibold text-cream-50">{{ row.price }}</span>
              <span class="ml-1.5 text-[0.7rem] text-cream-200/50">/ {{ row.unit }}</span>
            </dd>
          </div>
        </dl>

        <ul v-else class="mt-7 space-y-3">
          <li
            v-for="feature in item.features"
            :key="feature"
            class="flex items-start gap-3 text-[0.95rem] text-cream-100/85"
          >
            <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-maize-400" aria-hidden="true" />
            {{ feature }}
          </li>
        </ul>

        <a
          :href="item.cta.href"
          class="mt-8 inline-flex items-center gap-2 border-b border-maize-400/50 pb-1 text-sm font-semibold text-maize-300 transition hover:border-maize-300 hover:text-maize-200"
        >
          {{ item.cta.label }}
          <ArrowRight class="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  </StackedPanel>
</template>
