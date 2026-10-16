<script setup>
/**
 * Contact — the standalone page at /contact.
 *
 * One screen: a photograph of the Union's people on the left, and on the right
 * the title, a short description and the ways to reach the Secretariat as a
 * ruled list, finishing with the social links. The photograph takes its height
 * from the text column, so neither side leaves empty space.
 *
 * Every detail already sits in the shared data: the same address, phone
 * numbers, email and social accounts the footer shows. Nothing is new.
 *
 * The section id is `contact-page`, not `contact` — the footer owns that id
 * and renders on every page, so reusing it would put two elements on one id.
 */
import { Mail, MapPin, Phone } from "@lucide/vue";

import SocialIcon from "@/components/ui/SocialIcon.vue";
import { brand, contact, media } from "@/data/home";
</script>

<template>
  <div class="ct">
    <section id="contact-page" class="ct-main" aria-labelledby="ct-heading">
      <div class="ct-shell ct-grid">
        <img
          class="ct-photo"
          :src="media.fieldSoybeanTeam"
          alt="Farmers and Union staff talking in a soybean field"
          fetchpriority="high"
          decoding="async"
        />

        <div class="ct-text">
          <h1 id="ct-heading" class="ct-title" v-reveal>Talk to the ZNFU Secretariat</h1>
          <p class="ct-lede" v-reveal="{ delay: 80 }">
            Reach the {{ brand.fullName }} at the Secretariat in Lusaka — by
            post, by phone or by email.
          </p>

          <ul class="ct-ways">
            <li>
              <span class="ct-ways__icon" aria-hidden="true"><Mail class="h-5 w-5" /></span>
              <div>
                <h2>Email the Union</h2>
                <a :href="`mailto:${contact.email}`">{{ contact.email }}</a>
              </div>
            </li>
            <li>
              <span class="ct-ways__icon" aria-hidden="true"><Phone class="h-5 w-5" /></span>
              <div>
                <h2>Call the Secretariat</h2>
                <a
                  v-for="phone in contact.phones"
                  :key="phone"
                  :href="`tel:${phone.replace(/\s/g, '')}`"
                  >{{ phone }}</a
                >
              </div>
            </li>
            <li>
              <span class="ct-ways__icon" aria-hidden="true"><MapPin class="h-5 w-5" /></span>
              <div>
                <h2>Visit or write</h2>
                <address>
                  <span v-for="line in contact.addressLines" :key="line">{{ line }}</span>
                </address>
              </div>
            </li>
          </ul>

          <div class="ct-social">
            <h2>Follow the Union</h2>
            <ul>
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
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.ct {
  position: relative;
  z-index: 1;
  background: var(--color-cream-50);
  color: var(--color-forest-950);
}

.ct-shell {
  width: 100%;
  max-width: var(--shell-max);
  margin-inline: auto;
  padding-inline: var(--shell-pad);
}

.ct-main {
  padding-block: clamp(5.5rem, 6.5vw, 6.25rem) var(--space-section);
}

.ct-grid {
  display: grid;
  gap: var(--space-gap);
}

.ct-photo {
  width: 100%;
  height: 16rem;
  border-radius: 5px;
  object-fit: cover;
}

.ct-title {
  font-family: var(--font-display);
  font-size: var(--page-title);
  font-weight: 500;
  letter-spacing: var(--page-title-tracking);
  line-height: var(--page-title-leading);
}

.ct-lede {
  max-width: var(--page-lede-measure);
  margin-top: 1rem;
  color: rgb(19 24 19 / 0.72);
  font-size: var(--page-lede);
  line-height: var(--page-lede-leading);
}

/* ---- Ways to reach us ---- */
.ct-ways {
  margin: 1.5rem 0 0;
  padding: 0;
  list-style: none;
}

.ct-ways > li {
  display: grid;
  grid-template-columns: 2.75rem minmax(0, 1fr);
  gap: 1rem;
  padding-block: 1.1rem;
  border-top: 1px solid rgb(4 32 21 / 0.2);
}

.ct-ways__icon {
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  place-items: center;
  border-radius: 50%;
  background: var(--color-maize-400);
}

.ct-ways h2,
.ct-social h2 {
  color: rgb(19 24 19 / 0.62);
  font-size: 0.9rem;
  font-weight: 560;
}

.ct-ways a,
.ct-ways address span {
  display: block;
  width: fit-content;
  margin-top: 0.2rem;
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 1.6vw, 1.4rem);
  font-weight: 500;
  letter-spacing: -0.015em;
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.ct-ways address {
  font-style: normal;
}

/* The postal address is reading text, not a link to act on, so it takes the
   body size rather than the larger link size. */
.ct-ways address span {
  font-family: var(--font-sans);
  font-size: var(--page-lede);
  font-weight: 400;
  letter-spacing: normal;
  line-height: 1.55;
}

.ct-ways a {
  text-decoration: underline;
  text-decoration-color: rgb(4 32 21 / 0.3);
  text-underline-offset: 0.2em;
  transition: text-decoration-color 180ms ease;
}

.ct-ways a:hover {
  text-decoration-color: var(--color-forest-950);
}

/* ---- Social ---- */
.ct-social {
  padding-top: 1.1rem;
  border-top: 1px solid rgb(4 32 21 / 0.2);
}

.ct-social ul {
  display: flex;
  gap: 0.6rem;
  margin: 0.6rem 0 0;
  padding: 0;
  list-style: none;
}

.ct-social a {
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  place-items: center;
  border: 1px solid rgb(4 32 21 / 0.3);
  border-radius: 50%;
  transition: background-color 180ms ease, border-color 180ms ease;
}

.ct-social a:hover {
  border-color: var(--color-maize-400);
  background: var(--color-maize-400);
}

.ct-ways a:focus-visible,
.ct-social a:focus-visible {
  outline: 3px solid var(--color-forest-600);
  outline-offset: 3px;
}

@media (min-width: 64rem) {
  .ct-grid {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  }

  /* The photograph takes the text column's height. */
  .ct-photo {
    align-self: stretch;
    height: 100%;
    min-height: 0;
    contain: size;
  }
}
</style>
