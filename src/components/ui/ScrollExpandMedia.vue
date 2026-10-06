<script setup>
/**
 * ScrollExpandMedia
 * =====================================================================
 * Vue 3 translation of the React `scroll-expansion-hero` component.
 *
 * What changed from the original (and why):
 *   · `useState` → `ref`, `useEffect` → `onMounted`/`watch`, and the
 *     `"use client"` directive dropped (there is no server boundary).
 *   · framer-motion `motion.div` opacity tweens → inline style bindings
 *     driven by scroll progress, so no animation dependency is needed.
 *   · next/image → plain <img> + an ffmpeg-extracted poster frame.
 *   · **No wheel/touch hijacking.** The original called preventDefault()
 *     on every wheel event, which trapped the page and broke trackpad,
 *     keyboard and assistive scrolling. Here the section is tall with a
 *     `position: sticky` child, so expansion is driven by *native* scroll
 *     progress and the page still scrolls normally.
 *   · `prefers-reduced-motion` renders a static, unpinned hero.
 *
 * Layout: the outer <section> is `pinHeight` tall; the inner sticky child
 * fills the viewport and is clipped. Progress 0 → 1 is the distance the
 * sticky child travels through the pin.
 * =====================================================================
 */
import { computed, onMounted, ref, watch } from 'vue'
import { ArrowDown } from '@lucide/vue'

import { useIsMobile, usePrefersReducedMotion } from '@/composables/useMediaQuery'
import { useScrollProgress } from '@/composables/useScrollProgress'
import { useViewportSize } from '@/composables/useViewportSize'

const props = defineProps({
  /** 'video' | 'image' — what the expanding card plays. */
  mediaType: { type: String, default: 'video' },
  /** Expanding card sources. */
  mediaSrc: { type: String, default: '' },
  mediaPoster: { type: String, default: '' },
  /** Ambient background layer sources. */
  bgMediaSrc: { type: String, default: '' },
  bgMediaPoster: { type: String, default: '' },

  /** Headline — the first word and the remainder slide apart. */
  title: { type: String, default: '' },
  eyebrow: { type: String, default: '' },
  scrollHint: { type: String, default: '' },
  /** Blend the headline with the media underneath (mix-blend-difference). */
  textBlend: { type: Boolean, default: false },

  /** Scroll length of the pinned section, in vh. */
  pinHeight: { type: Number, default: 250 },
  pinHeightMobile: { type: Number, default: 200 },
  /** Frozen progress used when the visitor prefers reduced motion. */
  staticProgress: { type: Number, default: 0.34 },
})

const pinEl = ref(null)
const foregroundVideo = ref(null)
const backgroundVideo = ref(null)

const isMobile = useIsMobile()
const reducedMotion = usePrefersReducedMotion()

/* Scroll progress is only tracked when the hero is actually animated. */
const { progress: scrollProgress, isInView } = useScrollProgress(pinEl, {
  enabled: computed(() => !reducedMotion.value),
})

/** Drives every derived value below. */
const progress = computed(() =>
  reducedMotion.value ? props.staticProgress : scrollProgress.value,
)

/* ---------------------------------------------------------------- */
/*  Expansion maths (adapted from the React original)                */
/*                                                                  */
/*  Performance note: the card box genuinely changes size *and        */
/*  aspect* as it opens (roughly 0.75 → 1.79). Animating width/height */
/*  on an element that contains a <video> forces the browser to       */
/*  re-layout and re-rasterise the video layer every frame, which was */
/*  measured as the single most expensive thing on this page.         */
/*                                                                    */
/*  So the media is laid out ONCE at the card's maximum size and      */
/*  never resized. Instead its framing is adjusted with a composited  */
/*  `transform: scale()` that reproduces exactly what `object-cover`  */
/*  would have produced at the current card size:                     */
/*                                                                    */
/*      scale = max(cardW / stageW, cardH / stageH)                   */
/*                                                                    */
/*  The card still animates width/height, but it now only moves its   */
/*  own clip box (a cheap paint) rather than resizing a video layer.  */
/* ---------------------------------------------------------------- */
const viewport = useViewportSize()

