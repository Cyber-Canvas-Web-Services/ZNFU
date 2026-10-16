<script setup>
/**
 * About — the standalone page at /about.
 *
 * The footage panel still opens the page, so the video is the first thing on
 * screen; it and its effects are untouched. Below it are the About-specific
 * sections, which replace the band that used to repeat the home page.
 */
import { onBeforeUnmount, onMounted, ref } from "vue";
import { ArrowLeft, ArrowRight } from "@lucide/vue";

import FieldBand from "@/components/sections/FieldBand.vue";
import { partners as partnerData, purposeVision } from "@/data/home";

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
      description:
        "We plan for the long-term health of the land and the sector.",
    },
  ],

  milestones: [
    {
      year: "1905",
      title: "A union is founded",
      description:
        "Farmers in Lusaka organise to speak with one voice on the issues shaping their livelihoods.",
    },
    {
      year: "1964",
      title: "Independence era",
      description:
        "The Union adapts to a new nation, representing commercial and emerging farmers alike.",
    },
    {
      year: "1991",
      title: "Market reforms",
      description:
        "Members are supported through liberalisation, with advocacy on trade, pricing and input access.",
    },
    {
      year: "2008",
      title: "Farmers’ Village",
      description:
        "The Secretariat consolidates member services at the Showgrounds in Lusaka.",
    },
    {
      year: "2016",
      title: "Digital information",
      description:
        "Market prices and weather advisories begin reaching members through digital channels.",
    },
    {
      year: "2024",
      title: "Climate-smart push",
      description:
        "A national drive on conservation farming, irrigation and resilient seed for smallholders.",
    },
  ],

  leadership: [
    {
      name: "Mwansa Chilufya",
      role: "President",
      image: "/media/leadership/president.webp",
    },
    {
      name: "Natasha Mulenga",
      role: "Vice President",
      image: "/media/leadership/vice-president.webp",
    },
    {
      name: "Kelvin Banda",
      role: "Executive Director",
      image: "/media/leadership/executive-director.webp",
    },
    {
      name: "Thandiwe Phiri",
      role: "Director of Finance",
      image: "/media/leadership/finance-director.webp",
    },
  ],
};

/* The mission statement is Secretariat-supplied, and the vision is the site’s
   existing wording. Both are real, so they stay outside SAMPLE_CONTENT. */
const mission = purposeVision.blocks[0].body;
const vision = purposeVision.blocks[1].body;

/* Working-with carousel: the track slides continuously and each logo lights
   up to full colour as it crosses the centre. The list is rendered twice so
   the wrap-around is seamless. */
const colorLogo = (src) => src?.replace(/\.webp$/, "-color.webp");
const partnerItems = partnerData.items.map((p) => ({ ...p, logo: colorLogo(p.logo) }));
const loopedPartners = [...partnerItems, ...partnerItems];
const rail = ref(null);

/** Scroll the timeline rail by one card, in the direction given. */
function scrollRail(direction) {
  const el = rail.value;
  if (!el) return;
  const card = el.querySelector("li");
  const step = (card?.offsetWidth ?? 280) + 16;
  el.scrollBy({ left: direction * step, behavior: "smooth" });
}

const facts = [
  { label: "Founded", value: "1905" },
  { label: "Based in", value: "Lusaka" },
  { label: "Character", value: "Non-political" },
  { label: "Run by", value: "Its members" },
];
const marquee = ref(null);
const track = ref(null);
const SPEED = 45; // px per second
let frame = 0;
let offset = 0;
let last = 0;
let paused = false;
let reduceMotion = false;

function render() {
  const box = marquee.value;
  const list = track.value;
  if (!box || !list) return;
  const setWidth = list.scrollWidth / 2;
  const center = box.clientWidth / 2;
  list.style.transform = `translate3d(${-offset}px,0,0)`;
  for (const el of list.children) {
    const x = el.offsetLeft + el.offsetWidth / 2 - offset;
    const focus = Math.max(0, 1 - Math.abs(x - center) / (el.offsetWidth * 1.25));
    el.style.setProperty("--focus", focus.toFixed(3));
  }
  return setWidth;
}

