<script setup>
/**
 * Types of Membership — a standalone page at /types-of-membership, opened
 * from the “Types of membership” buttons in the membership section.
 *
 * The categories, subscription bands and the District Farmers’ Association
 * link are exactly as supplied by the Secretariat; the wording is unchanged.
 */
import StackedPanel from "@/components/sections/StackedPanel.vue";
import { typesOfMembership } from "@/data/home";
</script>

<template>
  <!-- Band 1 — the membership categories -->
  <StackedPanel
    id="types-of-membership"
    class="types-of-membership-band"
    surface="bg-forest-50"
    :first="true"
  >
    <div>
      <p class="eyebrow text-forest-600" v-reveal>
        {{ typesOfMembership.eyebrow }}
      </p>
      <h1 class="section-title mt-5 text-forest-950" v-reveal="{ delay: 60 }">
        {{ typesOfMembership.title }}
      </h1>
      <p class="lede mt-5 max-w-2xl text-ink-900/65" v-reveal="{ delay: 110 }">
        {{ typesOfMembership.intro.before }}<a :href="typesOfMembership.intro.linkHref" class="font-medium text-forest-700 underline underline-offset-4 transition hover:text-forest-900">{{ typesOfMembership.intro.linkLabel }}</a>{{ typesOfMembership.intro.after }}
      </p>
    </div>

    <h2
      class="mt-12 font-display text-2xl font-medium tracking-[-0.03em] text-forest-950 sm:text-3xl"
      v-reveal
    >
      {{ typesOfMembership.categoriesHeading }}
    </h2>

    <div class="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="(category, index) in typesOfMembership.categories"
        :key="category.title"
        v-reveal="{ delay: 120 + index * 60 }"
        class="rounded-2xl bg-cream-50 p-6 shadow-soft ring-1 ring-forest-900/5"
      >
        <h3
          class="font-display text-lg font-medium tracking-[-0.02em] text-forest-950"
        >
          {{ category.title }}
        </h3>

        <p
          class="mt-4 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink-900/45"
        >
          Who it is for
        </p>
        <p class="mt-1.5 text-[0.92rem] leading-relaxed text-ink-900/75">
          {{ category.whoFor }}
        </p>

        <p
          class="mt-4 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink-900/45"
        >
          Notes
        </p>
        <p class="mt-1.5 text-[0.9rem] leading-relaxed text-ink-900/60">
          {{ category.notes }}
        </p>
      </article>
    </div>
  </StackedPanel>

  <!-- Band 2 — the annual subscription bands -->
  <StackedPanel
    class="types-of-membership-band"
    surface="bg-cream-100"
    compact
  >
    <h2
      class="font-display text-2xl font-medium tracking-[-0.03em] text-forest-950 sm:text-3xl"
      v-reveal
    >
      {{ typesOfMembership.bandsHeading }}
    </h2>
    <p
      class="mt-4 max-w-2xl leading-relaxed text-ink-900/65"
      v-reveal="{ delay: 60 }"
    >
      {{ typesOfMembership.bandsNote }}
    </p>

    <!-- Full-width price list: one row per band with a hairline divider. The
         fee is the largest type on the row; on phones it stacks under the
         band name instead of sitting to the right. -->
    <ul class="subscription-list">
      <li
        v-for="(band, index) in typesOfMembership.bands"
        :key="band.band"
        v-reveal="{ delay: 120 + index * 60 }"
        class="subscription-row"
      >
        <div class="subscription-row__band">
          <h3 class="subscription-row__name">{{ band.band }}</h3>
          <p class="subscription-row__ranges">
            <span class="subscription-row__range">
              <span class="subscription-row__label">
                {{ typesOfMembership.bandColumns.people }}
              </span>
              <span class="subscription-row__range-value">{{ band.people }}</span>
            </span>
            <span class="subscription-row__range">
              <span class="subscription-row__label">
                {{ typesOfMembership.bandColumns.hectares }}
              </span>
              <span class="subscription-row__range-value">{{ band.hectares }}</span>
            </span>
          </p>
        </div>

        <p class="subscription-row__fee">
          <span class="subscription-row__amount">{{ band.fee }}</span>
          <span class="subscription-row__label">
            {{ typesOfMembership.bandColumns.fee }}
          </span>
        </p>
      </li>
    </ul>
  </StackedPanel>
</template>

<style scoped>
/**
 * Both bands hold more than a screen of content. A panel pinned to the top
 * of the viewport (StackedPanel’s default on large screens) that is taller
 * than the screen traps everything below the fold, so these bands stay in
 * normal flow — the same approach as the Apply for Membership page.
 */
.types-of-membership-band {
  position: relative;
}

/**
 * Band 2 as a full-width price list: one row per band, hairline dividers and
 * the annual fee as the largest type on the row. Phones stack the fee beneath
 * the band name; from `sm` up it sits at the far right.
 *
 * Only spacing, borders, flex and type are set here — no position, height,
 * overflow or transform — so the rows stay in the bands’ normal flow.
 */
.subscription-list {
  margin-top: 2.5rem;
  padding: 0;
  list-style: none;
  border-top: 1px solid
    color-mix(in oklab, var(--color-forest-900) 12%, transparent);
  border-bottom: 1px solid
    color-mix(in oklab, var(--color-forest-900) 12%, transparent);
}

.subscription-row {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem 0;
}

.subscription-row + .subscription-row {
  border-top: 1px solid
    color-mix(in oklab, var(--color-forest-900) 12%, transparent);
}

.subscription-row__name {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--color-forest-950);
}

.subscription-row__ranges {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  column-gap: 1.75rem;
  row-gap: 0.35rem;
  margin: 0.6rem 0 0;
}

.subscription-row__range {
  display: inline-flex;
  align-items: baseline;
  gap: 0.5rem;
}

.subscription-row__range-value {
  font-size: 0.92rem;
  color: color-mix(in oklab, var(--color-ink-900) 75%, transparent);
}

.subscription-row__fee {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 0;
}

.subscription-row__amount {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--color-forest-950);
}

.subscription-row__label {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: color-mix(in oklab, var(--color-ink-900) 45%, transparent);
}

@media (min-width: 40rem) {
  .subscription-row {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    gap: 2rem;
  }

  .subscription-row__fee {
    align-items: flex-end;
    text-align: right;
  }

  .subscription-row__amount {
    font-size: 2rem;
  }
}
</style>
