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
/* ---------------------------------------------------------------- */
const metrics = computed(() => {
  const mobile = isMobile.value
  return {
    width: 300 + progress.value * (mobile ? 650 : 1250),
    height: 400 + progress.value * (mobile ? 200 : 400),
    // The headline slides out of frame as the media takes over. Frozen at 0
    // for reduced motion so the title stays centred and readable.
    textShift: reducedMotion.value ? 0 : progress.value * (mobile ? 180 : 150),
  }
})

const cardStyle = computed(() => ({
  width: `${metrics.value.width}px`,
  height: `${metrics.value.height}px`,
  maxWidth: '95vw',
  maxHeight: '85vh',
}))

/** Background dims away as the foreground card fills the screen. */
const backgroundOpacity = computed(() => Math.max(0, 1 - progress.value))
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

/* Stop decoding video while the hero is off screen — saves battery/CPU. */
watch(isInView, (visible) => {
  if (visible) {
    play(foregroundVideo.value)
    play(backgroundVideo.value)
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
      <div
        class="absolute inset-0 z-0 transition-opacity duration-150 ease-out"
        :style="{ opacity: reducedMotion ? 1 : backgroundOpacity }"
        aria-hidden="true"
      >
        <video
          v-if="useBackgroundVideo"
          ref="backgroundVideo"
          class="absolute inset-0 h-full w-full animate-kenburns object-cover [filter:blur(3px)_saturate(0.72)_brightness(0.88)]"
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
          class="absolute inset-0 h-full w-full object-cover [filter:blur(3px)_saturate(0.72)_brightness(0.88)]"
        />

        <!-- Tint + vignette so the headline always has contrast -->
        <div class="absolute inset-0 bg-forest-950/78" />
        <div
          class="absolute inset-0 bg-gradient-to-b from-forest-950/85 via-forest-950/30 to-forest-950/90"
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
          class="max-w-3xl font-display text-[clamp(2.2rem,6vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.02em] text-white text-shadow-hero"
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
          class="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
          :style="cardStyle"
        >
        <div
          class="relative h-full w-full overflow-hidden rounded-[20px] shadow-card ring-1 ring-white/15 sm:rounded-[26px]"
        >
          <video
            v-if="useForegroundVideo"
            ref="foregroundVideo"
            class="absolute inset-0 h-full w-full object-cover"
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
            class="absolute inset-0 h-full w-full object-cover"
          />

          <div
            class="absolute inset-0"
            :style="{ backgroundColor: `rgb(4 20 12 / ${cardScrim})` }"
          />
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
          class="block font-display text-[clamp(2.1rem,7.6vw,5.6rem)] font-semibold leading-[0.98] tracking-[-0.02em] text-white text-shadow-hero"
          :style="{ transform: `translate3d(${-metrics.textShift}vw, 0, 0)` }"
        >
          {{ headlineWords.first }}
        </span>
        <span
          v-if="headlineWords.rest"
          class="mt-1 block font-display text-[clamp(1.6rem,5.4vw,4.2rem)] font-semibold leading-[1.04] tracking-[-0.02em] text-maize-100 text-shadow-hero"
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
          <div
            class="h-full rounded-full bg-maize-400"
            :style="{ width: `${progress * 100}%` }"
          />
        </div>
      </div>

      <!-- ============================ Revealed content =========================== -->
      <div
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
