<script setup>
/**
 * Full-bleed footage panel — a visual breather between editorial panels.
 * Uses `vid 5` (rain → land preparation → soil in hand) and fills one screen.
 */
import { onMounted, ref, watch } from 'vue'

import { useInView } from '@/composables/useInView'
import { media } from '@/data/home'

const bandEl = ref(null)
const videoEl = ref(null)
const isInView = useInView(bandEl, { rootMargin: '150px' })

function play() {
  if (!videoEl.value) return
  videoEl.value.muted = true
  const attempt = videoEl.value.play()
  if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {})
}

onMounted(() => {
  if (isInView.value) play()
})

watch(isInView, (visible) => {
  if (visible) play()
  else videoEl.value?.pause()
})
</script>

<template>
  <section
    ref="bandEl"
    class="relative isolate flex flex-col justify-center overflow-hidden py-28 motion-safe:lg:sticky motion-safe:lg:top-0 lg:min-h-screen lg:rounded-t-[2rem] lg:py-0 lg:shadow-[0_-30px_80px_-45px_rgba(10,30,19,0.6)]"
  >
    <!-- Poster paints immediately; the video fades in behind the tint once it
         can play, so a slow decode never shows an empty panel. -->
    <img
      :src="media.fieldFootage.poster"
      alt=""
      class="absolute inset-0 h-full w-full object-cover"
      aria-hidden="true"
    />
    <video
      ref="videoEl"
      class="absolute inset-0 h-full w-full object-cover"
      autoplay
      muted
      loop
      playsinline
      preload="none"
      :poster="media.fieldFootage.poster"
      aria-hidden="true"
    >
      <source :src="media.fieldFootage.mp4" type="video/mp4" />
    </video>

    <!-- Duotone tint keeps the footage on-brand and the copy legible -->
    <div class="absolute inset-0 bg-forest-950/72" aria-hidden="true" />
    <div
      class="absolute inset-0 bg-gradient-to-tr from-forest-950 via-forest-950/35 to-forest-900/60"
      aria-hidden="true"
    />

    <div class="relative mx-auto max-w-4xl px-5 text-center sm:px-8 lg:py-28">
      <p class="eyebrow eyebrow--plain justify-center text-maize-400" v-reveal>
        Why the Union exists
      </p>
      <blockquote
        class="mt-6 font-display text-[clamp(1.5rem,3.2vw,2.6rem)] font-medium leading-[1.2] tracking-[-0.03em] text-cream-50"
        v-reveal="{ delay: 80 }"
      >
        “From the first rains to the last bag loaded, Zambian farmers carry the
        country. The Union exists so that burden is shared — and so the rewards
        are too.”
      </blockquote>
      <div
        class="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
        v-reveal="{ delay: 160 }"
      >
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-cream-200/60">
          Founded 1905
        </p>
        <span class="hidden h-4 w-px bg-cream-200/25 sm:block" aria-hidden="true" />
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-cream-200/60">
          Non-political
        </p>
        <span class="hidden h-4 w-px bg-cream-200/25 sm:block" aria-hidden="true" />
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-cream-200/60">
          Member-led
        </p>
      </div>
    </div>
  </section>
</template>