/** The largest the card can ever get — also the media's fixed layout size. */
const stageWidth = computed(() => viewport.width.value * 0.95)
const stageHeight = computed(() => viewport.height.value * 0.85)

/** Current card size, clamped in JS so the scale below stays exact. */
const cardWidth = computed(() => {
  const natural = 300 + progress.value * (isMobile.value ? 650 : 1250)
  return Math.min(natural, stageWidth.value)
})

const cardHeight = computed(() => {
  const natural = 400 + progress.value * (isMobile.value ? 200 : 400)
  return Math.min(natural, stageHeight.value)
})

const metrics = computed(() => ({
  // The headline slides out of frame as the media takes over. Frozen at 0
  // for reduced motion so the title stays centred and readable.
  textShift: reducedMotion.value ? 0 : progress.value * (isMobile.value ? 180 : 150),
}))

const cardStyle = computed(() => ({
  width: `${cardWidth.value}px`,
  height: `${cardHeight.value}px`,
}))

/** Uniform scale keeping the fixed-size media covering the card. */
const mediaScale = computed(() => {
  if (!stageWidth.value || !stageHeight.value) return 1
  return Math.max(cardWidth.value / stageWidth.value, cardHeight.value / stageHeight.value)
})

/**
 * Applied to the video/image inside the card. Width and height are constant
 * for the whole pin; only `scale` changes, and that is GPU work.
 */
const mediaStyle = computed(() => ({
  width: `${stageWidth.value}px`,
  height: `${stageHeight.value}px`,
  transform: `translate(-50%, -50%) scale(${mediaScale.value})`,
}))

/**
 * Background dims away as the foreground card fills the screen. Once it is
 * fully transparent we also stop decoding it — at that point it is a
 * full-screen video contributing nothing but battery drain.
 */
const backgroundOpacity = computed(() => Math.max(0, 1 - progress.value))
const backgroundStillVisible = computed(() => backgroundOpacity.value > 0.01)
/** Card scrim eases off as the media expands. */
const cardScrim = computed(() => Math.max(0.12, 0.58 - progress.value * 0.34))
/**
 * Headline dissolves as it slides apart, so a half-clipped word never sits
 * awkwardly against the viewport edge.
 */
const headlineOpacity = computed(() =>
  Math.min(Math.max(1 - progress.value * 1.25, 0), 1),
)
/** Scroll cue and progress bar fade out before the card fills the frame. */
const cueOpacity = computed(() => Math.min(Math.max(1 - progress.value * 1.9, 0), 1))
/** End-state content panel appears only at full expansion. */
const overlayOpacity = computed(() =>
  Math.min(Math.max((progress.value - 0.82) / 0.18, 0), 1),
)
const overlayInteractive = computed(() => overlayOpacity.value > 0.6)
/**
 * The end-state panel is only added to the DOM once the expansion is nearly
 * complete. It carries a `backdrop-filter`, which forces the browser to
 * re-sample everything beneath it — expensive to keep mounted over a playing
 * video for the whole duration of the pin.
 */
const overlayMounted = computed(() => overlayOpacity.value > 0.01)

const pinHeightCss = computed(() => {
  if (reducedMotion.value) return '100vh'
  return `${isMobile.value ? props.pinHeightMobile : props.pinHeight}vh`
})

const headlineWords = computed(() => {
  const parts = props.title.trim().split(/\s+/).filter(Boolean)
  return { first: parts[0] ?? '', rest: parts.slice(1).join(' ') }
})

/* ---------------------------------------------------------------- */
/*  Video handling — muted autoplay + pause when off screen          */
/* ---------------------------------------------------------------- */
const useForegroundVideo = computed(
  () => props.mediaType === 'video' && !reducedMotion.value && Boolean(props.mediaSrc),
)
const useBackgroundVideo = computed(
  () => !reducedMotion.value && Boolean(props.bgMediaSrc),
)
const foregroundImage = computed(() =>
  props.mediaType === 'image' ? props.mediaSrc : props.mediaPoster,
)
const backgroundImage = computed(() => props.bgMediaPoster || props.bgMediaSrc)

