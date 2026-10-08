<script setup>
/**
 * Membership — split into two panels: the routes into the Union alongside a
 * "Membership at a glance" summary, then a closing image panel carrying the
 * calls to action.
 *
 * The five application steps that used to sit opposite the heading now live
 * only on the Apply for Membership page, which shares them through
 * `applyMembership.steps`. The summary below is built from the categories and
 * the fee ladder already published on the Types of Membership page, so the two
 * can never drift apart.
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
 * Also stands alone at /membership, where it heads the page and carries the
 * page’s single <h1>.
 */
defineProps({
  standalone: { type: Boolean, default: false },
});
</script>

<template>
  <!-- Panel 1 — the summary beside the calls to action -->
  <StackedPanel id="membership" surface="bg-forest-50" :first="true">
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

  <!-- Panel 2 — closing image panel -->
  <StackedPanel surface="bg-forest-950" tone="text-cream-50" bleed>
    <div
      class="relative flex min-h-[360px] flex-1 flex-col sm:min-h-[440px] lg:min-h-screen"
    >
      <img
        :src="membership.image"
        :alt="membership.imageAlt"
        class="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/55 to-forest-950/25"
        aria-hidden="true"
      />

      <div
        class="shell relative mt-auto w-full pb-14 pt-32 lg:pb-20"
        v-reveal
      >
        <p class="eyebrow eyebrow--plain text-maize-400">
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
  border-radius: 1.5rem;
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
