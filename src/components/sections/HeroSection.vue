<script setup>
/**
 * Home page hero — one screen of full-bleed media, no scroll machinery.
 *
 * This replaces the scroll-expansion hero, whose card grew from 300×400 to
 * full-bleed across a 250vh pin. That version made the visitor perform a
 * gesture before they could read a sentence, cost a permanent scroll listener
 * and an rAF loop, and pushed everything else 2.5 screens down the page.
 *
 * The backdrop rotates, following the AgriSA reference: the background
 * montage, then stills of Zambian farmland. The stills are the only new
 * weight, and `scripts/optimize-media.sh` keeps them small.
 *
 * The video is an enhancement, never a requirement:
 *   · the poster paints immediately and carries `fetchpriority="high"`, so it
 *     can be the LCP element before a byte of video has arrived;
 *   · video and still are only mounted after the first paint, then fade in;
 *   · the video is skipped entirely for `prefers-reduced-motion`, Save-Data
 *     and 2G, in which case the hero is a calm static frame;
 *   · playback pauses when the hero scrolls away or the tab is hidden, and
 *     whenever the still is the visible slide.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ArrowRight } from '@lucide/vue'

import { useInView } from '@/composables/useInView'
import { useIsMobile, usePrefersReducedMotion } from '@/composables/useMediaQuery'
import { hero, media } from '@/data/home'

/** How long each slide holds before the backdrop changes over. */
const SLIDE_MS = 9000

const heroEl = ref(null)
const videoEl = ref(null)

const isMobile = useIsMobile()
const reducedMotion = usePrefersReducedMotion()
const isInView = useInView(heroEl, { rootMargin: '200px' })

const videoMounted = ref(false)
const videoReady = ref(false)
const stillsMounted = ref(false)
/** Decoded state per still, so one slow image cannot hold up the rotation. */
const stillReady = ref([])

/** Skip the video for visitors who asked for less, or are on a poor link. */
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

/**
 * The rotation, as a list of keys: a number per still, and the string "video"
 * for the montage.
 *
 * Order is: the opening still, then the montage, then any remaining stills.
 * Building it from what is actually available means the loop can never land on
 * a slide that does not exist — no video on a metered connection just means the
 * stills rotate on their own, in their own order.
 *
 * The montage deliberately sits second rather than first. Opening on a still
 * means the hero's first impression is a photograph, and on a slow connection
 * it is a photograph that is already there rather than a video still buffering.
 * The video then arrives as the second beat.
 */
const slides = computed(() => {
  const stills = media.heroStills.map((_, index) => index)
  if (!stills.length) return allowVideo.value ? ['video'] : []

  const [opening, ...rest] = stills
  return allowVideo.value ? [opening, 'video', ...rest] : stills
})

/* Starts on the opening still, matching slides[0]. Falls back to the montage
   only in the case where there are no stills at all. */
const activeKey = ref(media.heroStills.length ? 0 : 'video')

const videoActive = computed(() => activeKey.value === 'video')
const readyStills = computed(
  () => media.heroStills.filter((_, index) => stillReady.value[index]).length,
)

/**
 * Rotating is only worth doing when something is actually ready to rotate to,
 * and never for a visitor who asked for reduced motion — they get one still
 * frame, holding.
 */
const rotating = computed(() => {
  if (reducedMotion.value) return false
  if (allowVideo.value) return readyStills.value > 0
  return readyStills.value > 1
})

function advance() {
  const list = slides.value
  if (list.length < 2) return
  // indexOf returns -1 if the active key has just dropped out of the list, which
  // harmlessly lands on the first slide.
  activeKey.value = list[(list.indexOf(activeKey.value) + 1) % list.length]
}

function markStillReady(index) {
  const next = [...stillReady.value]
  next[index] = true
  stillReady.value = next
}

