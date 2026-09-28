<script setup>
import { purposeVision } from '@/data/home'
</script>

<template>
  <section id="about" class="relative overflow-hidden bg-cream-50 py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-5 sm:px-8">
      <div class="grid items-start gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <!-- Visual -->
        <div class="relative" v-reveal>
          <div class="overflow-hidden rounded-[28px] shadow-soft">
            <img
              :src="purposeVision.image"
              :alt="'Farmers walking through a soybean field in Zambia'"
              class="h-[420px] w-full object-cover sm:h-[520px] lg:h-[580px]"
              loading="lazy"
              decoding="async"
            />
          </div>

          <!-- Floating credential card -->
          <div
            class="absolute -bottom-6 left-4 rounded-2xl bg-forest-900 px-6 py-5 text-cream-50 shadow-card sm:left-6"
          >
            <p class="font-display text-3xl font-semibold leading-none text-maize-400">1905</p>
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
          <p class="lede mt-6 max-w-2xl text-ink-900/70" v-reveal="{ delay: 120 }">
            {{ purposeVision.lede }}
          </p>

          <div class="mt-12 space-y-10">
            <article
              v-for="(block, index) in purposeVision.blocks"
              :key="block.number"
              v-reveal="{ delay: 160 + index * 90 }"
              class="grid gap-4 sm:grid-cols-[auto_1fr] sm:gap-8"
            >
              <p
                class="font-display text-sm font-semibold tracking-[0.2em] text-maize-600 sm:pt-1.5"
              >
                {{ block.number }}
              </p>
              <div>
                <h3 class="font-display text-xl font-semibold text-forest-950 sm:text-2xl">
                  {{ block.heading }}
                </h3>
                <p class="mt-3 max-w-xl leading-relaxed text-ink-900/65">{{ block.body }}</p>
                <div class="rule mt-8 text-forest-900/20" />
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
