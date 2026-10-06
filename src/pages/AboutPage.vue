<script setup>
/**
 * About — the standalone page at /about.
 *
 * The footage panel still opens the page, so the video is the first thing on
 * screen; it and its effects are untouched. Below it are the About-specific
 * sections, which replace the band that used to repeat the home page.
 */
import { ArrowRight, User } from "@lucide/vue";

import FieldBand from "@/components/sections/FieldBand.vue";
import { purposeVision } from "@/data/home";

/* =====================================================================
 *  SAMPLE CONTENT — REPLACE BEFORE PUBLISHING
 * =====================================================================
 *
 *  Every string below is placeholder copy, written so the page reads as a
 *  finished layout for client review. None of it was supplied by the Union,
 *  and none of it is a real name, date, figure or statistic.
 *
 *  To go live, swap each entry for approved wording and delete this note.
 *  Nothing else on the page needs to change — the sections read straight
 *  from this object.
 * ===================================================================== */
const SAMPLE_CONTENT = {
  /** Two generic paragraphs. No dates and no claims. */
  storyParagraphs: [
    "The Union began with a small group of farmers who saw that their interests would be served better together than apart. From those early meetings it grew into a national body speaking for members across the country.",
    "Today the Union exists to give its members a single, strong voice — promoting and safeguarding their interests, and working towards sustainable agriculture for the benefit of members and the wider economy.",
  ],

  values: [
    {
      name: "Integrity",
      description: "We act honestly and in the interests of our members.",
    },
    {
      name: "Collaboration",
      description: "We work together with members, partners and government.",
    },
    {
      name: "Sustainability",
      description: "We plan for the long-term health of the land and the sector.",
    },
  ],

  milestones: [
    {
      year: "Year 1",
      title: "Milestone heading",
      description: "A short line describing what happened at this stage.",
    },
    {
      year: "Year 2",
      title: "Milestone heading",
      description: "A short line describing what happened at this stage.",
    },
    {
      year: "Year 3",
      title: "Milestone heading",
      description: "A short line describing what happened at this stage.",
    },
    {
      year: "Year 4",
      title: "Milestone heading",
      description: "A short line describing what happened at this stage.",
    },
  ],

  leadership: [
    { name: "Full Name", role: "Position" },
    { name: "Full Name", role: "Position" },
    { name: "Full Name", role: "Position" },
    { name: "Full Name", role: "Position" },
  ],

  partners: {
    heading: "Our Partners",
    names: [
      "Partner Name",
      "Partner Name",
      "Partner Name",
      "Partner Name",
      "Partner Name",
      "Partner Name",
    ],
  },

  banner: {
    title: "Get in touch with the Union",
    text: "For membership enquiries, partnerships or anything else, the Secretariat is glad to help.",
    ctaLabel: "Contact us",
    ctaHref: "/contact",
  },
};

/* The mission statement is Secretariat-supplied, and the vision is the site’s
   existing wording. Both are real, so they stay outside SAMPLE_CONTENT. */
const mission = purposeVision.blocks[0].body;
const vision = purposeVision.blocks[1].body;
</script>