/* ---------------------------------------------------------------- */
/*  Playback                                                         */
/* ---------------------------------------------------------------- */
function play() {
  const el = videoEl.value
  if (!el) return
  // Property as well as attribute: iOS/Safari only honours muted autoplay
  // when `muted` is set from script.
  el.muted = true
  el.defaultMuted = true
  const attempt = el.play()
  if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {})
}

/** The video decodes only while it is the visible slide and on screen. */
function syncPlayback() {
  const el = videoEl.value
  if (!el) return
  const wanted =
    isInView.value && document.visibilityState === 'visible' && videoActive.value
  if (wanted) play()
  else el.pause()
}

let timer = null

function startRotation() {
  stopRotation()
  if (!rotating.value || !isInView.value) return
  timer = window.setInterval(advance, SLIDE_MS)
}

function stopRotation() {
  if (timer) {
    window.clearInterval(timer)
    timer = null
  }
}

/**
 * One place for "the page just became visible / hidden". Playback resumes
 * immediately, and the rotation timer is restarted rather than left to depend
 * on a fresh IntersectionObserver callback — a tab that starts hidden (or is
 * restored from the background) may not get one promptly.
 */
function handleVisibilityChange() {
  syncPlayback()
  if (document.visibilityState === 'visible') startRotation()
  else stopRotation()
}

onMounted(() => {
  // Mount the stills only after the first paint, so they never compete with
  // the poster or the video for the visitor's bandwidth.
  const mount = () => {
    if (allowVideo.value) videoMounted.value = true
    stillsMounted.value = true
  }
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(mount, { timeout: 1500 })
  } else {
    window.setTimeout(mount, 400)
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  stopRotation()
  videoEl.value?.pause()
})

watch(
  // `rotating` is in this list as well as its own inputs: a still can finish
  // decoding *after* the last of the other changes, and without it the timer
  // would never start because nothing would re-run it.
  [isInView, activeKey, videoMounted, rotating],
  () => {
    syncPlayback()
    if (isInView.value) startRotation()
    else stopRotation()
  },
  { flush: 'post' },
)
</script>