function tick(now) {
  const dt = Math.min(now - last, 64) / 1000;
  last = now;
  const setWidth = render();
  if (!paused && setWidth) offset = (offset + SPEED * dt) % setWidth;
  frame = requestAnimationFrame(tick);
}

onMounted(() => {
  reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    track.value?.style.setProperty("--focus", "1");
    for (const el of track.value?.children ?? []) el.style.setProperty("--focus", "1");
    return;
  }
  const box = marquee.value;
  box.addEventListener("pointerenter", () => (paused = true));
  box.addEventListener("pointerleave", () => (paused = false));
  last = performance.now();
  frame = requestAnimationFrame(tick);
});

onBeforeUnmount(() => cancelAnimationFrame(frame));
</script>

<template>
  <div class="ab">
    <!-- 1 — Opening: title beside the facts, story underneath -->
    <section id="about" class="ab-hero" aria-labelledby="ab-heading">
      <div class="ab-shell">
        <div class="ab-hero__top">
          <h1 id="ab-heading" class="ab-hero__title" v-reveal>Our Story</h1>

          <dl class="ab-facts" v-reveal="{ delay: 80 }">
            <div v-for="fact in facts" :key="fact.label">
              <dt>{{ fact.label }}</dt>
              <dd>{{ fact.value }}</dd>
            </div>
          </dl>
        </div>

        <div class="ab-hero__story">
          <p v-for="(paragraph, index) in SAMPLE_CONTENT.storyParagraphs" :key="index">
            {{ paragraph }}
          </p>
        </div>
      </div>
    </section>

    <!-- 2 — Footage with the mission and vision -->
    <div id="about-purpose" class="ab-footage">
      <FieldBand standalone :mission="mission" :vision="vision" />
    </div>

    <!-- 3 — Values -->
    <section class="ab-values" aria-labelledby="ab-values-heading">
      <div class="ab-shell">
        <h2 id="ab-values-heading" class="ab-label">What we stand for</h2>
        <ul class="ab-values__list">
          <li v-for="value in SAMPLE_CONTENT.values" :key="value.name">
            <p class="ab-values__name">{{ value.name }}</p>
            <p class="ab-values__text">{{ value.description }}</p>
          </li>
        </ul>
      </div>
    </section>

    <!-- 4 — Timeline: a rail you scroll sideways -->
    <section class="ab-timeline" aria-labelledby="ab-timeline-heading">
      <div class="ab-shell">
        <div class="ab-timeline__head">
          <h2 id="ab-timeline-heading" class="ab-heading">Our journey</h2>
          <div class="ab-timeline__nav">
            <button type="button" aria-label="Earlier milestones" @click="scrollRail(-1)">
              <ArrowLeft class="h-4 w-4" aria-hidden="true" />
            </button>
            <button type="button" aria-label="Later milestones" @click="scrollRail(1)">
              <ArrowRight class="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <ol ref="rail" class="ab-rail" tabindex="0" aria-label="Milestones, scroll sideways">
        <li v-for="milestone in SAMPLE_CONTENT.milestones" :key="milestone.year">
          <p class="ab-rail__year">{{ milestone.year }}</p>
          <h3>{{ milestone.title }}</h3>
          <p>{{ milestone.description }}</p>
        </li>
      </ol>
    </section>

    <!-- 5 — Leadership: portraits with captions beneath -->
    <section class="ab-people" aria-labelledby="ab-people-heading">
      <div class="ab-shell">
        <h2 id="ab-people-heading" class="ab-heading">The people serving the Union</h2>
        <ul class="ab-people__grid">
          <li v-for="person in SAMPLE_CONTENT.leadership" :key="person.name">
            <img
              :src="person.image"
              :alt="person.name"
              width="560"
              height="700"
              loading="lazy"
              decoding="async"
            />
            <p class="ab-people__name">{{ person.name }}</p>
            <p class="ab-people__role">{{ person.role }}</p>
          </li>
        </ul>
      </div>
    </section>

    <!-- 6 — Partners -->
    <section class="ab-partners" aria-labelledby="ab-partners-heading">
      <div class="ab-shell">
        <h2 id="ab-partners-heading" class="ab-partners__heading">
          {{ partnerData.title }}
        </h2>
        <div ref="marquee" class="ab-marquee">
          <ul ref="track" class="ab-marquee__track">
            <li
              v-for="(partner, index) in loopedPartners"
              :key="index"
              class="ab-marquee__item"
              :aria-hidden="index >= partnerData.items.length || undefined"
            >
              <img v-if="partner.logo" :src="partner.logo" :alt="partner.name" />
              <span v-else>{{ partner.name }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.ab {
  position: relative;
  z-index: 1;
  overflow: clip;
  background: var(--color-cream-50);
  color: var(--color-forest-950);
}

.ab-shell {
  width: 100%;
  max-width: 90rem;
  margin-inline: auto;
  padding-inline: clamp(1.25rem, 4vw, 5.5rem);
}

.ab-heading {
  max-width: 16ch;
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 3.2vw, 3rem);
  font-weight: 500;
  letter-spacing: -0.035em;
  line-height: 1.02;
  text-wrap: balance;
}

