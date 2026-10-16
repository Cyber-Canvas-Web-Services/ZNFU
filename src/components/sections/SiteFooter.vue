<script setup>
import { Mail, MapPin, Phone } from "@lucide/vue";

import BrandMark from "@/components/BrandMark.vue";
import SocialIcon from "@/components/ui/SocialIcon.vue";
import { brand, contact, footer, navLinks } from "@/data/home";

const year = new Date().getFullYear();
</script>

<template>
  <footer id="contact" class="site-footer">
    <div class="shell">
      <div class="site-footer__grid">
        <section class="site-footer__brand">
          <BrandMark compact />
          <h2>{{ brand.fullName }}</h2>
          <p>{{ footer.mission }}</p>
        </section>

        <section
          v-for="column in footer.columns"
          :key="column.title"
          class="site-footer__column"
        >
          <h3>{{ column.title }}</h3>
          <ul>
            <li v-for="link in column.links" :key="link.label">
              <a :href="link.href">{{ link.label }}</a>
            </li>
          </ul>
        </section>

        <section class="site-footer__column site-footer__contact">
          <h3>Contact</h3>
          <ul>
            <li>
              <MapPin aria-hidden="true" />
              <address>
                <span v-for="line in contact.addressLines" :key="line">
                  {{ line }}
                </span>
              </address>
            </li>
            <li>
              <Phone aria-hidden="true" />
              <span>
                <a
                  v-for="phone in contact.phones"
                  :key="phone"
                  :href="`tel:${phone.replace(/\s/g, '')}`"
                >
                  {{ phone }}
                </a>
              </span>
            </li>
            <li>
              <Mail aria-hidden="true" />
              <a :href="`mailto:${contact.email}`">{{ contact.email }}</a>
            </li>
          </ul>
        </section>
      </div>

      <div class="site-footer__bottom">
        <p>© {{ year }} {{ brand.fullName }}. All rights reserved.</p>

        <ul class="site-footer__socials" aria-label="Social media">
          <li v-for="social in contact.socials" :key="social.network">
            <a
              :href="social.href"
              :aria-label="social.label"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SocialIcon :network="social.network" :label="social.label" />
            </a>
          </li>
        </ul>
      </div>

      <nav class="sr-only" aria-label="Footer sitemap">
        <a v-for="link in navLinks" :key="link.href" :href="link.href">
          {{ link.label }}
        </a>
      </nav>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  position: relative;
  z-index: 10;
  overflow: clip;
  background: #152a13;
  color: #cbd6ca;
  padding-block: clamp(1.75rem, 3vw, 2.5rem);
}

.site-footer__brand {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.site-footer__brand :deep(.inline-flex) {
  transform-origin: left center;
  scale: 1.05;
}

.site-footer__brand h2 {
  margin-top: 0.75rem;
  color: #fff;
  font-family: var(--font-sans);
  font-size: 1rem;
  font-weight: 650;
  line-height: 1.3;
}

.site-footer__brand p {
  max-width: 19rem;
  margin-top: 0.65rem;
  color: #c2ccd1;
  font-size: 0.8125rem;
  line-height: 1.6;
}

.site-footer__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.75rem;
}

.site-footer__column h3 {
  margin: 0 0 0.85rem;
  color: #fff;
  font-family: var(--font-sans);
  font-size: 0.8125rem;
  font-weight: 650;
  letter-spacing: 0.1em;
  line-height: 1.25;
  text-transform: uppercase;
}

.site-footer__column ul {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.site-footer__column a {
  color: #c2ccd1;
  font-size: 0.875rem;
  line-height: 1.45;
  text-decoration: none;
  transition: color 180ms ease;
}

.site-footer__column a:hover {
  color: #fff;
}

.site-footer__contact li {
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  color: #c2ccd1;
  font-size: 0.8125rem;
  line-height: 1.55;
}

.site-footer__contact svg {
  width: 1rem;
  height: 1rem;
  flex: none;
  margin-top: 0.2rem;
  color: var(--color-maize-400);
}

.site-footer__contact address,
.site-footer__contact li > span {
  display: flex;
  flex-direction: column;
  font-style: normal;
}

.site-footer__bottom {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: clamp(2rem, 3vw, 2.5rem);
  padding-top: 1rem;
  border-top: 1px solid rgb(255 255 255 / 0.12);
  color: rgb(203 214 202 / 0.68);
  font-size: 0.75rem;
}

.site-footer__socials {
  display: flex;
  gap: 0.65rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.site-footer__socials a {
  display: grid;
  width: 2.25rem;
  height: 2.25rem;
  place-items: center;
  border: 1px solid rgb(255 255 255 / 0.2);
  border-radius: 50%;
  color: #fff;
  transition:
    border-color 180ms ease,
    background-color 180ms ease,
    color 180ms ease;
}

.site-footer__socials a:hover {
  border-color: var(--color-maize-400);
  background: var(--color-maize-400);
  color: #152a13;
}

@media (min-width: 40rem) {
  .site-footer__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .site-footer__bottom {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

@media (min-width: 64rem) {
  .site-footer__grid {
    grid-template-columns:
      minmax(14rem, 1.3fr)
      minmax(0, 0.7fr)
      minmax(0, 0.9fr)
      minmax(17rem, 1.2fr);
    gap: clamp(1.5rem, 2vw, 2.25rem);
  }
}
</style>
