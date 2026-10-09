<script setup>
/**
 * Member systems — the standalone page at /systems.
 *
 * The band at the top is the same component the home page stacks, given
 * `standalone` so it heads the page and carries the page’s single <h1>. It is
 * untouched here: same headline, same three system cards, same anchor ids the
 * footer’s deep links use.
 *
 * Everything below it is added by this page:
 *   1. an intro under the headline
 *   2. one alternating feature row per system
 *   3. how the systems work together
 *   4. who can use them
 *   5. an FAQ
 *   6. a closing banner
 */
import { ref } from "vue";
import { ArrowDown, ArrowRight } from "@lucide/vue";

import AppIcon from "@/components/ui/AppIcon.vue";
import SystemsSection from "@/components/sections/SystemsSection.vue";
import { systems } from "@/data/home";

/* =====================================================================
 *  SAMPLE CONTENT — REPLACE BEFORE PUBLISHING
 * =====================================================================
 *
 *  Written so the page reads as a finished layout for client review. Each
 *  system’s name, description and benefit list are taken from the real data
 *  in `src/data/home.js`; the wording added around them is generic, and
 *  anything the Union has not supplied is marked `[TO CONFIRM]`.
 *
 *  Nothing here is a price, a fee, a statistic or a claim about performance.
 * ===================================================================== */
const SAMPLE_CONTENT = {
  /** Section 1 — sits directly under the headline and the system cards. */
  intro: [
    "At harvest, timing decides the price. A crop that is ready but cannot move loses value every day it waits — and a farmer who does not know what the market is paying cannot judge a fair offer.",
    "These three systems are built for that window: check what every market is paying, arrange the haulage to get there, and sell to a verified buyer.",
  ],

  /**
   * Who each system helps, and the steps to use it. The step wording is a
   * generic description of the journey — the Union has not supplied the
   * access or onboarding process.
   */
  whoItHelps: {
    "e-farm-prices": "Farmers, associations and buyers comparing markets.",
    "e-transport": "Farmers, transporters and buyers moving produce.",
    "znfu-market": "Members buying and selling produce, livestock and inputs.",
  },

  howItWorks: {
    "e-farm-prices": [
      "Open the weekly price book for the current period. [TO CONFIRM — how access is granted.]",
      "Compare the markets nearest to you and note the week’s movers.",
      "Take the figures with you when you negotiate.",
    ],
    "e-transport": [
      "Enter the pickup point, destination and cargo. [TO CONFIRM — the booking process.]",
      "Receive and compare quotes from matched hauliers.",
      "Track the job from loading to delivery.",
    ],
    "znfu-market": [
      "Confirm your membership is paid up — listings are for paid-up members.",
      "List your produce, livestock, equipment or inputs.",
      "Deal directly with the buyer. A listing lapses with your membership.",
    ],
  },

  /** Section 3 — the sequence through the three systems. */
  flow: {
    heading: "How the systems work together",
    steps: [
      {
        id: "e-farm-prices",
        icon: "TrendingUp",
        label: "Check prices",
        detail: "See what each market is paying this week.",
      },
      {
        id: "e-transport",
        icon: "Truck",
        label: "Arrange transport",
        detail: "Book and track the haulage that gets it there.",
      },
      {
        id: "znfu-market",
        icon: "Store",
        label: "Sell",
        detail: "List to members and deal with a verified buyer.",
      },
    ],
  },

  /** Section 4 — access. */
  access: {
    heading: "Who can use these systems?",
    body: "They are member services. Membership is open to any person or organisation in the business of agriculture in Zambia. [TO CONFIRM — how access to each system is granted and whether any are restricted by category.]",
    ctaLabel: "See membership options",
    ctaHref: "/membership",
  },

  /** Section 5 — questions and answers. */
  faqs: [
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
  ],

  /** Section 6 — closing banner. */
  banner: {
    title: "Join the Union to access these systems",
    text: "Membership is open to any person or organisation in the business of agriculture in Zambia.",
    ctaLabel: "Apply for membership",
    ctaHref: "/membership",
  },
};

