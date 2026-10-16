<script setup>
/**
 * Member systems — the standalone page at /systems.
 *
 * Design: the page opens with the product itself — a weekly price ledger —
 * rather than a description of it. Below, the three systems are laid out as
 * the journey they really are (check prices, arrange transport, sell), so the
 * step numbers earn their place. Each system keeps its anchor id because the
 * footer deep-links to /systems#e-farm-prices, #e-transport and #znfu-market.
 *
 * Copy comes from `systems` in src/data/home.js. The price rows are sample
 * data (flagged there); the FAQ answers marked [TO CONFIRM] still need the
 * Secretariat's wording.
 */
import { ArrowRight } from "@lucide/vue";

import AppIcon from "@/components/ui/AppIcon.vue";
import { systems } from "@/data/home";

const priceBook = systems.items[0];

const faqs = [
  {
    question: "Who can use the systems?",
    answer:
      "They are member services, open to members of the Union. Membership is open to any person or organisation in the business of agriculture in Zambia.",
  },
  {
    question: "How do I get access?",
    answer:
      "Access is arranged through the Secretariat. [TO CONFIRM — the exact steps, timelines and any sign-in details.]",
  },
  {
    question: "Do the systems cost extra?",
    answer:
      "Pricing is set by the Secretariat. [TO CONFIRM — whether the systems are included in the subscription or charged separately.]",
  },
  {
    question: "Who do I contact for help?",
    answer:
      "Contact the ZNFU Secretariat. [TO CONFIRM — the named support contact or desk.]",
  },
];
</script>

