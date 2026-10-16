<script setup>
/**
 * Membership — the standalone page at /membership.
 *
 * Answers one question, "who can join?": the lede and photograph first, then
 * the six categories as a plain ruled index (name, and who it is for). The
 * detail behind each category — notes, bands and fees — lives on
 * /types-of-membership, which this page links to rather than repeating.
 *
 * The categories are read straight from `typesOfMembership`, so the two pages
 * cannot drift apart. The "from" fee is the cheapest band of the PLACEHOLDER
 * ladder in that data and must be replaced with the Secretariat's schedule.
 */
import { ArrowRight } from "@lucide/vue";

import { membership, typesOfMembership } from "@/data/home";

const feeValue = (fee) => Number(fee.replace(/[^0-9]/g, ""));

const lowestFee = typesOfMembership.bands.reduce((lowest, band) =>
  feeValue(band.fee) < feeValue(lowest.fee) ? band : lowest,
).fee;
</script>

<template>
  <div class="mem">
    <section id="membership" class="mem-hero" aria-labelledby="mem-heading">
      <div class="mem-shell mem-hero__grid">
        <div class="mem-hero__text">
          <h1 id="mem-heading" class="mem-hero__title" v-reveal>
            {{ membership.title }}
          </h1>
          <p class="mem-hero__lede" v-reveal="{ delay: 80 }">
            {{ membership.lede }}
          </p>

          <div class="mem-hero__actions">
            <a :href="membership.cta.href" class="mem-btn mem-btn--solid">
              {{ membership.cta.label }}
              <ArrowRight class="h-4 w-4" aria-hidden="true" />
            </a>
            <a :href="membership.secondaryCta.href" class="mem-btn mem-btn--line">
              {{ membership.secondaryCta.label }}
            </a>
          </div>

          <p class="mem-hero__fee">Annual fees start from {{ lowestFee }}.</p>
        </div>

        <img
          class="mem-hero__image"
          :src="membership.image"
          :alt="membership.imageAlt"
          width="1000"
          height="1100"
          fetchpriority="high"
          decoding="async"
          v-reveal="{ delay: 140 }"
        />
      </div>
    </section>

    <section class="mem-categories" aria-labelledby="mem-cat-heading">
      <div class="mem-shell mem-categories__grid">
        <div class="mem-categories__intro">
          <h2 id="mem-cat-heading" class="mem-heading">Six ways to belong</h2>
          <p>
            {{ typesOfMembership.intro.before }}<a
              :href="typesOfMembership.intro.linkHref"
              >{{ typesOfMembership.intro.linkLabel }}</a
            >{{ typesOfMembership.intro.after }}
          </p>
          <a :href="membership.secondaryCta.href" class="mem-link">
            Fees and details by category
            <ArrowRight class="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <ul class="mem-list">
          <li v-for="category in typesOfMembership.categories" :key="category.title">
            <h3>{{ category.title }}</h3>
            <p>{{ category.whoFor }}</p>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
.mem {
  position: relative;
  z-index: 1;
  overflow: clip;
  background: var(--color-cream-50);
  color: var(--color-forest-950);
}

.mem-shell {
  width: 100%;
  max-width: var(--shell-max);
  margin-inline: auto;
  padding-inline: var(--shell-pad);
}

.mem-heading {
  font-family: var(--font-display);
  font-size: var(--section-title);
  font-weight: 500;
  letter-spacing: -0.035em;
  line-height: 1;
  text-wrap: balance;
}

/* ---- Hero ---- */
.mem-hero {
  padding-block: clamp(5.5rem, 6.5vw, 6.25rem) var(--space-section);
}

.mem-hero__grid {
  display: grid;
  gap: var(--space-gap);
  align-items: center;
}

.mem-hero__title {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: var(--page-title);
  letter-spacing: var(--page-title-tracking);
  line-height: var(--page-title-leading);
}

.mem-hero__lede {
  margin-top: 1.25rem;
  color: rgb(19 24 19 / 0.72);
  font-size: var(--page-lede);
  line-height: var(--page-lede-leading);
  max-width: var(--page-lede-measure);
}

.mem-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.75rem;
}

.mem-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  min-height: 3rem;
  padding-inline: 1.4rem;
  border-radius: 9999px;
  font-size: 0.9rem;
  font-weight: 650;
  text-decoration: none;
  transition: background-color 180ms ease, color 180ms ease;
}

.mem-btn--solid {
  background: var(--color-forest-950);
  color: #fff;
}

.mem-btn--solid:hover {
  background: var(--color-forest-700);
}

.mem-btn--line {
  border: 1px solid rgb(4 32 21 / 0.35);
}

.mem-btn--line:hover {
  background: rgb(4 32 21 / 0.06);
}

.mem-btn:focus-visible,
.mem-link:focus-visible,
.mem-categories__intro a:focus-visible {
  outline: 3px solid var(--color-forest-600);
  outline-offset: 3px;
}

.mem-hero__fee {
  margin-top: 1.1rem;
  color: rgb(19 24 19 / 0.62);
  font-size: 0.9rem;
}

.mem-hero__image {
  width: 100%;
  aspect-ratio: 5 / 4;
  border-radius: 5px;
  object-fit: cover;
  object-position: top;
}

/* ---- Categories ---- */
.mem-categories {
  padding-block: var(--space-section) var(--space-section);
  border-top: 1px solid rgb(4 32 21 / 0.2);
}

.mem-categories__grid {
  display: grid;
  gap: 1.5rem;
}

.mem-categories__intro p {
  max-width: 26rem;
  margin-top: 1rem;
  color: rgb(19 24 19 / 0.7);
  font-size: var(--page-lede);
  line-height: var(--page-lede-leading);
}

.mem-categories__intro p a {
  text-decoration: underline;
  text-underline-offset: 0.25em;
}

.mem-link {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 1.1rem;
  font-weight: 650;
  text-decoration: underline;
  text-underline-offset: 0.3em;
}

.mem-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.mem-list li {
  display: grid;
  gap: 0.35rem;
  padding-block: 1.1rem;
  border-top: 1px solid rgb(4 32 21 / 0.16);
}

.mem-list li:last-child {
  border-bottom: 1px solid rgb(4 32 21 / 0.16);
}

.mem-list h3 {
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 1.6vw, 1.4rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

.mem-list p {
  max-width: 36rem;
  color: rgb(19 24 19 / 0.68);
  font-size: var(--page-lede);
  line-height: var(--page-lede-leading);
}

@media (min-width: 48rem) {
  .mem-hero__grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
  }

  /* The photo takes its height from the text beside it, so it can never be
     taller than the copy and leave empty space around it. */
  .mem-hero__image {
    align-self: stretch;
    height: 100%;
    min-height: 12rem;
    aspect-ratio: auto;
    contain: size;
  }

  /* Intro across the top in two columns, categories below in two columns, so
     neither side is left with an empty column beside the other. */
  .mem-categories__grid {
    gap: 1.25rem;
  }

  .mem-categories__intro {
    display: grid;
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
    gap: 0 var(--space-gap);
    align-items: start;
  }

  .mem-categories__intro p {
    margin-top: 0;
    max-width: 40rem;
  }

  .mem-categories__intro .mem-link {
    grid-column: 2;
    width: fit-content;
  }

  .mem-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0 var(--space-gap);
  }

  .mem-list li:nth-last-child(2) {
    border-bottom: 1px solid rgb(4 32 21 / 0.16);
  }
}
</style>