/** FAQ answers toggle independently; nothing animates a height. */
const openFaq = ref({});

function toggleFaq(index) {
  openFaq.value = { ...openFaq.value, [index]: !openFaq.value[index] };
}
</script>

<template>
  <SystemsSection standalone />

  <!-- 1 — Intro -->
  <section class="systems-page-band">
    <div class="systems-page-band__inner">
      <p class="systems-page-intro__eyebrow" v-reveal>Why timing matters</p>
      <p
        v-for="(paragraph, index) in SAMPLE_CONTENT.intro"
        :key="index"
        class="systems-page-intro__text"
        v-reveal="{ delay: 60 + index * 60 }"
      >
        {{ paragraph }}
      </p>
    </div>
  </section>

  <!-- 2 — One alternating feature row per system -->
  <section class="systems-page-band systems-page-band--cream">
    <div class="systems-page-band__inner">
      <article
        v-for="(item, index) in systems.items"
        :key="item.id"
        class="systems-page-feature"
        v-reveal="{ delay: index * 80 }"
      >
        <div class="systems-page-feature__row">
          <div class="systems-page-feature__text">
            <p class="systems-page-feature__number">{{ item.number }} / 03</p>
            <h2 class="systems-page-feature__title">{{ item.title }}</h2>

            <p class="systems-page-feature__label">What it is</p>
            <p class="systems-page-feature__body">{{ item.body }}</p>

            <p class="systems-page-feature__label">Who it helps</p>
            <p class="systems-page-feature__body">
              {{ SAMPLE_CONTENT.whoItHelps[item.id] }}
            </p>

            <p class="systems-page-feature__label">How it works</p>
            <ol class="systems-page-feature__steps">
              <li
                v-for="(step, stepIndex) in SAMPLE_CONTENT.howItWorks[item.id]"
                :key="stepIndex"
                class="systems-page-feature__step"
              >
                <span class="systems-page-feature__step-index">
                  {{ stepIndex + 1 }}
                </span>
                <span>{{ step }}</span>
              </li>
            </ol>

            <p class="systems-page-feature__label">Key benefits</p>
            <ul class="systems-page-feature__benefits">
              <li
                v-for="benefit in item.features"
                :key="benefit"
                class="systems-page-feature__benefit"
              >
                {{ benefit }}
              </li>
            </ul>
          </div>

          <!-- Simple icon block rather than a photograph -->
          <div
            class="systems-page-feature__media"
            :class="index % 2 === 1 ? 'systems-page-feature__media--flip' : ''"
          >
            <span class="systems-page-feature__tile">
              <AppIcon :name="item.icon" class="systems-page-feature__glyph" />
            </span>
            <p class="systems-page-feature__tile-caption">{{ item.title }}</p>
          </div>
        </div>
      </article>
    </div>
  </section>

  <!-- 3 — How the systems work together -->
  <section class="systems-page-band">
    <div class="systems-page-band__inner">
      <h2 class="systems-page-heading" v-reveal>
        {{ SAMPLE_CONTENT.flow.heading }}
      </h2>

      <ol class="systems-page-flow">
        <li
          v-for="(step, index) in SAMPLE_CONTENT.flow.steps"
          :key="step.id"
          class="systems-page-flow__item"
          v-reveal="{ delay: 80 + index * 90 }"
        >
          <div class="systems-page-flow__step">
            <span class="systems-page-flow__tile">
              <AppIcon :name="step.icon" class="systems-page-flow__glyph" />
            </span>
            <p class="systems-page-flow__label">{{ step.label }}</p>
            <p class="systems-page-flow__detail">{{ step.detail }}</p>
          </div>

          <span
            v-if="index < SAMPLE_CONTENT.flow.steps.length - 1"
            class="systems-page-flow__connector"
            aria-hidden="true"
          >
            <ArrowRight class="systems-page-flow__arrow" />
            <ArrowDown class="systems-page-flow__arrow-down" />
          </span>
        </li>
      </ol>
    </div>
  </section>

  <!-- 4 — Who can use these systems -->
  <section class="systems-page-band systems-page-band--cream">
    <div class="systems-page-band__inner">
      <div class="systems-page-access" v-reveal>
        <h2 class="systems-page-access__heading">
          {{ SAMPLE_CONTENT.access.heading }}
        </h2>
        <p class="systems-page-access__body">
          {{ SAMPLE_CONTENT.access.body }}
        </p>
        <a
          :href="SAMPLE_CONTENT.access.ctaHref"
          class="btn btn--forest systems-page-access__cta"
        >
          {{ SAMPLE_CONTENT.access.ctaLabel }}
          <ArrowRight
            class="systems-page-access__cta-icon"
            aria-hidden="true"
          />
        </a>
      </div>
    </div>
  </section>

  <!-- 5 — FAQ -->
  <section class="systems-page-band">
    <div class="systems-page-band__inner">
      <h2 class="systems-page-heading" v-reveal>Questions</h2>

      <ul class="systems-page-faq">
        <li
          v-for="(faq, index) in SAMPLE_CONTENT.faqs"
          :key="index"
          class="systems-page-faq__item"
          v-reveal="{ delay: 80 + index * 60 }"
        >
          <button
            type="button"
            class="systems-page-faq__question"
            :aria-expanded="openFaq[index] ? 'true' : 'false'"
            @click="toggleFaq(index)"
          >
            <span class="systems-page-faq__text">{{ faq.question }}</span>
            <span class="systems-page-faq__toggle" aria-hidden="true">
              {{ openFaq[index] ? "−" : "+" }}
            </span>
          </button>

          <p v-if="openFaq[index]" class="systems-page-faq__answer">
            {{ faq.answer }}
          </p>
        </li>
      </ul>
    </div>
  </section>

  <!-- 6 — Closing banner -->
  <section class="systems-page-band">
    <div class="systems-page-band__inner">
      <div class="systems-page-banner" v-reveal>
        <div>
          <p class="systems-page-banner__title">
            {{ SAMPLE_CONTENT.banner.title }}
          </p>
          <p class="systems-page-banner__text">
            {{ SAMPLE_CONTENT.banner.text }}
          </p>
        </div>

        <a
          :href="SAMPLE_CONTENT.banner.ctaHref"
          class="btn btn--maize systems-page-banner__cta"
        >
          {{ SAMPLE_CONTENT.banner.ctaLabel }}
          <ArrowRight
            class="systems-page-banner__cta-icon"
            aria-hidden="true"
          />
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
/**
 * The systems band above these sections is `position: sticky` at desktop
 * widths — a positioned element, which paints over plain in-flow content
 * whatever the document order. These bands therefore carry their own stacking
 * level (the same thing SiteFooter does with `relative z-10`) so they pass
 * over the pinned panel instead of behind it, plus an opaque background so
 * the dark panel never shows through the text.
 *
 * `position` and `z-index` are confined to `.systems-page-band`. Everything
 * inside is laid out with padding, borders, grid and type alone — no height,
 * no overflow and no transform — so no section can be clipped.
 */