<template>
  <FieldBand standalone />

  <!-- 1 — Our Story -->
  <section class="about-band">
    <div class="about-band__inner">
      <p class="about-story__eyebrow" v-reveal>About the Union</p>
      <h1 class="about-story__heading" v-reveal="{ delay: 60 }">Our Story</h1>
      <p class="about-story__lede" v-reveal="{ delay: 110 }">
        The Zambia National Farmers’ Union was founded in 1905 and is based in
        Lusaka. It is a non-political, member-led union.
      </p>
      <p
        v-for="(paragraph, index) in SAMPLE_CONTENT.storyParagraphs"
        :key="index"
        class="about-story__paragraph"
        v-reveal="{ delay: 160 + index * 60 }"
      >
        {{ paragraph }}
      </p>
    </div>
  </section>

  <!-- 2 — Mission, Vision and Values -->
  <section class="about-band about-band--cream">
    <div class="about-band__inner">
      <h2 class="about-band__heading" v-reveal>Mission, Vision and Values</h2>

      <div class="about-mvv">
        <article class="about-mvv__card" v-reveal="{ delay: 120 }">
          <p class="about-mvv__label">Mission</p>
          <p class="about-mvv__body">{{ mission }}</p>
        </article>

        <article class="about-mvv__card" v-reveal="{ delay: 180 }">
          <p class="about-mvv__label">Vision</p>
          <p class="about-mvv__body">{{ vision }}</p>
        </article>
      </div>

      <h3 class="about-mvv__values-heading" v-reveal>Values</h3>
      <ul class="about-mvv__values">
        <li
          v-for="(value, index) in SAMPLE_CONTENT.values"
          :key="value.name"
          class="about-mvv__value"
          v-reveal="{ delay: 120 + index * 70 }"
        >
          <p class="about-mvv__value-name">{{ value.name }}</p>
          <p class="about-mvv__value-text">{{ value.description }}</p>
        </li>
      </ul>
    </div>
  </section>

  <!-- 3 — Milestones as a vertical timeline -->
  <section class="about-band">
    <div class="about-band__inner">
      <h2 class="about-band__heading" v-reveal>Milestones</h2>

      <ol class="about-timeline">
        <li
          v-for="(milestone, index) in SAMPLE_CONTENT.milestones"
          :key="index"
          class="about-timeline__item"
          v-reveal="{ delay: 120 + index * 70 }"
        >
          <p class="about-timeline__year">{{ milestone.year }}</p>
          <h3 class="about-timeline__title">{{ milestone.title }}</h3>
          <p class="about-timeline__text">{{ milestone.description }}</p>
        </li>
      </ol>
    </div>
  </section>

  <!-- 4 — Leadership as a team grid -->
  <section class="about-band about-band--cream">
    <div class="about-band__inner">
      <h2 class="about-band__heading" v-reveal>Leadership</h2>

      <ul class="about-leadership">
        <li
          v-for="(person, index) in SAMPLE_CONTENT.leadership"
          :key="index"
          class="about-leadership__card"
          v-reveal="{ delay: 120 + index * 70 }"
        >
          <span
            class="grid h-12 w-12 place-items-center rounded-full bg-maize-400 text-forest-950 shadow-lg"
          >
            <User class="h-5 w-5" aria-hidden="true" />
          </span>
          <p class="about-leadership__name">{{ person.name }}</p>
          <p class="about-leadership__role">{{ person.role }}</p>
        </li>
      </ul>
    </div>
  </section>

  <!-- 5 — Partners as a row -->
  <section class="about-band">
    <div class="about-band__inner">
      <h2 class="about-band__heading" v-reveal>
        {{ SAMPLE_CONTENT.partners.heading }}
      </h2>

      <ul class="about-partners" v-reveal="{ delay: 120 }">
        <li
          v-for="(partner, index) in SAMPLE_CONTENT.partners.names"
          :key="index"
          class="about-partners__item"
        >
          {{ partner }}
        </li>
      </ul>
    </div>
  </section>

  <!-- 6 — Closing banner -->
  <section class="about-band">
    <div class="about-band__inner">
      <div class="about-banner" v-reveal>
        <div>
          <p class="about-banner__title">{{ SAMPLE_CONTENT.banner.title }}</p>
          <p class="about-banner__text">{{ SAMPLE_CONTENT.banner.text }}</p>
        </div>

        <a
          :href="SAMPLE_CONTENT.banner.ctaHref"
          class="btn btn--maize about-banner__cta"
        >
          {{ SAMPLE_CONTENT.banner.ctaLabel }}
          <ArrowRight class="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
/**
 * The video panel above these sections is `position: sticky` at desktop
 * widths — a positioned element, which paints over plain in-flow content no
 * matter what follows it in the document. These bands are therefore given
 * their own stacking level (the same thing SiteFooter does with `relative
 * z-10`), so they pass over the pinned video instead of behind it, and an
 * opaque background so the video never shows through the text.
 *
 * `position` and `z-index` are confined to `.about-band` itself — scoped and
 * uniquely named, so no parent, no other page and no global style is touched.
 * The footage panel, its pinning and its playback are untouched.
 */
.about-band {
  position: relative;
  z-index: 1;
  background-color: var(--color-cream-50);
  padding-top: 4.5rem;
  padding-bottom: 4.5rem;
}

.about-band--cream {
  background-color: var(--color-cream-100);
}

.about-band__inner {
  margin-left: auto;
  margin-right: auto;
  max-width: 80rem;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}

.about-band__heading {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3.4vw, 2.5rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  color: var(--color-forest-950);
}

