<script setup>
/**
 * Home page hero — a single, unpinned screen of background footage.
 *
 * This replaces the scroll-expansion hero: a video card that grew from
 * 300×400 to full-bleed across a 250vh scroll pin. That version made the
 * visitor perform a scroll gesture before they could read a single sentence,
 * and it cost a permanent scroll listener, an rAF progress loop and two
 * promoted compositor layers — all of which are now gone.
 *
 * What is left is deliberately plain: one screen of the existing background
 * montage, a badge, an <h1>, a line of copy and two calls to action. Crucially
 * the hero is `min-h-[90svh]` rather than `100svh`, so the next section peeks
 * ~10% above the fold and there is visibly something to scroll towards.
 *
 * The video is an enhancement, never a requirement:
 *   · the poster <img> paints immediately and carries `fetchpriority="high"`,
 *     so it can be the LCP element before a byte of video has arrived;
 *   · the <video> is only mounted after the first paint, then cross-fades in;
 *   · it is skipped entirely for `prefers-reduced-motion`, for Save-Data, and
 *     on 2G connections;
 *   · it is paused when scrolled out of view or when the tab is hidden, so a
 *     decorative loop never holds the CPU while nobody is looking at it.
 *
 * Two encodes exist — 1280×720 for desktop and 960×540 for phones. Phones get
 * the smaller file rather than no file; the difference is a couple of hundred
 * kilobytes. Both are produced by `scripts/optimize-media.sh`.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ArrowRight } from '@lucide/vue'

import { useInView } from '@/composables/useInView'
import { useIsMobile, usePrefersReducedMotion } from '@/composables/useMediaQuery'
import { hero, media } from '@/data/home'

const heroEl = ref(null)
const videoEl = ref(null)

const isMobile = useIsMobile()
const reducedMotion = usePrefersReducedMotion()
const isInView = useInView(heroEl, { rootMargin: '200px' })

const videoMounted = ref(false)
const videoReady = ref(false)

/**
 * Skip the video for visitors who asked for reduced motion, switched on
 * Save-Data, or are on a 2G connection. The poster alone carries the hero.
 */
const allowVideo = computed(() => {
  if (reducedMotion.value) return false
  const connection = navigator.connection
  if (!connection) return true
  if (connection.saveData) return false
  return !/(^|-)2g$/.test(connection.effectiveType ?? '')
})

const videoSrc = computed(() =>
  isMobile.value ? media.heroBackground.mp4Mobile : media.heroBackground.mp4,
)

function play() {
  const el = videoEl.value
  if (!el) return
  // Set the property as well as the attribute: iOS/Safari only honours muted
  // autoplay when `muted` is set in script.
  el.muted = true
  el.defaultMuted = true
  const attempt = el.play()
  if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {})
}

/** Park the decoder whenever the hero is off screen or the tab is hidden. */
function syncPlayback() {
  const el = videoEl.value
  if (!el) return
  if (isInView.value && document.visibilityState === 'visible') play()
  else el.pause()
}

onMounted(() => {
  // Mount the video only after the first paint, so the poster can paint the
  // hero without a video download competing for bandwidth.
  const mount = () => {
    if (allowVideo.value) videoMounted.value = true
  }
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(mount, { timeout: 1200 })
  } else {
    window.setTimeout(mount, 300)
  }

  document.addEventListener('visibilitychange', syncPlayback)
})

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', syncPlayback)
  videoEl.value?.pause()
})

watch([isInView, videoMounted], syncPlayback, { flush: 'post' })
</script>