<template>
  <div class="sys">
    <!-- Hero: headline beside the weekly price ledger -->
    <section class="sys-hero" aria-labelledby="sys-heading">
      <div class="sys-shell sys-hero__grid">
        <div>
          <h1 id="sys-heading" class="sys-hero__title" v-reveal>
            {{ systems.title }}
          </h1>
          <p class="sys-hero__lede" v-reveal="{ delay: 80 }">
            {{ systems.lede }}
          </p>

          <ul class="sys-jump" aria-label="Jump to a system">
            <li v-for="item in systems.items" :key="item.id">
              <a :href="`#${item.id}`">
                <AppIcon :name="item.icon" class="sys-jump__icon" />
                {{ item.title }}
              </a>
            </li>
          </ul>
        </div>

        <div class="sys-ledger" v-reveal="{ delay: 140 }">
          <div class="sys-ledger__head">
            <p class="sys-ledger__title">e-Farm Prices</p>
            <p class="sys-ledger__note">Sample figures</p>
          </div>
          <table class="sys-ledger__table">
            <thead>
              <tr>
                <th scope="col">Commodity</th>
                <th scope="col">Market</th>
                <th scope="col" class="sys-ledger__num">Price</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in priceBook.prices" :key="row.commodity">
                <th scope="row">{{ row.commodity }}</th>
                <td>{{ row.market }}</td>
                <td class="sys-ledger__num">
                  {{ row.price }}
                  <span class="sys-ledger__unit">/ {{ row.unit }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- The journey: three systems in the order a farmer uses them -->
    <section class="sys-journey" aria-labelledby="sys-journey-heading">
      <div class="sys-shell">
        <h2 id="sys-journey-heading" class="sys-heading">
          From the field to the buyer
        </h2>

        <ol class="sys-steps">
          <li
            v-for="(item, index) in systems.items"
            :id="item.id"
            :key="item.id"
            class="sys-step"
          >
            <p class="sys-step__number" aria-hidden="true">{{ index + 1 }}</p>

            <div class="sys-step__text">
              <h3>{{ item.title }}</h3>
              <p class="sys-step__body">{{ item.body }}</p>
              <ul class="sys-step__features">
                <li v-for="feature in item.features" :key="feature">
                  {{ feature }}
                </li>
              </ul>
            </div>

            <img
              class="sys-step__image"
              :src="item.image"
              :alt="item.imageAlt"
              width="800"
              height="600"
              loading="lazy"
              decoding="async"
            />
          </li>
        </ol>
      </div>
    </section>

    <!-- Questions, with the access note beside them -->
    <section class="sys-faq" aria-labelledby="sys-faq-heading">
      <div class="sys-shell sys-faq__grid">
        <div>
          <h2 id="sys-faq-heading" class="sys-heading">Questions</h2>
          <p class="sys-faq__note">
            The systems are member services. Membership is open to any person
            or organisation in the business of agriculture in Zambia.
          </p>
          <a href="/membership" class="sys-faq__link">
            See membership options
            <ArrowRight class="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <div class="sys-faq__list">
          <details v-for="faq in faqs" :key="faq.question">
            <summary>{{ faq.question }}</summary>
            <p>{{ faq.answer }}</p>
          </details>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.sys {
  position: relative;
  z-index: 1;
  overflow: clip;
  background: var(--color-cream-50);
  color: var(--color-forest-950);
}

.sys-shell {
  width: 100%;
  max-width: var(--shell-max);
  margin-inline: auto;
  padding-inline: var(--shell-pad);
}

.sys-heading {
  font-family: var(--font-display);
  font-size: var(--section-title);
  font-weight: 500;
  letter-spacing: -0.035em;
  line-height: 1;
  text-wrap: balance;
}

/* ---- Hero ---- */
.sys-hero {
  padding-block: clamp(5.5rem, 6.5vw, 6.25rem) var(--space-section);
  background: var(--color-forest-950);
  color: var(--color-cream-50);
}

.sys-hero__grid {
  display: grid;
  gap: var(--space-gap);
  align-items: center;
}

.sys-hero__title {
  font-family: var(--font-display);
  font-weight: 500;
  text-wrap: balance;
  font-size: var(--page-title);
  letter-spacing: var(--page-title-tracking);
  line-height: var(--page-title-leading);
}

.sys-hero__lede {
  margin-top: 1.25rem;
  color: rgb(251 249 243 / 0.72);
  font-size: var(--page-lede);
  line-height: var(--page-lede-leading);
  max-width: var(--page-lede-measure);
}

.sys-jump {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin: 1.75rem 0 0;
  padding: 0;
  list-style: none;
}

.sys-jump a {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.1rem;
  border: 1px solid rgb(251 249 243 / 0.28);
  border-radius: 9999px;
  color: var(--color-cream-50);
  font-size: 0.88rem;
  font-weight: 560;
  text-decoration: none;
  transition: background-color 180ms ease, color 180ms ease;
}

.sys-jump a:hover {
  background: var(--color-maize-400);
  border-color: var(--color-maize-400);
  color: var(--color-forest-950);
}

.sys-jump a:focus-visible {
  outline: 3px solid var(--color-maize-400);
  outline-offset: 3px;
}

.sys-jump__icon {
  width: 1rem;
  height: 1rem;
}

/* ---- The ledger: the memorable element ---- */
.sys-ledger {
  padding: clamp(1.25rem, 2.2vw, 1.9rem);
  border-radius: 5px;
  background: var(--color-cream-50);
  color: var(--color-forest-950);
}

.sys-ledger__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.9rem;
  border-bottom: 2px solid var(--color-forest-950);
}

.sys-ledger__title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 500;
  letter-spacing: -0.02em;
}

.sys-ledger__note {
  color: rgb(19 24 19 / 0.55);
  font-size: 0.8rem;
}

.sys-ledger__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.sys-ledger__table thead th {
  padding: 0.75rem 0 0.5rem;
  color: rgb(19 24 19 / 0.55);
  font-size: 0.78rem;
  font-weight: 500;
  text-align: left;
}

.sys-ledger__table tbody th,
.sys-ledger__table tbody td {
  padding: 0.85rem 0;
  border-top: 1px solid rgb(4 32 21 / 0.12);
  text-align: left;
}

.sys-ledger__table tbody th {
  font-weight: 600;
}