@media (min-width: 40rem) {
  .about-band__inner {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

@media (min-width: 64rem) {
  .about-band {
    padding-top: 6rem;
    padding-bottom: 6rem;
  }
}

/* ---- 1 — Our Story ---- */
.about-story__eyebrow {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--color-forest-600);
}

.about-story__heading {
  margin-top: 1.25rem;
  font-family: var(--font-display);
  font-size: clamp(2.1rem, 4.8vw, 3.75rem);
  font-weight: 500;
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: var(--color-forest-950);
}

.about-story__lede {
  margin-top: 1.5rem;
  max-width: 48rem;
  font-size: clamp(1.05rem, 1.6vw, 1.3rem);
  line-height: 1.6;
  color: color-mix(in oklab, var(--color-ink-900) 70%, transparent);
}

.about-story__paragraph {
  margin-top: 1.5rem;
  max-width: 48rem;
  font-size: 0.98rem;
  line-height: 1.75;
  color: color-mix(in oklab, var(--color-ink-900) 70%, transparent);
}

/* ---- 2 — Mission, Vision and Values ---- */
.about-mvv {
  display: grid;
  gap: 1.5rem;
  margin-top: 2.5rem;
}

@media (min-width: 48rem) {
  .about-mvv {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.about-mvv__card {
  border-radius: 1.5rem;
  background-color: var(--color-cream-50);
  padding: 1.75rem;
  box-shadow: var(--shadow-soft);
}

.about-mvv__label {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-maize-600);
}

.about-mvv__body {
  margin-top: 1rem;
  font-size: 0.98rem;
  line-height: 1.7;
  color: color-mix(in oklab, var(--color-ink-900) 75%, transparent);
}

.about-mvv__values-heading {
  margin-top: 3.5rem;
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--color-forest-950);
}

.about-mvv__values {
  display: grid;
  gap: 1.25rem;
  margin-top: 1.5rem;
  padding: 0;
  list-style: none;
}

@media (min-width: 48rem) {
  .about-mvv__values {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.about-mvv__value {
  border-top: 2px solid
    color-mix(in oklab, var(--color-forest-900) 12%, transparent);
  padding-top: 1.25rem;
}

.about-mvv__value-name {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--color-forest-950);
}

.about-mvv__value-text {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  line-height: 1.6;
  color: color-mix(in oklab, var(--color-ink-900) 60%, transparent);
}

/* ---- 3 — Milestones timeline ---- */
.about-timeline {
  margin-top: 2.5rem;
  padding-left: 1.75rem;
  border-left: 1px solid
    color-mix(in oklab, var(--color-forest-900) 16%, transparent);
  list-style: none;
}

.about-timeline__item + .about-timeline__item {
  margin-top: 2.75rem;
}

.about-timeline__year {
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-maize-600);
}

.about-timeline__title {
  margin-top: 0.6rem;
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--color-forest-950);
}

.about-timeline__text {
  margin-top: 0.5rem;
  max-width: 44rem;
  font-size: 0.92rem;
  line-height: 1.65;
  color: color-mix(in oklab, var(--color-ink-900) 65%, transparent);
}

/* ---- 4 — Leadership grid ---- */
.about-leadership {
  display: grid;
  gap: 1.5rem;
  margin-top: 2.5rem;
  padding: 0;
  list-style: none;
}

@media (min-width: 40rem) {
  .about-leadership {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 64rem) {
  .about-leadership {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.about-leadership__card {
  border-radius: 1.5rem;
  background-color: var(--color-cream-50);
  padding: 1.75rem;
  box-shadow: var(--shadow-soft);
}

.about-leadership__name {
  margin-top: 1.25rem;
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--color-forest-950);
}

.about-leadership__role {
  margin-top: 0.35rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-maize-600);
}

/* ---- 5 — Partners row ---- */
.about-partners {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2.5rem;
  padding: 0;
  list-style: none;
}

.about-partners__item {
  border-radius: 9999px;
  border: 1px solid
    color-mix(in oklab, var(--color-forest-900) 12%, transparent);
  background-color: var(--color-cream-100);
  padding: 0.65rem 1.4rem;
  font-size: 0.9rem;
  color: color-mix(in oklab, var(--color-forest-950) 75%, transparent);
}

/* ---- 6 — Closing banner ---- */
.about-banner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.75rem;
  border-radius: 1.75rem;
  background-color: var(--color-forest-900);
  padding: 2.5rem 2rem;
}

@media (min-width: 48rem) {
  .about-banner {
    padding: 3rem;
  }
}

.about-banner__title {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2.1rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  color: var(--color-cream-50);
}

.about-banner__text {
  margin-top: 0.75rem;
  max-width: 34rem;
  font-size: 0.95rem;
  line-height: 1.6;
  color: color-mix(in oklab, var(--color-cream-200) 75%, transparent);
}
</style>
