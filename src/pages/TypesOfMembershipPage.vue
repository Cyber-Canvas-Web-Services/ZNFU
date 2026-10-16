<script setup>
/**
 * Types of Membership — the standalone page at /types-of-membership.
 *
 * Both blocks are comparisons, so both are real tables: the six categories
 * (who each is for, and how it pays) and the annual subscription bands. On
 * phones each row collapses into a stacked block whose cells carry their own
 * column label, so nothing scrolls sideways.
 *
 * The categories and the District Farmers’ Association link are exactly as
 * supplied by the Secretariat. The band ranges and fees are PLACEHOLDERS (see
 * `typesOfMembership.bands`) and must be replaced before launch.
 */
import { ArrowRight } from "@lucide/vue";

import { membership, typesOfMembership as types } from "@/data/home";
</script>

<template>
  <div class="tom">
    <section id="types-of-membership" class="tom-hero" aria-labelledby="tom-heading">
      <div class="tom-shell tom-hero__grid">
        <h1 id="tom-heading" class="tom-hero__title" v-reveal>{{ types.title }}</h1>
        <p class="tom-hero__lede" v-reveal="{ delay: 80 }">
          {{ types.intro.before
          }}<a :href="types.intro.linkHref">{{ types.intro.linkLabel }}</a
          >{{ types.intro.after }}
        </p>
      </div>
    </section>

    <!-- Categories -->
    <section class="tom-block" aria-labelledby="tom-cat-heading">
      <div class="tom-shell">
        <h2 id="tom-cat-heading" class="tom-heading">{{ types.categoriesHeading }}</h2>

        <table class="tom-table tom-table--categories">
          <thead>
            <tr>
              <th scope="col">Category</th>
              <th scope="col">Who it is for</th>
              <th scope="col">How it pays</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in types.categories" :key="category.title">
              <th scope="row">{{ category.title }}</th>
              <td data-label="Who it is for">{{ category.whoFor }}</td>
              <td data-label="How it pays">{{ category.notes }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Subscription bands -->
    <section class="tom-bands" aria-labelledby="tom-bands-heading">
      <div class="tom-shell tom-bands__grid">
        <div class="tom-bands__intro">
          <h2 id="tom-bands-heading" class="tom-heading">{{ types.bandsHeading }}</h2>
          <p>{{ types.bandsNote }}</p>
          <a :href="membership.cta.href" class="tom-bands__cta">
            {{ membership.cta.label }}
            <ArrowRight class="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <table class="tom-table tom-table--bands">
          <thead>
            <tr>
              <th scope="col">{{ types.bandColumns.band }}</th>
              <th scope="col">{{ types.bandColumns.people }}</th>
              <th scope="col">{{ types.bandColumns.hectares }}</th>
              <th scope="col" class="tom-num">{{ types.bandColumns.fee }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="band in types.bands" :key="band.band">
              <th scope="row">{{ band.band }}</th>
              <td :data-label="types.bandColumns.people">{{ band.people }}</td>
              <td :data-label="types.bandColumns.hectares">{{ band.hectares }}</td>
              <td class="tom-num" :data-label="types.bandColumns.fee">{{ band.fee }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<style scoped>
.tom {
  position: relative;
  z-index: 1;
  overflow: clip;
  background: var(--color-cream-50);
  color: var(--color-forest-950);
}

.tom-shell {
  width: 100%;
  max-width: var(--shell-max);
  margin-inline: auto;
  padding-inline: var(--shell-pad);
}

.tom-heading {
  font-family: var(--font-display);
  font-size: var(--section-title);
  font-weight: 500;
  letter-spacing: -0.035em;
  line-height: 1.02;
  text-wrap: balance;
}

/* ---- Hero ---- */
.tom-hero {
  padding-block: clamp(5.5rem, 6.5vw, 6.25rem) var(--space-section);
}

.tom-hero__grid {
  display: block;
}

.tom-hero__title {
  font-family: var(--font-display);
  font-weight: 500;
  text-wrap: balance;
  font-size: var(--page-title);
  letter-spacing: var(--page-title-tracking);
  line-height: var(--page-title-leading);
}

.tom-hero__lede {
  margin-top: 1rem;
  color: rgb(19 24 19 / 0.72);
  font-size: var(--page-lede);
  line-height: var(--page-lede-leading);
  max-width: var(--page-lede-measure);
}

.tom-hero__lede a,
.tom-bands__cta {
  text-decoration: underline;
  text-underline-offset: 0.25em;
}

.tom-hero__lede a:focus-visible,
.tom-bands__cta:focus-visible {
  outline: 3px solid var(--color-forest-600);
  outline-offset: 3px;
}

/* ---- Shared table (stacked on phones) ---- */
.tom-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.tom-table thead {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}

.tom-table tbody tr {
  display: grid;
  gap: 0.6rem;
  padding-block: 1.1rem;
  border-top: 1px solid rgb(4 32 21 / 0.16);
}

.tom-table tbody tr:last-child {
  border-bottom: 1px solid rgb(4 32 21 / 0.16);
}

.tom-table tbody th {
  font-family: var(--font-display);
  font-weight: 500;
}

.tom-table td::before {
  display: block;
  margin-bottom: 0.15rem;
  color: rgb(19 24 19 / 0.52);
  font-size: 0.8rem;
  content: attr(data-label);
}

/* ---- Categories ---- */
.tom-block {
  padding-block: var(--space-section) var(--space-section);
}

.tom-table--categories {
  margin-top: 1.25rem;
}

.tom-table--categories tbody th {
  font-size: clamp(1.2rem, 1.6vw, 1.4rem);
  letter-spacing: -0.02em;
  line-height: 1.15;
}

.tom-table--categories td {
  color: rgb(19 24 19 / 0.72);
  font-size: var(--page-lede);
  line-height: var(--page-lede-leading);
}

/* ---- Bands ---- */
.tom-bands {
  padding-block: var(--space-section);
  background: var(--color-maize-400);
  color: var(--color-forest-950);
}

.tom-bands__grid {
  display: grid;
  gap: 1.5rem;
  align-items: start;
}

.tom-bands__intro p {
  max-width: 26rem;
  margin-top: 0.9rem;
  font-size: var(--page-lede);
  line-height: var(--page-lede-leading);
  color: rgb(4 32 21 / 0.82);
  line-height: 1.65;
}

.tom-bands__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 1.1rem;
  color: var(--color-forest-950);
  font-weight: 650;
}

.tom-table--bands tbody tr {
  border-color: rgb(4 32 21 / 0.35);
}

.tom-table--bands td::before {
  color: rgb(4 32 21 / 0.62);
}

.tom-table--bands tbody th {
  font-size: 1.2rem;
}

.tom-table--bands tbody .tom-num {
  color: var(--color-forest-950);
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 1.9vw, 1.75rem);
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}

@media (min-width: 48rem) {
  .tom-bands__grid {
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
    gap: var(--space-gap);
  }

  /* The note and button stay in view beside the long table. */
  .tom-bands__intro {
    position: sticky;
    top: 6.5rem;
  }

  /* Real table layout again: headers return, cells sit on shared columns. */
  .tom-table thead {
    position: static;
    width: auto;
    height: auto;
    overflow: visible;
    clip-path: none;
  }

  .tom-table thead th {
    padding: 0.5rem 1.25rem 0.6rem 0;
    color: rgb(19 24 19 / 0.55);
    font-size: 0.82rem;
    font-weight: 500;
  }

  .tom-table--bands thead th {
    color: rgb(4 32 21 / 0.62);
  }

  .tom-table tbody tr {
    display: table-row;
  }

  .tom-table tbody th,
  .tom-table tbody td {
    padding: 1.1rem 1.25rem 1.1rem 0;
    border-top: 1px solid rgb(4 32 21 / 0.16);
    vertical-align: baseline;
  }

  .tom-table--bands tbody th,
  .tom-table--bands tbody td {
    border-top-color: rgb(4 32 21 / 0.35);
  }

  .tom-table tbody tr {
    border: 0;
  }

  .tom-table tbody tr:last-child th,
  .tom-table tbody tr:last-child td {
    border-bottom: 1px solid rgb(4 32 21 / 0.16);
  }

  .tom-table--bands tbody tr:last-child th,
  .tom-table--bands tbody tr:last-child td {
    border-bottom-color: rgb(4 32 21 / 0.35);
  }

  .tom-table td::before {
    display: none;
  }

  .tom-table--categories th[scope="row"] {
    width: 24%;
  }

  .tom-table .tom-num {
    padding-right: 0;
    text-align: right;
  }
}
</style>
