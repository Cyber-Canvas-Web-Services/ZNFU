<script setup>
/** Design 2 — Types of Membership. Category tiles with a notes line, then a band table. */
import { ArrowRight } from "@lucide/vue";

import { membership, typesOfMembership as types } from "@/data/home";
</script>

<template>
  <div class="v2">
    <section id="types-of-membership" class="v2-panel v2-panel--first" aria-labelledby="v2-t-h">
      <div class="v2-shell v2-grid-2">
        <h1 id="v2-t-h" class="v2-h1">{{ types.title }}</h1>
        <p class="v2-lede">
          {{ types.intro.before }}<a :href="types.intro.linkHref" style="text-decoration: underline">{{ types.intro.linkLabel }}</a>{{ types.intro.after }}
        </p>
      </div>
    </section>

    <section class="v2-panel v2-panel--leaf" aria-labelledby="v2-c-h">
      <div class="v2-shell">
        <h2 id="v2-c-h" class="v2-h2">{{ types.categoriesHeading }}</h2>
        <ul class="v2-t-grid">
          <li v-for="c in types.categories" :key="c.title">
            <h3 class="v2-h3">{{ c.title }}</h3>
            <p class="v2-t-label">Who it is for</p>
            <p>{{ c.whoFor }}</p>
            <p class="v2-t-label">How it pays</p>
            <p>{{ c.notes }}</p>
          </li>
        </ul>
      </div>
    </section>

    <section class="v2-panel v2-panel--forest" aria-labelledby="v2-b-h">
      <div class="v2-shell v2-grid-2" style="align-items: start">
        <div>
          <h2 id="v2-b-h" class="v2-h2">{{ types.bandsHeading }}</h2>
          <p class="v2-lede" style="margin: 0.9rem 0 1.25rem">{{ types.bandsNote }}</p>
          <a :href="membership.cta.href" class="v2-btn v2-btn--maize">{{ membership.cta.label }} <ArrowRight class="h-4 w-4" aria-hidden="true" /></a>
        </div>
        <ul class="v2-t-bands">
          <li v-for="b in types.bands" :key="b.band">
            <div>
              <p class="v2-h3">{{ b.band }}</p>
              <p class="v2-small">{{ types.bandColumns.people }}: {{ b.people }} · {{ types.bandColumns.hectares }}: {{ b.hectares }}</p>
            </div>
            <p class="v2-t-fee">{{ b.fee }}</p>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
.v2-t-grid { display: grid; gap: 0.9rem; margin: 1.5rem 0 0; padding: 0; list-style: none; }
.v2-t-grid li { display: grid; gap: 0.3rem; align-content: start; padding: 1.35rem; border-radius: 22px; background: #fff; line-height: 1.55; }
.v2-t-label { margin-top: 0.6rem; font-size: 0.8rem; font-weight: 600; opacity: 0.55; }
.v2-t-bands { display: grid; gap: 0.6rem; margin: 0; padding: 0; list-style: none; }
.v2-t-bands li { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.5rem 1rem; padding: 1rem 1.25rem; border-radius: 20px; background: rgb(255 255 255 / 0.1); }
.v2-t-fee { color: var(--v2-maize); font-size: clamp(1.5rem, 2.4vw, 2.1rem); font-weight: 650; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; }
@media (min-width: 40rem) { .v2-t-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 64rem) { .v2-t-grid { grid-template-columns: repeat(3, 1fr); } }
</style>