<template>
  <section
    id="hero"
    ref="heroEl"
    class="relative isolate flex min-h-[90svh] flex-col overflow-hidden bg-forest-950"
    aria-labelledby="hero-heading"
  >
    <!-- ============================ Media ============================ -->
    <div class="absolute inset-0 z-0" aria-hidden="true">
      <!-- Poster first, always. This is what the visitor sees when the video
           is still buffering, deliberately skipped, or unsupported. -->
      <img
        :src="media.heroBackground.poster"
        alt=""
        class="absolute inset-0 h-full w-full object-cover"
        fetchpriority="high"
        decoding="async"
      />

      <!-- The video fades in over the poster once it can actually play, so a
           slow decode never reveals an empty frame. -->
      <video
        v-if="videoMounted && allowVideo"
        ref="videoEl"
        class="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out"
        :class="videoReady ? 'opacity-100' : 'opacity-0'"
        autoplay
        muted
        loop
        playsinline
        preload="auto"
        tabindex="-1"
        disablepictureinpicture
        @canplay="videoReady = true"
        @playing="videoReady = true"
      >
        <source :src="videoSrc" type="video/mp4" />
      </video>

      <!-- Tint + vignette: enough to keep the headline legible without hiding
           the footage. Weighted to the top and bottom edges, where the header
           and the peeking section sit, leaving the middle of the frame open. -->
      <div class="absolute inset-0 bg-forest-950/45" />
      <div
        class="absolute inset-0 bg-gradient-to-b from-forest-950/50 via-transparent to-forest-950/62"
      />
    </div>

    <!-- ======================== Brand light ========================
         Plain blurred gradients rather than the reference's SVG
         `feGaussianBlur` rects — a CSS filter on a static layer composites
         once, whereas an SVG filter re-rasterises every frame. -->
    <div
      class="pointer-events-none absolute -left-28 -top-24 z-0 h-[440px] w-[380px] -rotate-[28deg] rounded-[40px] bg-gradient-to-b from-maize-300/25 to-maize-100/0 blur-3xl"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute -bottom-36 -right-20 z-0 h-[400px] w-[320px] -rotate-[28deg] rounded-[36px] bg-gradient-to-b from-forest-400/20 to-transparent blur-3xl"
      aria-hidden="true"
    />

    <!-- ============================ Content ============================
         `pt` clears the fixed header; `pb` keeps the calls to action clear of
         the next section's peeking edge. Both are sized so the stack stays
         inside 90svh — outgrow it and the hero eats its own peek, which is
         what happens on short phones from about 8.2% back up to 10%. -->
    <div
      class="relative z-10 flex flex-1 flex-col items-center justify-center px-5 pb-14 pt-24 text-center sm:px-8"
    >
      <!-- Badge -->
      <div v-reveal="{ delay: 40 }">
        <p
          class="inline-flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 rounded-full border-2 border-white bg-white/95 p-1 pr-4 shadow-lg shadow-forest-950/30"
        >
          <span
            class="rounded-full bg-forest-800 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-maize-300 sm:text-[0.68rem] sm:tracking-[0.16em]"
          >
            {{ hero.badge.chip }}
          </span>
          <span
            class="text-xs font-medium tracking-[-0.01em] text-forest-950 sm:text-sm"
          >
            {{ hero.badge.text }}
          </span>
        </p>
      </div>

      <!-- The h1 deliberately carries no reveal animation: fading it in from
           opacity 0 would delay the largest contentful paint.
           `max-w-6xl` is not decorative — the headline measures 1084px on one
           line at its largest size, so anything narrower forces a second line
           and the hero grows past the peek it is supposed to leave behind. -->
      <h1
        id="hero-heading"
        class="mt-7 max-w-6xl font-display text-[clamp(2.4rem,7.4vw,5.75rem)] font-medium leading-[1.02] tracking-[-0.035em] text-white text-shadow-hero"
      >
        {{ hero.title }}
      </h1>

      <p
        v-reveal="{ delay: 140 }"
        class="mt-6 max-w-2xl font-display text-[clamp(1.15rem,2.2vw,1.6rem)] font-medium leading-snug tracking-[-0.02em] text-maize-200"
      >
        {{ hero.tagline }}
      </p>

      <p
        v-reveal="{ delay: 220 }"
        class="mt-5 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base"
      >
        {{ hero.body }}
      </p>

      <div
        v-reveal="{ delay: 300 }"
        class="mt-9 flex flex-wrap items-center justify-center gap-3"
      >
        <a :href="hero.primaryCta.href" class="btn btn--maize">
          {{ hero.primaryCta.label }}
          <ArrowRight class="h-4 w-4" aria-hidden="true" />
        </a>
        <a :href="hero.secondaryCta.href" class="btn btn--ghost">
          {{ hero.secondaryCta.label }}
        </a>
      </div>
    </div>
  </section>
</template>