.systems-page-band {
  position: relative;
  z-index: 1;
  background-color: var(--color-cream-50);
  padding-top: 4.5rem;
  padding-bottom: 4.5rem;
}

.systems-page-band--cream {
  background-color: var(--color-cream-100);
}

.systems-page-band__inner {
  margin-left: auto;
  margin-right: auto;
  max-width: 80rem;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}

@media (min-width: 40rem) {
  .systems-page-band__inner {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

@media (min-width: 64rem) {
  .systems-page-band {
    padding-top: 6rem;
    padding-bottom: 6rem;
  }
}

.systems-page-heading {
  font-family: var(--font-display);
  font-size: var(--text-display);
  font-weight: 500;
  letter-spacing: -0.03em;
  color: var(--color-forest-950);
}

/* ---- 1 — Intro ---- */
.systems-page-intro__eyebrow {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--color-forest-600);
}

.systems-page-intro__text {
  margin-top: 1.25rem;
  max-width: 52rem;
  font-size: 1.05rem;
  line-height: 1.75;
  color: color-mix(in oklab, var(--color-ink-900) 72%, transparent);
}

/* ---- 2 — Feature rows ---- */
.systems-page-feature + .systems-page-feature {
  margin-top: 4.5rem;
}

.systems-page-feature__row {
  display: grid;
  gap: 2.5rem;
}

@media (min-width: 64rem) {
  .systems-page-feature__row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 4rem;
    align-items: start;
  }
}