<template>
  <!-- The height leaves a fixed 7.5rem of the next panel showing, rather than a
       percentage. A percentage peek grows with the viewport while the panel's
       own heading offset stays roughly fixed in pixels — so on a large display
       a 12% peek is tall enough to reveal the figures underneath, and on a
       small one it is not. A fixed peek behaves identically everywhere.

       7.5rem rather than a rounder number because the peeking panel's heading
       grows with the viewport: at 1280 its heading ends ~87px below this edge,
       but at 1920 (where the fluid type tops out) it ends ~115px below. The
       peek has to clear the larger of those while still stopping short of the
       figures at ~127-148px, which pins it to this narrow band. -->
  <section
    id="hero"
    ref="heroEl"
    class="relative isolate flex min-h-[calc(100svh_-_7.5rem)] flex-col clip-safe bg-forest-950"
    aria-labelledby="hero-heading"
  >
    <!-- ============================= Media =============================
         The poster sits underneath everything and is what the visitor sees
         while the rest is still arriving. Slides cross-fade by opacity only,
         which is compositor work rather than layout. -->
    <div class="absolute inset-0 z-0" aria-hidden="true">
      <img
        :src="media.heroBackground.poster"
        alt=""
        class="absolute inset-0 h-full w-full object-cover"
        fetchpriority="high"
        decoding="async"
      />

      <template v-if="stillsMounted">
        <img
          v-for="(src, index) in media.heroStills"
          :key="src"
          :src="src"
          alt=""
          class="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-in-out"
          :class="activeKey === index ? 'opacity-100' : 'opacity-0'"
          decoding="async"
          @load="markStillReady(index)"
        />
      </template>

      <video
        v-if="videoMounted && allowVideo"
        ref="videoEl"
        class="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-in-out"
        :class="videoActive && videoReady ? 'opacity-100' : 'opacity-0'"
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

      <!-- Tint + vignette. Weighted to the top and bottom edges, where the
           header and the peeking panel sit, leaving the middle of the frame
           open so the footage actually reads. -->
      <div class="absolute inset-0 bg-forest-950/45" />
      <div
        class="absolute inset-0 bg-gradient-to-b from-forest-950/50 via-transparent to-forest-950/62"
      />
    </div>

    <!-- ============================ Content ============================
         Bottom-anchored and full-bleed, following the AgriSA reference: the
         headline sits low and to the left and the frame stays filled all the
         way across.

         This used to be a centred column inside a fixed `max-w-7xl`. On a
         2560px display that left 640px of dead margin on each side, and
         because the hero's height grows with the viewport while the headline
         did not, the copy kept shrinking relative to the space around it — the
         "awkward on big screens" problem. `justify-end` plus `.shell` (the
         shared fluid gutter) fills the frame at every resolution instead. -->
    <div
      class="shell relative z-10 flex flex-1 flex-col justify-end pb-10 pt-28 sm:pb-12"
    >
      <div v-reveal="{ delay: 40 }">
        <p
          class="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/95 py-[3px] pl-[3px] pr-2.5 shadow-md shadow-forest-950/25"
        >
          <span
            class="rounded-full bg-forest-800 px-2 py-[3px] text-chip font-semibold uppercase leading-none tracking-[0.1em] text-maize-300"
          >
            {{ hero.badge.chip }}
          </span>
          <span class="text-label font-medium leading-none tracking-[-0.005em] text-forest-950">
            {{ hero.badge.text }}
          </span>
        </p>
      </div>

      <!-- The h1 carries no reveal animation: fading it in from opacity 0
           would delay the largest contentful paint.

           It caps its own measure rather than sitting in a page-wide
           container, so the headline stays readable while the block it lives
           in still fills the width. The cap is sized for the 40px title — a
           narrower measure forced a second line at that size. -->
      <h1
        id="hero-heading"
        class="mt-5 max-w-[24ch] font-display text-hero font-semibold leading-[1.06] tracking-[-0.035em] text-white text-shadow-hero"
      >
        {{ hero.title }}
      </h1>

      <p
        v-reveal="{ delay: 120 }"
        class="mt-4 max-w-2xl text-base font-medium leading-snug tracking-[-0.01em] text-maize-200"
      >
        {{ hero.tagline }}
      </p>

      <p v-reveal="{ delay: 190 }" class="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
        {{ hero.body }}
      </p>

      <div v-reveal="{ delay: 260 }" class="mt-6 flex flex-wrap items-center gap-3">
        <a :href="hero.primaryCta.href" class="btn btn--maize">
          {{ hero.primaryCta.label }}
          <ArrowRight class="h-4 w-4" aria-hidden="true" />
        </a>
        <a :href="hero.secondaryCta.href" class="btn btn--ghost">
          {{ hero.secondaryCta.label }}
        </a>
      </div>

      <!-- Bottom meta row — the reference keeps a small wordmark and a scroll
           cue on this line. Here it holds the union name and the slide
           indicator, which also stops the indicator from floating over the
           copy on narrow screens.

           Desktop only, deliberately. It is supplementary (the union name is
           already in the badge), and on a short phone it cost ~70px of hero
           height — enough to squeeze the peeking panel down from a full 7rem
           and clip its heading. Below `sm` the hero keeps its peek instead. -->
      <div
        class="mt-10 hidden items-end justify-between gap-6 border-t border-white/15 pt-4 sm:flex"
      >
        <p class="text-label font-semibold uppercase tracking-[0.18em] text-white/60">
          {{ hero.badge.text }}
        </p>

        <div class="flex items-center gap-1.5" aria-hidden="true">
          <span
            v-for="slide in slides"
            :key="slide"
            class="h-[3px] rounded-full transition-all duration-700"
            :class="activeKey === slide ? 'w-6 bg-maize-400' : 'w-2.5 bg-white/35'"
          />
        </div>
      </div>
    </div>
  </section>
</template>