.ab-label {
  font-family: var(--font-display);
  font-size: clamp(1.1rem, 1.6vw, 1.4rem);
  font-weight: 500;
}

/* ---- 1: opening ---- */
.ab-hero {
  padding-block: clamp(6rem, 8vw, 7rem) clamp(2rem, 4vw, 3rem);
  background: var(--color-forest-950);
  color: var(--color-cream-50);
}

.ab-hero__top {
  display: grid;
  gap: 1.75rem;
  align-items: end;
}

.ab-hero__title {
  font-family: var(--font-display);
  font-size: clamp(3.5rem, 9vw, 8.5rem);
  font-weight: 500;
  letter-spacing: -0.05em;
  line-height: 0.88;
}

.ab-facts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0;
  margin: 0;
}

.ab-facts div {
  padding-block: 0.9rem;
  border-top: 1px solid rgb(251 249 243 / 0.25);
}

.ab-facts dt {
  color: rgb(251 249 243 / 0.6);
  font-size: 0.85rem;
}

.ab-facts dd {
  margin: 0.15rem 0 0;
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 2.4vw, 2.1rem);
  font-weight: 500;
  letter-spacing: -0.02em;
}

.ab-hero__story {
  display: grid;
  gap: 1rem 3rem;
  max-width: 62rem;
  margin-top: clamp(1.5rem, 3vw, 2.5rem);
  color: rgb(251 249 243 / 0.78);
  font-size: 1.02rem;
  line-height: 1.7;
}

.ab-footage {
  position: relative;
  z-index: 2;
  overflow: clip;
}

/* ---- 3: values ---- */
.ab-values {
  padding-block: clamp(2rem, 3.5vw, 3rem);
  background: #f5c62a;
}

.ab-values__list {
  display: grid;
  gap: 0;
  margin: 1rem 0 0;
  padding: 0;
  list-style: none;
}

.ab-values__list li {
  padding-block: 1.1rem;
  border-top: 1px solid rgb(4 32 21 / 0.35);
}

.ab-values__name {
  font-family: var(--font-display);
  font-size: clamp(2rem, 3.8vw, 3.6rem);
  font-weight: 500;
  letter-spacing: -0.035em;
  line-height: 1;
}

.ab-values__text {
  max-width: 22rem;
  margin-top: 0.6rem;
  color: rgb(4 32 21 / 0.82);
  line-height: 1.55;
}

/* ---- 4: timeline rail ---- */
.ab-timeline {
  padding-block: clamp(2rem, 4vw, 3.5rem);
}