.systems-page-feature__number {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  color: var(--color-maize-400);
}

.systems-page-feature__title {
  margin-top: 0.6rem;
  font-family: var(--font-display);
  font-size: var(--text-display);
  font-weight: 500;
  letter-spacing: -0.03em;
  color: var(--color-forest-950);
}

.systems-page-feature__label {
  margin-top: 1.75rem;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: color-mix(in oklab, var(--color-ink-900) 45%, transparent);
}

.systems-page-feature__body {
  margin-top: 0.6rem;
  max-width: 40rem;
  font-size: 0.95rem;
  line-height: 1.7;
  color: color-mix(in oklab, var(--color-ink-900) 72%, transparent);
}

.systems-page-feature__steps {
  margin-top: 0.75rem;
  padding: 0;
  list-style: none;
}

.systems-page-feature__step {
  display: flex;
  align-items: baseline;
  gap: 0.85rem;
  font-size: 0.95rem;
  line-height: 1.6;
  color: color-mix(in oklab, var(--color-ink-900) 72%, transparent);
}

.systems-page-feature__step + .systems-page-feature__step {
  margin-top: 0.7rem;
}

.systems-page-feature__step-index {
  display: inline-grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 9999px;
  background-color: var(--color-forest-900);
  color: var(--color-cream-50);
  font-family: var(--font-display);
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.3rem 0.65rem;
}

.systems-page-feature__benefits {
  margin-top: 0.75rem;
  padding: 0;
  list-style: none;
}

.systems-page-feature__benefit {
  display: flex;
  gap: 0.75rem;
  font-size: 0.95rem;
  line-height: 1.6;
  color: color-mix(in oklab, var(--color-ink-900) 72%, transparent);
}

.systems-page-feature__benefit + .systems-page-feature__benefit {
  margin-top: 0.7rem;
}

.systems-page-feature__benefit::before {
  content: "";
  flex-shrink: 0;
  border-radius: 9999px;
  background-color: var(--color-maize-400);
  width: 0.375rem;
  height: 0.375rem;
  margin-top: 0.55rem;
}

/* Icon block instead of a photograph — no image, no invented imagery. */
.systems-page-feature__media {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  /* 5px, matching every other card on the site. */
  border-radius: 5px;
  border: 1px solid
    color-mix(in oklab, var(--color-forest-900) 10%, transparent);
  background-color: var(--color-cream-50);
  padding: 3.5rem 2rem;
}

.systems-page-feature__tile {
  display: grid;
  place-items: center;
  border-radius: 9999px;
  background-color: var(--color-maize-400);
  color: var(--color-forest-950);
  padding: 1.5rem;
}

.systems-page-feature__glyph {
  width: 2.25rem;
  height: 2.25rem;
}

.systems-page-feature__tile-caption {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--color-forest-950);
}

/**
 * Alternate the side the icon block sits on. `order` keeps the reading order
 * in the markup correct for screen readers — only the visual order flips.
 */
@media (min-width: 64rem) {
  .systems-page-feature__media--flip {
    order: -1;
  }
}

/* ---- 3 — How the systems work together ---- */
.systems-page-flow {
  display: grid;
  gap: 1.25rem;
  margin-top: 2.5rem;
  padding: 0;
  list-style: none;
}

@media (min-width: 64rem) {
  .systems-page-flow {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: stretch;
  }
}

.systems-page-flow__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

@media (min-width: 64rem) {
  .systems-page-flow__item {
    flex-direction: row;
    align-items: stretch;
  }
}

.systems-page-flow__step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.6rem;
  flex: 1;
  /* 5px, matching every other card on the site. */
  border-radius: 5px;
  border: 1px solid
    color-mix(in oklab, var(--color-forest-900) 10%, transparent);
  background-color: var(--color-cream-50);
  padding: 2rem 1.5rem;
}