.sys-ledger__table .sys-ledger__num {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.sys-ledger__table tbody td.sys-ledger__num {
  font-weight: 650;
}

.sys-ledger__unit {
  color: rgb(19 24 19 / 0.5);
  font-size: 0.78rem;
  font-weight: 400;
}

/* ---- Journey ---- */
.sys-journey {
  padding-block: var(--space-section);
}

.sys-steps {
  display: grid;
  margin: clamp(1.5rem, 3vw, 2.5rem) 0 0;
  padding: 0;
  list-style: none;
}

.sys-step {
  display: grid;
  gap: 1.25rem;
  padding-block: var(--space-section);
  border-top: 1px solid rgb(4 32 21 / 0.2);
  scroll-margin-top: 6rem;
}

.sys-step__number {
  color: var(--color-forest-600);
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 2.4vw, 2.25rem);
  font-weight: 500;
  line-height: 1;
}

.sys-step__text h3 {
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 2vw, 1.75rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

.sys-step__body {
  max-width: 34rem;
  margin-top: 0.6rem;
  color: rgb(19 24 19 / 0.72);
  font-size: var(--page-lede);
  line-height: var(--page-lede-leading);
}

.sys-step__features {
  display: grid;
  gap: 0.45rem;
  margin: 1.1rem 0 0;
  padding: 0;
  list-style: none;
  font-size: var(--page-lede);
  line-height: 1.5;
}

.sys-step__features li {
  display: flex;
  gap: 0.7rem;
}

.sys-step__features li::before {
  flex-shrink: 0;
  width: 0.4rem;
  height: 0.4rem;
  margin-top: 0.5rem;
  border-radius: 50%;
  background: var(--color-maize-400);
  content: "";
}

.sys-step__image {
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: 5px;
  object-fit: cover;
}

/* ---- FAQ ---- */
.sys-faq {
  padding-block: var(--space-section);
  background: var(--color-cream-100);
}

.sys-faq__grid {
  display: grid;
  gap: 2rem;
}

.sys-faq__note {
  max-width: 24rem;
  margin-top: 1rem;
  color: rgb(19 24 19 / 0.7);
  line-height: 1.65;
}

.sys-faq__link {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 1.25rem;
  color: var(--color-forest-950);
  font-weight: 650;
  text-decoration: underline;
  text-underline-offset: 0.3em;
}

.sys-faq__link:focus-visible,
.sys-faq__list summary:focus-visible {
  outline: 3px solid var(--color-forest-600);
  outline-offset: 3px;
}

.sys-faq__list {
  border-top: 1px solid rgb(4 32 21 / 0.2);
}

.sys-faq__list details {
  border-bottom: 1px solid rgb(4 32 21 / 0.2);
}

.sys-faq__list summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding-block: 1.1rem;
  cursor: pointer;
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 500;
  list-style: none;
}

.sys-faq__list summary::-webkit-details-marker {
  display: none;
}

.sys-faq__list summary::after {
  color: var(--color-forest-600);
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 1;
  content: "+";
}

.sys-faq__list details[open] summary::after {
  content: "−";
}

.sys-faq__list details p {
  max-width: 40rem;
  padding-bottom: 1.25rem;
  color: rgb(19 24 19 / 0.7);
  line-height: 1.7;
}

@media (min-width: 48rem) {
  .sys-hero__grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }

  .sys-step {
    grid-template-columns: 3rem minmax(0, 1.1fr) minmax(0, 1fr);
    gap: clamp(1.25rem, 3vw, 2.5rem);
    align-items: center;
  }

  /* The photo takes its height from the text beside it instead of setting the
     row's height: `contain: size` stops the image's own proportions from
     counting, and stretching then fills exactly the text block's height. */
  .sys-step__image {
    align-self: stretch;
    height: 100%;
    min-height: 11rem;
    aspect-ratio: auto;
    contain: size;
  }

  .sys-faq__grid {
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
    gap: var(--space-gap);
  }
}
</style>
