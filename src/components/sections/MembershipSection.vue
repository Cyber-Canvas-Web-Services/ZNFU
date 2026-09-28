<script setup>
import { ArrowRight } from '@lucide/vue'

import { membership } from '@/data/home'
</script>

<template>
  <section id="membership" class="relative overflow-hidden bg-forest-50 py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-5 sm:px-8">
      <div class="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <!-- Copy + the five ways -->
        <div>
          <p class="eyebrow text-forest-600" v-reveal>{{ membership.eyebrow }}</p>
          <h2 class="section-title mt-5 text-forest-950" v-reveal="{ delay: 60 }">
            {{ membership.title }}
          </h2>
          <p class="lede mt-5 max-w-xl text-ink-900/65" v-reveal="{ delay: 110 }">
            {{ membership.lede }}
          </p>

          <ol class="mt-12 space-y-1">
            <li
              v-for="(way, index) in membership.ways"
              :key="way.number"
              v-reveal="{ delay: 140 + index * 70 }"
              class="group grid gap-2 border-b border-forest-900/10 py-6 sm:grid-cols-[auto_1fr] sm:gap-7"
            >
              <span
                class="font-display text-sm font-semibold tracking-[0.2em] text-maize-600 sm:pt-1"
              >
                {{ way.number }}
              </span>
              <span>
                <span
                  class="block font-display text-lg font-semibold text-forest-950 transition group-hover:text-forest-700 sm:text-xl"
                >
                  {{ way.title }}
                </span>
                <span class="mt-1.5 block text-[0.95rem] leading-relaxed text-ink-900/60">
                  {{ way.body }}
                </span>
              </span>
            </li>
          </ol>

          <div class="mt-10 flex flex-wrap gap-3" v-reveal>
            <a :href="membership.cta.href" class="btn btn--forest">
              {{ membership.cta.label }}
              <ArrowRight class="h-4 w-4" aria-hidden="true" />
            </a>
            <a :href="membership.secondaryCta.href" class="btn btn--outline">
              {{ membership.secondaryCta.label }}
            </a>
          </div>
        </div>

        <!-- Tall visual -->
        <div class="relative lg:sticky lg:top-28 lg:self-start" v-reveal="{ delay: 120 }">
          <div class="overflow-hidden rounded-[28px] shadow-soft">
            <img
              :src="membership.image"
              :alt="membership.imageAlt"
              class="h-[440px] w-full object-cover sm:h-[560px] lg:h-[640px]"
              loading="lazy"
              decoding="async"
            />
          </div>
          <p
            class="absolute bottom-6 left-6 right-6 rounded-2xl bg-forest-950/70 px-5 py-4 font-display text-lg font-semibold text-cream-50 backdrop-blur-md"
          >
            {{ membership.imageCaption }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
