<script setup>
/**
 * Membership — two panels, but they are not shown together any more.
 *
 *   · Panel 1, the summary (heading, “Membership at a glance”, the CTA pair),
 *     renders ONLY on the standalone /membership page. Everything in it is a
 *     condensed repeat of `/types-of-membership` (the category list and the
 *     fee ladder are both read straight out of that page’s data), and the
 *     lede is reused verbatim on `/apply-membership`. On the home page it was
 *     therefore a second membership section restating what the two pages it
 *     links to already say, directly above a band that carries the same two
 *     buttons — so it was removed from the home page at the client’s request.
 *     It is NOT deleted: on /membership it is the page.
 *
 *   · Panel 2, the closing image band, renders on both.
 *
 * The five application steps that used to sit opposite the heading live only
 * on the Apply for Membership page, which shares them through
 * `applyMembership.steps`.
 */
import { ArrowRight } from "@lucide/vue";

import StackedPanel from "@/components/sections/StackedPanel.vue";
import { membership, typesOfMembership } from "@/data/home";

/** The category names, exactly as published on the Types of Membership page. */
const glanceCategories = typesOfMembership.categories.map(
  (category) => category.title,
);

/** Numeric value of a published fee, e.g. “ZMW 1,500” → 1500. */
const feeValue = (fee) => Number(fee.replace(/[^0-9]/g, ""));

/** The cheapest band in the published ladder — shown as published. */
const lowestFee = typesOfMembership.bands.reduce((lowest, band) =>
  feeValue(band.fee) < feeValue(lowest.fee) ? band : lowest,
).fee;

/**
 * `standalone` is true at /membership, where this section heads the page and
 * carries its single <h1>. It also decides WHERE the `#membership` anchor
 * lives — see the template.
 */
defineProps({
  standalone: { type: Boolean, default: false },
});
</script>

