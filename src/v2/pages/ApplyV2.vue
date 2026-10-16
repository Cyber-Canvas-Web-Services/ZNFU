<script setup>
/** Design 2 — Apply for Membership. Five numbered steps and a contact panel. */
import { Mail, MapPin, Phone } from "@lucide/vue";

import { applyMembership, contact } from "@/data/home";
</script>

<template>
  <div class="v2">
    <section id="apply-membership" class="v2-panel v2-panel--first v2-panel--maize" aria-labelledby="v2-a-h">
      <div class="v2-shell v2-grid-2">
        <h1 id="v2-a-h" class="v2-h1">{{ applyMembership.title }}</h1>
        <p class="v2-lede">{{ applyMembership.lede }}</p>
      </div>
    </section>

    <section class="v2-panel" aria-label="How to apply">
      <div class="v2-shell">
        <ol class="v2-ap-steps">
          <li v-for="step in applyMembership.steps" :key="step.number">
            <span class="v2-ap-num" aria-hidden="true">{{ Number(step.number) }}</span>
            <h2 class="v2-h3">{{ step.title }}</h2>
            <p class="v2-small">{{ step.body }}</p>
          </li>
        </ol>
      </div>
    </section>

    <section class="v2-panel v2-panel--forest" aria-labelledby="v2-ac-h">
      <div class="v2-shell v2-grid-2">
        <h2 id="v2-ac-h" class="v2-h2">{{ applyMembership.contactHeading }}</h2>
        <ul class="v2-ap-contact">
          <li><MapPin aria-hidden="true" /><address><span v-for="l in contact.addressLines" :key="l">{{ l }}</span></address></li>
          <li><Phone aria-hidden="true" /><span><a v-for="p in contact.phones" :key="p" :href="`tel:${p.replace(/\s/g, '')}`">{{ p }}</a></span></li>
          <li><Mail aria-hidden="true" /><a :href="`mailto:${contact.email}`">{{ contact.email }}</a></li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
.v2-ap-steps { display: grid; gap: 0.9rem; margin: 0; padding: 0; list-style: none; }
.v2-ap-steps li { display: grid; gap: 0.5rem; align-content: start; padding: 1.4rem; border-radius: 22px; background: var(--v2-page); }
.v2-ap-num { display: grid; width: 3rem; height: 3rem; place-items: center; border-radius: 50%; background: var(--v2-forest); color: var(--v2-maize); font-size: 1.4rem; font-weight: 650; }
.v2-ap-contact { display: grid; gap: 1rem; margin: 0; padding: 0; list-style: none; font-size: 1.15rem; line-height: 1.5; }
.v2-ap-contact li { display: flex; gap: 0.8rem; }
.v2-ap-contact svg { width: 1.2rem; height: 1.2rem; flex: none; margin-top: 0.3rem; color: var(--v2-maize); }
.v2-ap-contact address, .v2-ap-contact li > span { display: grid; font-style: normal; }
.v2-ap-contact a { color: inherit; text-decoration: underline; text-underline-offset: 0.2em; }
@media (min-width: 40rem) { .v2-ap-steps { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 64rem) { .v2-ap-steps { grid-template-columns: repeat(3, 1fr); } }
</style>
