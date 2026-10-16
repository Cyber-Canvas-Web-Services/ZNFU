<script setup>
import { Mail, MapPin, Phone } from "@lucide/vue";

import SocialIcon from "@/components/ui/SocialIcon.vue";
import { brand, contact, footer } from "@/data/home";

const year = new Date().getFullYear();
</script>

<template>
  <footer id="contact" class="v2 v2-footer">
    <div class="v2-panel v2-panel--forest v2-footer__panel">
      <div class="v2-shell">
        <p class="v2-footer__big" aria-hidden="true">Growing Zambia, together.</p>

        <div class="v2-footer__grid">
          <section>
            <h2 class="v2-footer__name">{{ brand.fullName }}</h2>
            <p class="v2-small">{{ footer.mission }}</p>
            <ul class="v2-footer__socials" aria-label="Social media">
              <li v-for="social in contact.socials" :key="social.network">
                <a :href="social.href" :aria-label="social.label" target="_blank" rel="noopener noreferrer">
                  <SocialIcon :network="social.network" :label="social.label" />
                </a>
              </li>
            </ul>
          </section>

          <section v-for="column in footer.columns" :key="column.title">
            <h3 class="v2-footer__title">{{ column.title }}</h3>
            <ul>
              <li v-for="link in column.links" :key="link.label">
                <a :href="link.href">{{ link.label }}</a>
              </li>
            </ul>
          </section>

          <section>
            <h3 class="v2-footer__title">Contact</h3>
            <ul class="v2-footer__contact">
              <li>
                <MapPin aria-hidden="true" />
                <address>
                  <span v-for="line in contact.addressLines" :key="line">{{ line }}</span>
                </address>
              </li>
              <li>
                <Phone aria-hidden="true" />
                <span>
                  <a v-for="phone in contact.phones" :key="phone" :href="`tel:${phone.replace(/\s/g, '')}`">{{ phone }}</a>
                </span>
              </li>
              <li>
                <Mail aria-hidden="true" />
                <a :href="`mailto:${contact.email}`">{{ contact.email }}</a>
              </li>
            </ul>
          </section>
        </div>

        <p class="v2-footer__legal">© {{ year }} {{ brand.fullName }}. {{ footer.meta.replaceAll(" · ", " · ") }}</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.v2-footer {
  padding-top: 0.25rem;
}

.v2-footer__panel {
  margin-bottom: var(--v2-gutter);
  background: var(--v2-forest-deep);
}

.v2-footer__big {
  max-width: 14ch;
  font-family: var(--font-sans);
  font-size: clamp(2rem, 4.6vw, 4rem);
  font-weight: 650;
  letter-spacing: -0.05em;
  line-height: 0.92;
  color: var(--v2-maize);
}

.v2-footer__grid {
  display: grid;
  gap: 2rem;
  margin-top: clamp(1.75rem, 4vw, 3rem);
  padding-top: 1.75rem;
  border-top: 1.5px solid rgb(255 255 255 / 0.2);
}

.v2-footer__name {
  margin-bottom: 0.6rem;
  font-size: 1.1rem;
  font-weight: 650;
}

.v2-footer__title {
  margin-bottom: 0.8rem;
  color: var(--v2-maize);
  font-size: 0.95rem;
  font-weight: 600;
}

.v2-footer ul {
  display: grid;
  gap: 0.45rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.v2-footer a {
  color: rgb(243 246 238 / 0.85);
  text-decoration: none;
}

.v2-footer a:hover {
  color: #fff;
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.v2-footer__socials {
  display: flex !important;
  gap: 0.5rem !important;
  margin-top: 1rem !important;
}

.v2-footer__socials a {
  display: grid;
  width: 2.5rem;
  height: 2.5rem;
  place-items: center;
  border: 1.5px solid rgb(255 255 255 / 0.35);
  border-radius: 9999px;
}

.v2-footer__contact li {
  display: flex;
  gap: 0.65rem;
  line-height: 1.5;
}

.v2-footer__contact svg {
  width: 1rem;
  height: 1rem;
  flex: none;
  margin-top: 0.25rem;
  color: var(--v2-maize);
}

.v2-footer__contact address,
.v2-footer__contact li > span {
  display: grid;
  font-style: normal;
}

.v2-footer__legal {
  margin-top: 1.75rem;
  font-size: 0.85rem;
  opacity: 0.6;
}

@media (min-width: 48rem) {
  .v2-footer__grid {
    grid-template-columns: 1.3fr 0.8fr 0.9fr 1.2fr;
  }
}
</style>
