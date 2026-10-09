<script setup>
/**
 * Full-bleed footage panel — a visual breather between editorial panels.
 * Uses `vid 5` (rain → land preparation → soil in hand).
 *
 * The band hugs its copy: `py-16 → lg:py-24` around the text and no minimum
 * height. It used to fill the viewport (`lg:min-h-screen`), which put a full
 * screen of footage between two editorial panels to carry ~200px of words —
 * measured 900px of band around a 428px content block, so more than half of
 * it was empty. The card edge stays, so the panel below still slides up over
 * it.
 *
 * It also opens the About page, where it is the first band on the page rather
 * than one mid-stack. `standalone` drops the card edge that is only wanted
 * when a later band slides up over this one — at the top of a page it would
 * draw a rounded corner and an upward shadow above the header.
 */
import { onMounted, ref, watch } from "vue";

import { useInView } from "@/composables/useInView";
import { media } from "@/data/home";

defineProps({
  /** Rendered as the top band of its own page rather than mid-stack. */
  standalone: { type: Boolean, default: false },
});

const bandEl = ref(null);
const videoEl = ref(null);
const isInView = useInView(bandEl, { rootMargin: "150px" });

function play() {
  if (!videoEl.value) return;
  videoEl.value.muted = true;
  const attempt = videoEl.value.play();
  if (attempt && typeof attempt.catch === "function") attempt.catch(() => {});
}

onMounted(() => {
  if (isInView.value) play();
});

watch(isInView, (visible) => {
  if (visible) play();
  else videoEl.value?.pause();
});
</script>

<template>
  <!-- NOT sticky, deliberately — this band scrolls with the page.

       It used to pin like the other panels, and that had two costs:

       1. A pinned element never leaves the viewport, so the intersection
          observer below reported this band as permanently visible. The video
          therefore kept decoding after later panels had painted over it —
          measured still playing at 4.95s under `what-we-do` and 7.47s under
          `systems`, entirely hidden behind them. A full-screen clip decoding
          for two screens of scrolling it cannot be seen through.
       2. One fewer permanently composited layer in the sticky stack.

       Scrolling normally means the band genuinely leaves the viewport, the
       observer fires, and the video pauses. Panels above and below keep their
       pinning, so the card-stack still reads.

       The card edge stays: the previous panel is still pinned, so this band
       still slides up over it. -->
  <section
    ref="bandEl"
    class="relative isolate flex flex-col justify-center clip-safe py-16 sm:py-20 lg:py-24"
    :class="
      standalone
        ? ''
        : 'lg:rounded-t-card lg:shadow-[0_-16px_44px_-26px_rgba(10,30,19,0.28)]'
    "
  >
    <!-- Poster paints immediately and stays put underneath. No `autoplay`
         attribute on purpose: with it present the browser fetches the whole
         clip on page load no matter what `preload` says. The intersection
         observer above starts playback when the panel is actually near. -->
    <img
      :src="media.fieldFootage.poster"
      alt=""
      class="absolute inset-0 h-full w-full object-cover"
      aria-hidden="true"
    />
    <video
      ref="videoEl"
      class="absolute inset-0 h-full w-full object-cover"
      muted
      loop
      playsinline
      preload="none"
      :poster="media.fieldFootage.poster"
      aria-hidden="true"
    >
      <source :src="media.fieldFootage.mp4" type="video/mp4" />
    </video>

    <!-- Duotone tint keeps the footage on-brand and the copy legible.
         Lightened from /72 so more of the video reads through — but only to
         /64, not further.

         The blockquote and the gold eyebrow sit directly on this, and the tint
         is the only thing holding their contrast against footage that ranges
         from dark soil to bright rain-splash. Measured against a white frame
         (the worst case any footage could present):
           at /72  cream body text ≈ 5.8:1
           at /64  cream body text ≈ 5.1:1   ← still passes AA
           at /58  cream body text ≈ 4.2:1   ← would fail AA for body text
         /64 is the lightest tint that keeps the copy compliant, so it is the
         floor. Every value is a true alpha (…/64, …/88), not a hexadecimal
         colour, so the alpha channel is honoured rather than dropped. -->
    <div class="absolute inset-0 bg-forest-950/64" aria-hidden="true" />
    <div
      class="absolute inset-0 bg-gradient-to-tr from-forest-950/88 via-forest-950/28 to-forest-900/50"
      aria-hidden="true"
    />

    <div class="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
      <p class="eyebrow justify-center text-maize-400" v-reveal>
        Why the Union exists
      </p>
      <blockquote
        class="mt-6 font-display text-display font-medium leading-[1.2] tracking-[-0.03em] text-cream-50"
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
        <p
          class="text-xs font-semibold uppercase tracking-[0.24em] text-cream-200/60"
        >
          Founded 1905
        </p>
        <span
          class="hidden h-4 w-px bg-cream-200/25 sm:block"
          aria-hidden="true"
        />
        <p
          class="text-xs font-semibold uppercase tracking-[0.24em] text-cream-200/60"
        >
          Non-political
        </p>
        <span
          class="hidden h-4 w-px bg-cream-200/25 sm:block"
          aria-hidden="true"
        />
        <p
          class="text-xs font-semibold uppercase tracking-[0.24em] text-cream-200/60"
        >
          Member-led
        </p>
      </div>
    </div>
  </section>
</template>
