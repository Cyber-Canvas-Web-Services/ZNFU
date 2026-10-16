<script setup>
/** Design 2 — Contact. Three big contact tiles. */
import { Mail, MapPin, Phone } from "@lucide/vue";

import SocialIcon from "@/components/ui/SocialIcon.vue";
import { brand, contact } from "@/data/home";
</script>

<template>
  <div class="v2">
    <section id="contact-page" class="v2-panel v2-panel--first v2-panel--leaf" aria-labelledby="v2-c-h">
      <div class="v2-shell v2-grid-2">
        <div>
          <h1 id="v2-c-h" class="v2-h1">Talk to the ZNFU Secretariat</h1>
          <p class="v2-lede" style="margin-top: 1rem">
            Reach the {{ brand.fullName }} at the Secretariat in Lusaka — by post, by phone or by email.
          </p>
          <ul class="v2-c-social" aria-label="Follow the Union">
            <li v-for="s in contact.socials" :key="s.network">
              <a :href="s.href" :aria-label="s.label" target="_blank" rel="noopener noreferrer"><SocialIcon :network="s.network" :label="s.label" /></a>
            </li>
          </ul>
        </div>

        <div class="v2-c-tiles">
          <a class="v2-c-tile v2-c-tile--forest" :href="`mailto:${contact.email}`">
            <Mail aria-hidden="true" />
            <span>Email the Union</span>
            <strong>{{ contact.email }}</strong>
          </a>
          <div class="v2-c-tile v2-c-tile--maize">
            <Phone aria-hidden="true" />
            <span>Call the Secretariat</span>
            <a v-for="p in contact.phones" :key="p" :href="`tel:${p.replace(/\s/g, '')}`"><strong>{{ p }}</strong></a>
          </div>
          <div class="v2-c-tile">
            <MapPin aria-hidden="true" />
            <span>Visit or write</span>
            <address><strong v-for="l in contact.addressLines" :key="l">{{ l }}</strong></address>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.v2-c-social { display: flex; gap: 0.5rem; margin: 1.5rem 0 0; padding: 0; list-style: none; }
.v2-c-social a { display: grid; width: 2.9rem; height: 2.9rem; place-items: center; border: 1.5px solid var(--v2-forest); border-radius: 50%; }
.v2-c-social a:hover { background: var(--v2-forest); color: #fff; }
.v2-c-tiles { display: grid; gap: 0.8rem; }
.v2-c-tile { display: grid; gap: 0.3rem; padding: 1.4rem; border-radius: 22px; background: #fff; color: var(--v2-ink); text-decoration: none; }
.v2-c-tile--forest { background: var(--v2-forest); color: #fff; }
.v2-c-tile--maize { background: var(--v2-maize); }
.v2-c-tile svg { width: 1.4rem; height: 1.4rem; margin-bottom: 0.4rem; }
.v2-c-tile span { font-size: 0.88rem; opacity: 0.75; }
.v2-c-tile strong { font-size: clamp(1.25rem, 2.2vw, 1.8rem); font-weight: 650; letter-spacing: -0.03em; overflow-wrap: anywhere; line-height: 1.2; }
.v2-c-tile address { display: grid; font-style: normal; }
.v2-c-tile a { color: inherit; width: fit-content; }
</style>