function play(el) {
  if (!el) return
  // Property (not just attribute) so iOS/Safari always honours muted autoplay.
  el.muted = true
  el.defaultMuted = true
  const attempt = el.play()
  if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {})
}

function pause(el) {
  el?.pause()
}

onMounted(() => {
  play(foregroundVideo.value)
  play(backgroundVideo.value)
})

/* Stop decoding video while the hero is off screen — saves battery/CPU.
   The background is also parked once it has faded out entirely. */
watch([isInView, backgroundStillVisible], ([visible, bgVisible]) => {
  if (visible) {
    play(foregroundVideo.value)
    if (bgVisible) play(backgroundVideo.value)
    else pause(backgroundVideo.value)
  } else {
    pause(foregroundVideo.value)
    pause(backgroundVideo.value)
  }
})
</script>

<template>
  <section
    id="hero"
    ref="pinEl"
    class="relative w-full"
    :style="{ height: pinHeightCss }"
    aria-labelledby="hero-heading"
  >
    <div class="sticky top-0 h-[100dvh] w-full overflow-hidden bg-forest-950">
      <!-- ============================ Background layer ============================ -->
      <!-- No CSS transition here: the opacity is already animated per frame
           from scroll progress, and a transition would restart every frame. -->
      <div
        class="absolute inset-0 z-0"
        :style="{ opacity: reducedMotion ? 1 : backgroundOpacity }"
        aria-hidden="true"
      >
        <video
          v-if="useBackgroundVideo"
          ref="backgroundVideo"
          class="absolute inset-0 h-full w-full object-cover"
          autoplay
          muted
          loop
          playsinline
          preload="metadata"
          :poster="bgMediaPoster"
        >
          <source :src="bgMediaSrc" type="video/mp4" />
        </video>
        <img
          v-else-if="backgroundImage"
          :src="backgroundImage"
          alt=""
          class="absolute inset-0 h-full w-full object-cover"
        />

        <!-- Tint + vignette: enough to keep the headline legible without
             hiding the footage. Weighted to the top and bottom edges, where
             the header and scroll cue sit, leaving the middle open. -->
        <div class="absolute inset-0 bg-forest-950/45" />
        <div
          class="absolute inset-0 bg-gradient-to-b from-forest-950/50 via-transparent to-forest-950/62"
        />
      </div>

      <!-- ======================================================================
           Reduced motion: a static, unpinned hero. No expansion, no video, and
           every piece of content — including the calls to action — is present
           and reachable in the normal flow.
           ====================================================================== -->
      <div
        v-if="reducedMotion"
        class="absolute inset-0 z-20 flex flex-col items-center justify-center px-5 py-16 text-center"
      >
        <h1
          id="hero-heading"
          class="max-w-3xl font-display text-[clamp(2.2rem,6vw,4.4rem)] font-medium leading-[1.05] tracking-[-0.03em] text-white text-shadow-hero"
        >
          {{ title }}
        </h1>

        <div
          class="mt-10 w-full max-w-xl rounded-3xl border border-white/15 bg-forest-950/60 p-7 backdrop-blur-md sm:p-9"
        >
          <slot name="overlay" />
        </div>
      </div>

      <!-- ===================== Animated hero (default) ========================= -->
      <template v-else>
        <!-- Expanding card -->
        <div
          class="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 [contain:layout_paint]"
          :style="cardStyle"
        >
        <div
          class="relative h-full w-full overflow-hidden rounded-[20px] shadow-card ring-1 ring-white/15 sm:rounded-[26px]"
        >
          <!-- Laid out once at stage size (see `mediaStyle`); never resized.
               `max-w-none` is required because Tailwind's preflight caps media
               at max-width:100%, which would otherwise clamp the stage. -->
          <video
            v-if="useForegroundVideo"
            ref="foregroundVideo"
            class="absolute left-1/2 top-1/2 max-w-none object-cover will-change-transform"
            :style="mediaStyle"
            autoplay
            muted
            loop
            playsinline
            preload="auto"
            :poster="mediaPoster"
          >
            <source :src="mediaSrc" type="video/mp4" />
          </video>
          <img
            v-else-if="foregroundImage"
            :src="foregroundImage"
            alt=""
            class="absolute left-1/2 top-1/2 max-w-none object-cover will-change-transform"
            :style="mediaStyle"
          />

          <!-- Animated via opacity (compositor-friendly) rather than by
               interpolating a background-color string, which repaints. -->
          <div class="absolute inset-0 bg-forest-950" :style="{ opacity: cardScrim }" />
          <div class="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
        </div>
      </div>

      <!-- ======================== Headline (splits & slides) ====================== -->
      <h1 id="hero-heading" class="sr-only">{{ title }}</h1>
      <div
        class="pointer-events-none absolute inset-x-0 top-1/2 z-20 -translate-y-1/2 px-4 text-center"
        :class="textBlend ? 'mix-blend-difference' : ''"
        :style="{ opacity: headlineOpacity }"
        aria-hidden="true"
      >
        <span
          class="block font-display text-[clamp(2.1rem,7.6vw,5.6rem)] font-medium leading-[1.02] tracking-[-0.03em] text-white text-shadow-hero"
          :style="{ transform: `translate3d(${-metrics.textShift}vw, 0, 0)` }"
        >
          {{ headlineWords.first }}
        </span>
        <span
          v-if="headlineWords.rest"
          class="mt-1 block font-display text-[clamp(1.6rem,5.4vw,4.2rem)] font-medium leading-[1.06] tracking-[-0.03em] text-maize-100 text-shadow-hero"
          :style="{ transform: `translate3d(${metrics.textShift}vw, 0, 0)` }"
        >
          {{ headlineWords.rest }}
        </span>
      </div>

      <!-- ========================== Scroll cue + progress ========================= -->
      <div
        class="absolute inset-x-0 bottom-0 z-30 flex flex-col items-center gap-3 px-6 pb-7 sm:pb-9"
        :style="{ opacity: cueOpacity }"
        :aria-hidden="cueOpacity < 0.2"
      >
        <p v-if="eyebrow" class="text-[0.66rem] font-semibold uppercase tracking-[0.32em] text-white/70">
          {{ eyebrow }}
        </p>
        <p v-if="scrollHint" class="flex items-center gap-2 text-sm font-medium text-white/90">
          {{ scrollHint }}
          <ArrowDown class="h-4 w-4 animate-nudge" aria-hidden="true" />
        </p>
        <div
          class="mt-1 h-[3px] w-44 overflow-hidden rounded-full bg-white/20"
          role="progressbar"
          :aria-valuenow="Math.round(progress * 100)"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Hero expansion progress"
        >
          <!-- scaleX rather than width: no layout, just a composited transform. -->
          <div
            class="h-full w-full origin-left rounded-full bg-maize-400"
            :style="{ transform: `scaleX(${progress})` }"
          />
        </div>
      </div>

      <!-- ============================ Revealed content ===========================
           Mounted only once the media is nearly expanded. Its backdrop-filter
           samples the layer beneath it, so keeping it out of the tree during
           the expansion avoids re-blurring a playing video every frame. -->
      <div
        v-if="overlayMounted"
        class="absolute inset-0 z-40 flex items-center justify-center px-5"
        :style="{
          opacity: overlayOpacity,
          pointerEvents: overlayInteractive ? 'auto' : 'none',
        }"
        :inert="overlayInteractive ? undefined : true"
        :aria-hidden="overlayOpacity < 0.6"
      >
        <div
          class="w-full max-w-xl rounded-3xl border border-white/15 bg-forest-950/55 p-7 text-center shadow-card backdrop-blur-md sm:p-9"
        >
          <slot name="overlay" />
        </div>
      </div>
      </template>
    </div>
  </section>

  <!-- Content revealed after the expansion, in normal document flow. -->
  <div v-if="$slots.default" class="relative z-10">
    <slot />
  </div>
</template>
