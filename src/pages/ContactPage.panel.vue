<script setup>
/**
 * Contact — the standalone page at /contact.
 *
 * Every detail already sits in the shared data: the same address, phone
 * numbers, email and social accounts the footer shows. Nothing is new.
 *
 * Design: the details are the page. They are set large, as a single ruled
 * directory on a dark panel, with the email — the quickest way to reach the
 * Union — as the biggest line.
 *
 * The section id is `contact-page`, not `contact` — the footer owns that id
 * and renders on every page, so reusing it would put two elements on one id.
 */
import SocialIcon from "@/components/ui/SocialIcon.vue";
import { brand, contact } from "@/data/home";
</script>

<template>
  <div class="ct">
    <section id="contact-page" class="ct-main" aria-labelledby="ct-heading">
      <div class="ct-shell ct-grid">
        <div class="ct-intro">
          <h1 id="ct-heading" class="ct-title" v-reveal>
            Talk to the ZNFU Secretariat
          </h1>
          <p class="ct-lede" v-reveal="{ delay: 80 }">
            Reach the {{ brand.fullName }} at the Secretariat in Lusaka — by
            post, by phone or by email.
          </p>

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

        <dl class="ct-directory" v-reveal="{ delay: 120 }">
          <div class="ct-row">
            <dt>Email the Union</dt>
            <dd>
              <a class="ct-email" :href="`mailto:${contact.email}`">{{ contact.email }}</a>
            </dd>
          </div>

          <div class="ct-row">
            <dt>Call the Secretariat</dt>
            <dd>
              <a
                v-for="phone in contact.phones"
                :key="phone"
                class="ct-phone"
                :href="`tel:${phone.replace(/\s/g, '')}`"
                >{{ phone }}</a
              >
            </dd>
          </div>

          <div class="ct-row">
            <dt>Visit or write</dt>
            <dd>
              <address>
                <span v-for="line in contact.addressLines" :key="line">{{ line }}</span>
              </address>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  </div>
</template>

<style scoped>
.ct {
  position: relative;
  z-index: 1;
  overflow: clip;
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
  align-items: stretch;
}

.ct-title {
  font-family: var(--font-display);
  font-weight: 500;
  text-wrap: balance;
  font-size: var(--page-title);
  letter-spacing: var(--page-title-tracking);
  line-height: var(--page-title-leading);
}

.ct-lede {
  margin-top: 1.1rem;
  color: rgb(19 24 19 / 0.72);
  font-size: var(--page-lede);
  line-height: var(--page-lede-leading);
  max-width: var(--page-lede-measure);
}

.ct-social {
  margin-top: 1.75rem;
}

.ct-social h2 {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 500;
}

.ct-social ul {
  display: flex;
  gap: 0.6rem;
  margin: 0.75rem 0 0;
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

/* ---- Directory ---- */
.ct-directory {
  margin: 0;
  padding: clamp(1.25rem, 2.5vw, 2.25rem);
  border-radius: 5px;
  background: var(--color-forest-900);
  color: var(--color-cream-50);
}

.ct-row {
  display: grid;
  gap: 0.5rem;
  padding-block: 1.25rem;
  border-top: 1px solid rgb(251 249 243 / 0.22);
}

.ct-row:first-child {
  padding-top: 0;
  border-top: 0;
}

.ct-row:last-child {
  padding-bottom: 0;
}

.ct-row dt {
  color: var(--color-maize-400);
  font-size: 0.9rem;
  font-weight: 600;
}

.ct-row dd {
  display: grid;
  gap: 0.2rem;
  margin: 0;
}

.ct-email {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2.6rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.1;
  overflow-wrap: anywhere;
}

.ct-phone {
  font-family: var(--font-display);
  font-size: clamp(1.3rem, 2vw, 1.8rem);
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}

.ct-row address {
  display: grid;
  font-size: 1.05rem;
  font-style: normal;
  line-height: 1.55;
  color: rgb(251 249 243 / 0.85);
}

.ct-email,
.ct-phone {
  width: fit-content;
  text-decoration: underline;
  text-decoration-color: rgb(251 249 243 / 0.3);
  text-underline-offset: 0.2em;
  transition: text-decoration-color 180ms ease;
}

.ct-email:hover,
.ct-phone:hover {
  text-decoration-color: var(--color-maize-400);
}

.ct-email:focus-visible,
.ct-phone:focus-visible,
.ct-social a:focus-visible {
  outline: 3px solid var(--color-maize-400);
  outline-offset: 4px;
}

@media (min-width: 64rem) {
  .ct-grid {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    gap: var(--space-gap);
  }
}
</style>