.systems-page-flow__tile {
  display: grid;
  place-items: center;
  border-radius: 9999px;
  background-color: var(--color-forest-900);
  color: var(--color-maize-400);
  padding: 0.9rem;
}

.systems-page-flow__glyph {
  width: 1.4rem;
  height: 1.4rem;
}

.systems-page-flow__label {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--color-forest-950);
}

.systems-page-flow__detail {
  font-size: 0.9rem;
  line-height: 1.6;
  color: color-mix(in oklab, var(--color-ink-900) 62%, transparent);
}

.systems-page-flow__connector {
  display: grid;
  place-items: center;
  color: color-mix(in oklab, var(--color-forest-900) 35%, transparent);
  flex-shrink: 0;
}

/* Two arrow glyphs, toggled by breakpoint — avoids rotating with a transform. */
.systems-page-flow__arrow {
  display: none;
  width: 1.25rem;
  height: 1.25rem;
}

.systems-page-flow__arrow-down {
  width: 1.25rem;
  height: 1.25rem;
}

@media (min-width: 64rem) {
  .systems-page-flow__arrow {
    display: block;
  }

  .systems-page-flow__arrow-down {
    display: none;
  }
}

/* ---- 4 — Who can use these systems ---- */
.systems-page-access {
  /* 5px, matching every other card on the site. */
  border-radius: 5px;
  border: 1px solid
    color-mix(in oklab, var(--color-forest-900) 12%, transparent);
  background-color: var(--color-cream-50);
  padding: 2.5rem 2rem;
}

.systems-page-access__heading {
  font-family: var(--font-display);
  font-size: var(--text-display-sm);
  font-weight: 500;
  letter-spacing: -0.03em;
  color: var(--color-forest-950);
}

.systems-page-access__body {
  margin-top: 1rem;
  max-width: 46rem;
  font-size: 0.98rem;
  line-height: 1.7;
  color: color-mix(in oklab, var(--color-ink-900) 70%, transparent);
}

.systems-page-access__cta {
  margin-top: 1.75rem;
}

.systems-page-access__cta-icon,
.systems-page-banner__cta-icon {
  width: 1rem;
  height: 1rem;
}

/* ---- 5 — FAQ ---- */
.systems-page-faq {
  margin-top: 2.5rem;
  padding: 0;
  list-style: none;
  border-top: 1px solid
    color-mix(in oklab, var(--color-forest-900) 12%, transparent);
}

.systems-page-faq__item {
  border-bottom: 1px solid
    color-mix(in oklab, var(--color-forest-900) 12%, transparent);
}

.systems-page-faq__question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  width: 100%;
  padding: 1.35rem 0;
  text-align: left;
  cursor: pointer;
}

.systems-page-faq__text {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--color-forest-950);
}

.systems-page-faq__toggle {
  flex-shrink: 0;
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 400;
  line-height: 1;
  color: var(--color-maize-400);
}

.systems-page-faq__answer {
  margin-top: -0.25rem;
  padding-bottom: 1.5rem;
  max-width: 52rem;
  font-size: 0.95rem;
  line-height: 1.7;
  color: color-mix(in oklab, var(--color-ink-900) 68%, transparent);
}

/* ---- 6 — Closing banner ---- */
.systems-page-banner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.75rem;
  /* 5px, matching every other card on the site. */
  border-radius: 5px;
  background-color: var(--color-forest-900);
  padding: 2.5rem 2rem;
}

@media (min-width: 48rem) {
  .systems-page-banner {
    padding: 3rem;
  }
}

.systems-page-banner__title {
  font-family: var(--font-display);
  font-size: var(--text-display);
  font-weight: 500;
  letter-spacing: -0.03em;
  color: var(--color-cream-50);
}

.systems-page-banner__text {
  margin-top: 0.75rem;
  max-width: 34rem;
  font-size: 0.95rem;
  line-height: 1.6;
  color: color-mix(in oklab, var(--color-cream-200) 75%, transparent);
}
</style>
