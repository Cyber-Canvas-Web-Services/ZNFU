<script setup>
/** Design 2 — Membership. Maize hero panel + category tiles. */
import { ArrowRight } from "@lucide/vue";

import { membership, typesOfMembership as types } from "@/data/home";

const fee = (f) => Number(f.replace(/[^0-9]/g, ""));
const lowest = types.bands.reduce((a, b) => (fee(b.fee) < fee(a.fee) ? b : a)).fee;
</script>

<template>
  <div class="v2">
    <section id="membership" class="v2-panel v2-panel--first v2-panel--maize" aria-labelledby="v2-mem-h">
      <div class="v2-shell v2-grid-2">
        <div>
          <h1 id="v2-mem-h" class="v2-h1">{{ membership.title }}</h1>
          <p class="v2-lede" style="margin: 1rem 0 1.4rem">{{ membership.lede }}</p>
          <div class="v2-m-actions">
            <a :href="membership.cta.href" class="v2-btn v2-btn--forest">{{ membership.cta.label }} <ArrowRight class="h-4 w-4" aria-hidden="true" /></a>
            <a :href="membership.secondaryCta.href" class="v2-btn v2-btn--ghost">{{ membership.secondaryCta.label }}</a>
          </div>
          <p class="v2-small" style="margin-top: 1rem; opacity: 0.85">Annual fees start from {{ lowest }}.</p>
        </div>
        <img class="v2-img v2-m-photo" :src="membership.image" :alt="membership.imageAlt" fetchpriority="high" />
      </div>
    </section>

    <section class="v2-panel" aria-labelledby="v2-cat-h">
      <div class="v2-shell">
        <h2 id="v2-cat-h" class="v2-h2">Six ways to belong</h2>
        <p class="v2-lede" style="margin-top: 0.9rem">
          {{ types.intro.before }}<a :href="types.intro.linkHref" style="text-decoration: underline">{{ types.intro.linkLabel }}</a>{{ types.intro.after }}
        </p>
        <ul class="v2-m-grid">
          <li v-for="c in types.categories" :key="c.title">
            <h3 class="v2-h3">{{ c.title }}</h3>
            <p class="v2-small">{{ c.whoFor }}</p>
          </li>
        </ul>
        <a :href="membership.secondaryCta.href" class="v2-btn v2-btn--forest" style="margin-top: 1.5rem">Fees and details by category <ArrowRight class="h-4 w-4" aria-hidden="true" /></a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.v2-m-actions { display: flex; flex-wrap: wrap; gap: 0.6rem; }
.v2-m-photo { aspect-ratio: 5 / 4; object-position: top; }
@media (min-width: 56rem) { .v2-m-photo { align-self: stretch; height: 100%; min-height: 12rem; aspect-ratio: auto; contain: size; } }
.v2-m-grid { display: grid; gap: 0.9rem; margin: 1.5rem 0 0; padding: 0; list-style: none; }
.v2-m-grid li { display: grid; gap: 0.5rem; align-content: start; padding: 1.35rem; border-radius: 22px; background: var(--v2-page); }
.v2-m-grid li:nth-child(3n + 2) { background: var(--v2-leaf); }
.v2-m-grid li:nth-child(3n) { background: var(--v2-forest); color: #fff; }
@media (min-width: 40rem) { .v2-m-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 64rem) { .v2-m-grid { grid-template-columns: repeat(3, 1fr); } }
</style>
