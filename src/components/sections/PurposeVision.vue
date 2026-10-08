<script setup>
/**
 * Purpose / Vision — the “About” band.
 *
 * Also appears on the About page at /about, where `standalone` gives it that
 * page’s single <h1>. It is never the first band on a page — on the home page
 * other panels sit above it, and on /about the footage panel opens — so it
 * always keeps the stacked-card edge that later bands slide up over.
 */
import StackedPanel from "@/components/sections/StackedPanel.vue";
import { purposeVision } from "@/data/home";

defineProps({
  /** Sits on a page of its own, so its heading becomes the page’s <h1>. */
  standalone: { type: Boolean, default: false },
});
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

        <!-- Floating credential card.
             Maize card with forest-green type, inverted from the dark-green
             card it used to be, so it reads as an accent against the panel
             rather than another block of green.

             The base `text-cream-50` came off the wrapper with the colour
             swap: white on this yellow would be invisible, and leaving it
             behind would be a trap for anything added here later. Both lines
             set their own colour.

             Contrast measured against maize-400: the year is 8.27:1, and the
             caption at 80% is 5.26:1. The caption drops to 4.14:1 at 70%,
             which fails AA, so 80% is the floor — not a taste choice. -->
        <div
          class="absolute -bottom-6 left-4 rounded-2xl bg-maize-400 px-6 py-5 shadow-card sm:left-6"
        >
          <p
            class="font-display text-3xl font-medium leading-none tracking-[-0.03em] text-forest-900"
          >
            1905
          </p>
          <p class="mt-2 text-xs uppercase tracking-[0.2em] text-forest-900/80">
            Serving Zambian<br />agriculture since
          </p>
        </div>
      </div>

      <!-- Copy -->
      <div>
        <p class="eyebrow text-forest-600" v-reveal>
          {{ purposeVision.eyebrow }}
        </p>
        <component
          :is="standalone ? 'h1' : 'h2'"
          class="section-title mt-5 text-forest-950"
          v-reveal="{ delay: 60 }"
        >
          {{ purposeVision.title }}
        </component>
        <p
          class="lede mt-5 max-w-2xl text-ink-900/70"
          v-reveal="{ delay: 120 }"
        >
          {{ purposeVision.lede }}
        </p>

        <div class="mt-9 space-y-7">
          <article
            v-for="(block, index) in purposeVision.blocks"
            :key="block.number"
            v-reveal="{ delay: 160 + index * 90 }"
            class="grid gap-3 sm:grid-cols-[auto_1fr] sm:gap-7"
          >
            <p
              class="font-display text-sm font-semibold tracking-[0.2em] text-maize-600 sm:pt-1.5"
            >
              {{ block.number }}
            </p>
            <div>
              <h3
                class="font-display text-xl font-medium tracking-[-0.02em] text-forest-950"
              >
                {{ block.heading }}
              </h3>
              <p
                class="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-ink-900/65"
              >
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
