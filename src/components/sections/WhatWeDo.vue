<script setup>
import AppIcon from '@/components/ui/AppIcon.vue'
import StackedPanel from '@/components/sections/StackedPanel.vue'
import { whatWeDo } from '@/data/home'
</script>

<template>
  <StackedPanel id="what-we-do" surface="bg-cream-100">
    <div class="max-w-2xl" v-reveal>
      <p class="eyebrow text-forest-600">{{ whatWeDo.eyebrow }}</p>
      <h2 class="section-title mt-4 text-forest-950">{{ whatWeDo.title }}</h2>
      <p class="lede mt-4 text-ink-900/65">{{ whatWeDo.lede }}</p>
    </div>

    <div class="mt-10 grid gap-6 md:grid-cols-3 lg:mt-12">
      <article
        v-for="(item, index) in whatWeDo.items"
        :key="item.number"
        v-reveal="{ delay: index * 110 }"
        class="group flex flex-col overflow-hidden rounded-3xl bg-cream-50 shadow-soft ring-1 ring-forest-900/5 transition-transform duration-500 hover:-translate-y-1.5"
      >
        <div class="relative h-40 overflow-hidden lg:h-44">
          <img
            :src="item.image"
            :alt="item.imageAlt"
            class="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-forest-950/75 via-forest-950/10 to-transparent"
          />
          <span
            class="absolute left-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-maize-400 text-forest-950 shadow-lg"
          >
            <AppIcon :name="item.icon" class="h-5 w-5" />
          </span>
          <p
            class="absolute bottom-4 right-5 font-display text-sm font-semibold tracking-[0.2em] text-cream-100/80"
          >
            {{ item.number }}
          </p>
        </div>

        <div class="flex flex-1 flex-col p-6">
          <h3 class="font-display text-xl font-medium tracking-[-0.02em] text-forest-950">
            {{ item.title }}
          </h3>
          <p class="mt-3 text-[0.92rem] leading-relaxed text-ink-900/65">
            {{ item.body }}
          </p>
        </div>
      </article>
    </div>
  </StackedPanel>
</template>
