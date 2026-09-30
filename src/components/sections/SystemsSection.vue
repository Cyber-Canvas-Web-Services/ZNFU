<script setup>
/**
 * Member systems — one card per system.
 *
 * The three systems (e-Farm Prices, e-Transport and ZNFU Market) are shown as
 * a set of cards on a single dark band. Every title and description comes from
 * the shared data unchanged, and each card keeps its system’s anchor id so the
 * footer’s deep links (and the nav’s #systems link) still land correctly.
 */
import AppIcon from '@/components/ui/AppIcon.vue'
import StackedPanel from '@/components/sections/StackedPanel.vue'
import { systems } from '@/data/home'
</script>

<template>
  <StackedPanel id="systems" surface="bg-forest-950" tone="text-cream-50" compact>
    <div
      class="pointer-events-none absolute -left-40 top-1/4 h-[420px] w-[420px] rounded-full bg-forest-500/10 blur-3xl"
      aria-hidden="true"
    />

    <div class="relative">
      <p class="eyebrow text-maize-400" v-reveal>{{ systems.eyebrow }}</p>

      <div class="mt-10 grid gap-6 md:grid-cols-3 lg:mt-12">
        <article
          v-for="(item, index) in systems.items"
          :id="item.id"
          :key="item.id"
          v-reveal="{ delay: index * 110 }"
          class="group flex flex-col rounded-3xl bg-forest-900/60 p-7 ring-1 ring-white/10 transition-transform duration-500 hover:-translate-y-1.5"
        >
          <div class="flex items-center justify-between gap-4">
            <span
              class="grid h-11 w-11 place-items-center rounded-full bg-maize-400 text-forest-950 shadow-lg"
            >
              <AppIcon :name="item.icon" class="h-5 w-5" />
            </span>
            <p
              class="font-display text-xs font-semibold tracking-[0.24em] text-cream-100/55"
            >
              {{ item.number }} / 03
            </p>
          </div>

          <h2
            class="mt-6 font-display text-xl font-medium tracking-[-0.02em] text-cream-50"
          >
            {{ item.title }}
          </h2>
          <p class="mt-3 text-[0.92rem] leading-relaxed text-cream-200/70">
            {{ item.body }}
          </p>
        </article>
      </div>
    </div>
  </StackedPanel>
</template>