<template>
  <!-- Panel 1 — the summary beside the calls to action.
       Standalone page only. See the note at the top of this file. -->
  <StackedPanel
    v-if="standalone"
    id="membership"
    surface="bg-forest-50"
    :first="true"
  >
    <div class="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
      <div>
        <p class="eyebrow text-forest-600" v-reveal>{{ membership.eyebrow }}</p>
        <component
          :is="standalone ? 'h1' : 'h2'"
          class="section-title mt-5 text-forest-950"
          v-reveal="{ delay: 60 }"
        >
          {{ membership.title }}
        </component>
        <p class="lede mt-5 max-w-md text-ink-900/65" v-reveal="{ delay: 110 }">
          {{ membership.lede }}
        </p>

        <div class="mt-9 flex flex-wrap gap-3" v-reveal="{ delay: 150 }">
          <a :href="membership.cta.href" class="btn btn--forest">
            {{ membership.cta.label }}
            <ArrowRight class="h-4 w-4" aria-hidden="true" />
          </a>
          <a :href="membership.secondaryCta.href" class="btn btn--outline">
            {{ membership.secondaryCta.label }}
          </a>
        </div>
      </div>

      <!-- Membership at a glance — the categories and the starting fee, taken
           from the data the Types of Membership page publishes. -->
      <div class="membership-glance" v-reveal="{ delay: 120 }">
        <h3 class="membership-glance__title">Membership at a glance</h3>

        <ul class="membership-glance__list">
          <li
            v-for="category in glanceCategories"
            :key="category"
            class="membership-glance__item"
          >
            {{ category }}
          </li>
        </ul>

        <p class="membership-glance__fee">
          Annual fees start from {{ lowestFee }}.
        </p>
      </div>
    </div>
  </StackedPanel>

  <!-- Panel 2 — closing image panel.

       Trimmed to the subject at the client's request. It used to fill the
       viewport (`lg:min-h-screen`); the band now takes its height from its
       copy plus a deliberate strip of photograph above it, so the frame opens
       just above the farmer's hat and closes just below the buttons.

       Two things make that work together, and they must not drift apart:
         · the asset itself is cropped to the hat in `optimize-media.sh`
           (CROPS), which is what fixes the framing identically at every
           viewport — an `object-position` percentage could not, because it is
           taken from the overflow and so moves with the screen width;
         · `object-top` then pins the cropped top edge to the band's top edge
           at every size, so the hat can never slide out of frame.

       The min-height is what holds the strip of photograph open above the
       copy; the copy itself is bottom-anchored by `mt-auto`.

       On the home page this band also carries the `#membership` id, because
       the summary panel that used to hold it is no longer rendered there. Two
       things link to that anchor — the hero’s “Become a member” button and the
       member-systems “Open the market” button — so it has to keep resolving.
       It is conditional rather than unconditional because on /membership the
       summary panel already owns the id, and two elements with the same id
       would be invalid. -->
  <StackedPanel
    :id="standalone ? undefined : 'membership'"
    surface="bg-forest-950"
    tone="text-cream-50"
    bleed
  >
    <div
      class="relative flex min-h-[380px] flex-1 flex-col sm:min-h-[420px] lg:min-h-[460px]"
    >
      <img
        :src="membership.image"
        :alt="membership.imageAlt"
        class="absolute inset-0 h-full w-full object-cover object-top"
        loading="lazy"
        decoding="async"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/55 to-forest-950/25"
        aria-hidden="true"
      />

      <!-- `pt` is a floor, not the layout: `mt-auto` puts the copy on the
           band's bottom edge and the min-height above holds the photograph
           open. It only bites on a narrow screen, where the heading wraps to
           enough lines that it would otherwise ride up into the hat. -->
      <div
        class="shell relative mt-auto w-full pb-10 pt-20 sm:pb-12 sm:pt-28"
        v-reveal
      >
        <p class="eyebrow text-maize-400">
          {{ membership.imageCaption }}
        </p>
        <h2
          class="mt-4 max-w-3xl font-display text-display font-medium leading-[1.12] tracking-[-0.03em] text-cream-50"
        >
          Whoever you are in Zambian agriculture, there is a seat for you at the
          table.
        </h2>
        <div class="mt-8 flex flex-wrap gap-3">
          <a :href="membership.cta.href" class="btn btn--maize">
            {{ membership.cta.label }}
            <ArrowRight class="h-4 w-4" aria-hidden="true" />
          </a>
          <a :href="membership.secondaryCta.href" class="btn btn--ghost">
            {{ membership.secondaryCta.label }}
          </a>
        </div>
      </div>
    </div>
  </StackedPanel>
</template>

<style scoped>
/**
 * “Membership at a glance” — the categories and the starting fee, set as a
 * panel in place of the old step list.
 *
 * It sits in normal flow, so nothing here needs position, overflow, height or
 * transform: the rows are separated with borders and the panel is laid out
 * with padding and type alone.
 */
.membership-glance {
  /* 5px, matching every other card on the site — the radius scale lives on
     the Tailwind tokens in style.css. */
  border-radius: 5px;
  background-color: var(--color-cream-50);
  padding: 2rem;
  box-shadow: var(--shadow-soft);
}

.membership-glance__title {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--color-forest-950);
}

.membership-glance__list {
  margin-top: 1.25rem;
  padding: 0;
  list-style: none;
}

.membership-glance__item {
  padding: 0.7rem 0;
  font-size: 0.95rem;
  color: var(--color-forest-950);
}

/* Hairline separators between categories, and only between them. */
.membership-glance__item + .membership-glance__item {
  border-top: 1px solid
    color-mix(in oklab, var(--color-forest-900) 12%, transparent);
}

.membership-glance__fee {
  margin-top: 0.4rem;
  padding-top: 1.1rem;
  border-top: 1px solid
    color-mix(in oklab, var(--color-forest-900) 22%, transparent);
  font-size: 0.95rem;
  color: color-mix(in oklab, var(--color-ink-900) 75%, transparent);
}
</style>
