<script setup>
import StackedPanel from '@/components/sections/StackedPanel.vue'
import { purposeVision } from '@/data/home'
</script>

<template>
  <StackedPanel id="about" surface="bg-cream-50">
    <div class="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
      <!-- Visual -->
      <div class="relative" v-reveal>
        <div class="overflow-hidden rounded-[28px] shadow-soft">
          <img
            :src="purposeVision.image"
            alt="Farmers walking through a soybean field in Zambia"
            class="h-[300px] w-full object-cover sm:h-[380px] lg:h-[460px]"
            loading="lazy"
            decoding="async"
          />
        </div>

        <!-- Floating credential card -->
        <div
          class="absolute -bottom-6 left-4 rounded-2xl bg-forest-900 px-6 py-5 text-cream-50 shadow-card sm:left-6"
        >
          <p class="font-display text-3xl font-medium leading-none tracking-[-0.03em] text-maize-400">
            1905
          </p>
          <p class="mt-2 text-xs uppercase tracking-[0.2em] text-cream-200/70">
            Serving Zambian<br />agriculture since
          </p>
        </div>
      </div>

      <!-- Copy -->
      <div>
        <p class="eyebrow text-forest-600" v-reveal>{{ purposeVision.eyebrow }}</p>
        <h2 class="section-title mt-5 text-forest-950" v-reveal="{ delay: 60 }">
          {{ purposeVision.title }}
        </h2>
        <p class="lede mt-5 max-w-2xl text-ink-900/70" v-reveal="{ delay: 120 }">
          {{ purposeVision.lede }}
        </p>

        <div class="mt-9 space-y-7">
          <article
            v-for="(block, index) in purposeVision.blocks"
            :key="block.number"
            v-reveal="{ delay: 160 + index * 90 }"
            class="grid gap-3 sm:grid-cols-[auto_1fr] sm:gap-7"
          >
            <p class="font-display text-sm font-semibold tracking-[0.2em] text-maize-600 sm:pt-1.5">
              {{ block.number }}
            </p>
            <div>
              <h3 class="font-display text-xl font-medium tracking-[-0.02em] text-forest-950">
                {{ block.heading }}
              </h3>
              <p class="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-ink-900/65">
                {{ block.body }}
              </p>
              <div class="rule mt-6 text-forest-900/20" />
            </div>
          </article>
        </div>
      </div>
    </div>
  </StackedPanel>
</template>
