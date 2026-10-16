<script setup>
/**
 * Apply for Membership — the standalone page at /apply-membership, opened from
 * the “Apply for membership” and “Join ZNFU” buttons.
 *
 * The five steps are a real sequence, so they keep their numbers and read as a
 * single ordered list. They are the same confirmed facts the membership data
 * publishes. The Secretariat’s contact details sit beside them for anyone who
 * would rather ask than apply online.
 *
 * Note: no application-form URL has been supplied, so no button links to one.
 */
import { Mail, MapPin, Phone } from "@lucide/vue";

import { applyMembership, contact } from "@/data/home";
</script>

<template>
  <div class="apply">
    <section id="apply-membership" class="apply-main" aria-labelledby="apply-heading">
      <div class="apply-shell apply-grid">
        <div class="apply-side">
          <h1 id="apply-heading" class="apply-title" v-reveal>
            {{ applyMembership.title }}
          </h1>
          <p class="apply-lede" v-reveal="{ delay: 80 }">
            {{ applyMembership.lede }}
          </p>

          <div class="apply-contact">
            <h2>{{ applyMembership.contactHeading }}</h2>
            <ul>
              <li>
                <MapPin class="apply-contact__icon" aria-hidden="true" />
                <address>
                  <span v-for="line in contact.addressLines" :key="line">{{ line }}</span>
                </address>
              </li>
              <li>
                <Phone class="apply-contact__icon" aria-hidden="true" />
                <span class="apply-contact__stack">
                  <a
                    v-for="phone in contact.phones"
                    :key="phone"
                    :href="`tel:${phone.replace(/\s/g, '')}`"
                    >{{ phone }}</a
                  >
                </span>
              </li>
              <li>
                <Mail class="apply-contact__icon" aria-hidden="true" />
                <a :href="`mailto:${contact.email}`">{{ contact.email }}</a>
              </li>
            </ul>
          </div>
        </div>

        <ol class="apply-steps" aria-label="How to apply">
          <li v-for="step in applyMembership.steps" :key="step.number" class="apply-step">
            <span class="apply-step__number" aria-hidden="true">{{ Number(step.number) }}</span>
            <div>
              <h2>{{ step.title }}</h2>
              <p>{{ step.body }}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>
  </div>
</template>

<style scoped>
.apply {
  position: relative;
  z-index: 1;
  overflow: clip;
  background: var(--color-cream-50);
  color: var(--color-forest-950);
}

.apply-shell {
  width: 100%;
  max-width: var(--shell-max);
  margin-inline: auto;
  padding-inline: var(--shell-pad);
}

.apply-main {
  padding-block: clamp(5.5rem, 6.5vw, 6.25rem) var(--space-section);
}

.apply-grid {
  display: grid;
  gap: var(--space-gap);
  align-items: start;
}

.apply-title {
  font-family: var(--font-display);
  font-weight: 500;
  text-wrap: balance;
  font-size: var(--page-title);
  letter-spacing: var(--page-title-tracking);
  line-height: var(--page-title-leading);
}

.apply-lede {
  margin-top: 1.1rem;
  color: rgb(19 24 19 / 0.72);
  font-size: var(--page-lede);
  line-height: var(--page-lede-leading);
  max-width: var(--page-lede-measure);
}

/* ---- Contact: one quiet dark panel ---- */
.apply-contact {
  max-width: 26rem;
  margin-top: 1.75rem;
  padding: 1.4rem 1.5rem;
  border-radius: 5px;
  background: var(--color-forest-900);
  color: var(--color-cream-50);
}

.apply-contact h2 {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 500;
}

.apply-contact ul {
  display: grid;
  gap: 0.85rem;
  margin: 1rem 0 0;
  padding: 0;
  list-style: none;
  color: rgb(251 249 243 / 0.82);
  font-size: 0.93rem;
  line-height: 1.5;
}

.apply-contact li {
  display: flex;
  gap: 0.75rem;
}

.apply-contact__icon {
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;
  margin-top: 0.2rem;
  color: var(--color-maize-400);
}

.apply-contact address {
  display: grid;
  font-style: normal;
}

.apply-contact__stack {
  display: grid;
}

.apply-contact a {
  text-decoration: underline;
  text-underline-offset: 0.25em;
}

.apply-contact a:focus-visible {
  outline: 3px solid var(--color-maize-400);
  outline-offset: 3px;
}

/* ---- Steps ---- */
.apply-steps {
  margin: 0;
  padding: 0;
  list-style: none;
}

.apply-step {
  display: grid;
  grid-template-columns: 3.25rem minmax(0, 1fr);
  gap: 1rem;
  padding-block: 1.25rem;
  border-top: 1px solid rgb(4 32 21 / 0.2);
}

.apply-step:last-child {
  border-bottom: 1px solid rgb(4 32 21 / 0.2);
}

.apply-step__number {
  color: var(--color-forest-600);
  font-family: var(--font-display);
  font-size: clamp(2.25rem, 3.5vw, 3.25rem);
  font-weight: 500;
  line-height: 0.95;
}

.apply-step h2 {
  font-family: var(--font-display);
  font-size: clamp(1.3rem, 2vw, 1.8rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

.apply-step p {
  max-width: 36rem;
  margin-top: 0.45rem;
  color: rgb(19 24 19 / 0.7);
  line-height: 1.65;
}

@media (min-width: 64rem) {
  .apply-grid {
    grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
    gap: var(--space-gap);
  }

  .apply-side {
    position: sticky;
    top: 6.5rem;
  }

  .apply-step {
    grid-template-columns: 4.5rem minmax(0, 1fr);
  }
}
</style>
