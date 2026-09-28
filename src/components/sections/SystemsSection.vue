<script setup>
import { ArrowRight } from '@lucide/vue'

import AppIcon from '@/components/ui/AppIcon.vue'
import { systems } from '@/data/home'
</script>

<template>
  <section id="systems" class="relative overflow-hidden bg-forest-950 py-24 text-cream-50 sm:py-32">
    <div
      class="pointer-events-none absolute -left-32 top-1/3 h-[460px] w-[460px] rounded-full bg-forest-500/10 blur-3xl"
      aria-hidden="true"
    />

    <div class="relative mx-auto max-w-7xl px-5 sm:px-8">
      <div class="max-w-2xl" v-reveal>
        <p class="eyebrow text-maize-400">{{ systems.eyebrow }}</p>
        <h2 class="section-title mt-5 text-cream-50">{{ systems.title }}</h2>
        <p class="lede mt-5 text-cream-200/70">{{ systems.lede }}</p>
      </div>

      <div class="mt-20 space-y-24 lg:space-y-32">
        <article
          v-for="(item, index) in systems.items"
          :id="item.id"
          :key="item.id"
          class="grid scroll-mt-28 items-center gap-10 lg:grid-cols-2 lg:gap-16"
        >
          <!-- Visual -->
          <div
            v-reveal
            class="relative order-1 overflow-hidden rounded-3xl ring-1 ring-white/10"
            :class="index % 2 === 1 ? 'lg:order-2' : ''"
          >
            <img
              :src="item.image"
              :alt="item.imageAlt"
              class="h-[300px] w-full object-cover sm:h-[400px]"
              loading="lazy"
              decoding="async"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-forest-950/70 to-transparent" />

            <!-- e-Farm Prices sample board -->
            <div
              v-if="item.prices"
              class="absolute inset-x-4 bottom-4 rounded-2xl border border-white/15 bg-forest-950/80 p-4 backdrop-blur-md sm:inset-x-6 sm:bottom-6"
            >
              <p class="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-maize-400">
                This week · {{ item.prices[0].market }}
              </p>
              <ul class="mt-3 divide-y divide-white/10">
                <li
                  v-for="row in item.prices"
                  :key="row.commodity"
                  class="flex items-baseline justify-between gap-4 py-2"
                >
                  <span class="text-sm text-cream-100/80">{{ row.commodity }}</span>
                  <span class="text-right">
                    <span class="font-display text-sm font-semibold text-cream-50">{{
                      row.price
                    }}</span>
                    <span class="ml-1 text-[0.7rem] text-cream-200/55">/ {{ row.unit }}</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Copy -->
          <div v-reveal="{ delay: 90 }" :class="index % 2 === 1 ? 'lg:order-1' : ''">
            <div class="flex items-center gap-4">
              <span
                class="grid h-11 w-11 place-items-center rounded-full bg-maize-400 text-forest-950"
              >
                <AppIcon :name="item.icon" class="h-5 w-5" />
              </span>
              <p class="font-display text-sm font-semibold tracking-[0.2em] text-maize-400">
                {{ item.number }}
              </p>
            </div>

            <h3 class="mt-6 font-display text-3xl font-semibold text-cream-50 sm:text-4xl">
              {{ item.title }}
            </h3>
            <p class="mt-5 max-w-lg leading-relaxed text-cream-200/70">{{ item.body }}</p>

            <ul class="mt-8 space-y-3.5">
              <li
                v-for="feature in item.features"
                :key="feature"
                class="flex items-start gap-3 text-[0.95rem] text-cream-100/85"
              >
                <span
                  class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-maize-400"
                  aria-hidden="true"
                />
                {{ feature }}
              </li>
            </ul>

            <a
              :href="item.cta.href"
              class="mt-9 inline-flex items-center gap-2 border-b border-maize-400/50 pb-1 text-sm font-semibold text-maize-300 transition hover:border-maize-300 hover:text-maize-200"
            >
              {{ item.cta.label }}
              <ArrowRight class="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