.ab-timeline__head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
}

.ab-timeline__nav {
  display: flex;
  gap: 0.5rem;
}

.ab-timeline__nav button {
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  place-items: center;
  border: 1px solid rgb(4 32 21 / 0.35);
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 160ms ease, color 160ms ease;
}

.ab-timeline__nav button:hover {
  background: var(--color-forest-950);
  color: #fff;
}

.ab-rail {
  display: flex;
  gap: 1rem;
  margin: clamp(1.25rem, 2.5vw, 2rem) 0 0;
  padding: 0 clamp(1.25rem, 4vw, 5.5rem) 0.5rem;
  overflow-x: auto;
  list-style: none;
  scroll-padding-inline: clamp(1.25rem, 4vw, 5.5rem);
  scroll-snap-type: x proximity;
  scrollbar-width: thin;
}

.ab-rail li {
  flex: 0 0 min(19rem, 80vw);
  padding-top: 1rem;
  border-top: 3px solid var(--color-forest-950);
  scroll-snap-align: start;
}

.ab-rail__year {
  color: var(--color-forest-600);
  font-family: var(--font-display);
  font-size: clamp(3rem, 5vw, 4.5rem);
  font-weight: 500;
  letter-spacing: -0.04em;
  line-height: 0.95;
}

.ab-rail h3 {
  margin-top: 0.9rem;
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

.ab-rail li > p:last-child {
  margin-top: 0.5rem;
  color: rgb(19 24 19 / 0.68);
  font-size: 0.95rem;
  line-height: 1.6;
}

/* ---- 5: people ---- */
.ab-people {
  padding-block: clamp(2rem, 4vw, 3.5rem);
  background: var(--color-cream-100);
}

.ab-people__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem 1rem;
  margin: clamp(1.25rem, 2.5vw, 2rem) 0 0;
  padding: 0;
  list-style: none;
}

.ab-people__grid img {
  width: 100%;
  aspect-ratio: 4 / 5;
  border-radius: 5px;
  object-fit: cover;
  object-position: center 20%;
}

.ab-people__name {
  margin-top: 0.7rem;
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 500;
}

.ab-people__role {
  margin-top: 0.15rem;
  color: rgb(19 24 19 / 0.65);
  font-size: 0.9rem;
}

/* ---- 6: partners ---- */
.ab-partners {
  padding-block: clamp(1.75rem, 3vw, 2.5rem);
  background: #fff;
}

.ab-partners__heading {
  font-size: 0.9rem;
  font-weight: 560;
  text-align: center;
}

.ab-marquee {
  position: relative;
  margin-top: 1rem;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent);
}

.ab-marquee__track {
  display: flex;
  width: max-content;
  margin: 0;
  padding: 0;
  list-style: none;
  will-change: transform;
}

.ab-marquee__item {
  --focus: 0;
  display: grid;
  width: 12rem;
  min-width: 12rem;
  min-height: 5.5rem;
  place-items: center;
  padding: 0.5rem 0.75rem;
  color: rgb(4 32 21 / 0.68);
  font-size: 0.78rem;
  font-weight: 600;
  text-align: center;
  filter: grayscale(calc(1 - var(--focus)));
  opacity: calc(0.4 + 0.6 * var(--focus));
  transform: scale(calc(0.88 + 0.16 * var(--focus)));
}

.ab-marquee__item img {
  width: 100%;
  max-width: 10rem;
  height: 4rem;
  object-fit: contain;
}

.ab-timeline__nav button:focus-visible,
.ab-rail:focus-visible {
  outline: 3px solid var(--color-forest-600);
  outline-offset: 3px;
}

@media (min-width: 40rem) {
  .ab-hero__story {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ab-values__list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0 clamp(1.5rem, 3vw, 3rem);
  }

  .ab-people__grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1rem;
  }
}

@media (min-width: 64rem) {
  .ab-hero__top {
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 0.8fr);
    gap: 3rem;
  }
}
</style>
