<script setup>
/**
 * Home page hero — the scroll-expansion centrepiece.
 *
 * `vid 2` (drone sweep over a cattle herd) is the card that expands to fill
 * the screen; `vid 4` (top-down ploughing) is the ambient background layer.
 * Swap either clip in `src/data/home.js`.
 */
import { ArrowRight, Sprout } from '@lucide/vue'

import ScrollExpandMedia from '@/components/ui/ScrollExpandMedia.vue'
import { hero, media } from '@/data/home'
</script>

<template>
  <ScrollExpandMedia
    media-type="video"
    :media-src="media.heroForeground.mp4"
    :media-poster="media.heroForeground.poster"
    :bg-media-src="media.heroBackground.mp4"
    :bg-media-poster="media.heroBackground.poster"
    :title="hero.title"
    :eyebrow="hero.eyebrow"
    :scroll-hint="hero.scrollHint"
    :pin-height="250"
    :pin-height-mobile="200"
  >
    <!-- Appears once the media has fully expanded -->
    <template #overlay>
      <span class="eyebrow eyebrow--plain justify-center text-maize-300">
        <Sprout class="h-4 w-4" aria-hidden="true" />
        Zambia National Farmers’ Union
      </span>

      <p class="mt-4 font-display text-2xl font-semibold leading-tight text-white sm:text-3xl">
        {{ hero.tagline }}
      </p>

      <p class="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">
        {{ hero.body }}
      </p>

      <div class="mt-7 flex flex-wrap items-center justify-center gap-3">
        <a :href="hero.primaryCta.href" class="btn btn--maize">
          {{ hero.primaryCta.label }}
          <ArrowRight class="h-4 w-4" aria-hidden="true" />
        </a>
        <a :href="hero.secondaryCta.href" class="btn btn--ghost">
          {{ hero.secondaryCta.label }}
        </a>
      </div>
    </template>
  </ScrollExpandMedia>
</template>
