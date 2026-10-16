<script setup>
/**
 * About — the standalone page at /about.
 *
 * The footage panel still opens the page, so the video is the first thing on
 * screen; it and its effects are untouched. Below it are the About-specific
 * sections, which replace the band that used to repeat the home page.
 */
import { onBeforeUnmount, onMounted, ref } from "vue";

import FieldBand from "@/components/sections/FieldBand.vue";
import { partners as partnerData, purposeVision } from "@/data/home";

import { SAMPLE_CONTENT } from "@/data/about";

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
const activePerson = ref(0);

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

onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
});
</script>

<template>
  <div class="ab">
    <!-- 1 — Opening statement -->
    <section id="about" class="ab-hero" aria-labelledby="ab-heading">
      <div class="ab-shell">
        <h1 id="ab-heading" class="ab-hero__title" v-reveal>Our Story</h1>
        <p class="ab-hero__lede" v-reveal="{ delay: 80 }">
          The Zambia National Farmers’ Union was founded in 1905 and is based in
          Lusaka. It is a non-political, member-led union.
        </p>
      </div>
    </section>

    <!-- 2 — Footage with the mission and vision -->
    <div id="about-purpose" class="ab-footage">
      <FieldBand standalone :mission="mission" :vision="vision" />
    </div>

    <!-- 3 — Chapters: a pinned index beside the scrolling content -->
    <div class="ab-shell ab-chapters">
      <div class="ab-content">
        <section id="ab-story" class="ab-block" aria-labelledby="ab-story-heading">
          <h2 id="ab-story-heading" class="ab-heading">Where we come from</h2>
          <div class="ab-story">
            <p v-for="(paragraph, index) in SAMPLE_CONTENT.storyParagraphs" :key="index">
              {{ paragraph }}
            </p>
          </div>
        </section>

        <section id="ab-values" class="ab-block" aria-labelledby="ab-values-heading">
          <h2 id="ab-values-heading" class="ab-heading">What we stand for</h2>
          <ul class="ab-values">
            <li v-for="value in SAMPLE_CONTENT.values" :key="value.name">
              <p class="ab-values__name">{{ value.name }}</p>
              <p class="ab-values__text">{{ value.description }}</p>
            </li>
          </ul>
        </section>

        <section id="ab-journey" class="ab-block" aria-labelledby="ab-journey-heading">
          <h2 id="ab-journey-heading" class="ab-heading">Our journey</h2>
          <ol class="ab-timeline">
            <li v-for="milestone in SAMPLE_CONTENT.milestones" :key="milestone.year">
              <p class="ab-timeline__year">{{ milestone.year }}</p>
              <div>
                <h3>{{ milestone.title }}</h3>
                <p>{{ milestone.description }}</p>
              </div>
            </li>
          </ol>
        </section>

        <section id="ab-people" class="ab-block" aria-labelledby="ab-people-heading">
          <h2 id="ab-people-heading" class="ab-heading">The people serving the Union</h2>
          <div class="ab-people">
            <ul class="ab-people__list">
              <li v-for="(person, index) in SAMPLE_CONTENT.leadership" :key="person.name">
                <button
                  type="button"
                  :class="{ 'is-active': index === activePerson }"
                  :aria-pressed="index === activePerson"
                  @mouseenter="activePerson = index"
                  @focus="activePerson = index"
                  @click="activePerson = index"
                >
                  <span class="ab-people__name">{{ person.name }}</span>
                  <span class="ab-people__role">{{ person.role }}</span>
                </button>
              </li>
            </ul>

            <div class="ab-people__photo" aria-hidden="true">
              <img
                v-for="(person, index) in SAMPLE_CONTENT.leadership"
                :key="person.name"
                :class="{ 'is-on': index === activePerson }"
                :src="person.image"
                alt=""
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- 4 — Partners -->
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
  background: var(--color-cream-50);
  color: var(--color-forest-950);
}

.ab-shell {
  width: 100%;
  max-width: var(--shell-max);
  margin-inline: auto;
  padding-inline: var(--shell-pad);
}

.ab-heading {
  font-family: var(--font-display);
  font-size: var(--section-title);
  font-weight: 500;
  letter-spacing: -0.035em;
  line-height: 1.02;
  text-wrap: balance;
}

/* ---- 1: opening ---- */
.ab-hero {
  padding-block: clamp(5.5rem, 6.5vw, 6.25rem) var(--space-section);
}

.ab-hero__title {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: var(--page-title);
  letter-spacing: var(--page-title-tracking);
  line-height: var(--page-title-leading);
}

.ab-hero__lede {
  color: rgb(19 24 19 / 0.78);
  font-size: var(--page-lede);
  line-height: var(--page-lede-leading);
  max-width: var(--page-lede-measure);
  font-family: var(--font-sans);
  letter-spacing: normal;
  margin-top: 1rem;
}

.ab-footage {
  position: relative;
  z-index: 2;
  overflow: clip;
}

/* ---- 3: chapters ---- */
.ab-chapters {
  display: grid;
  gap: 1rem;
  padding-block: var(--space-section);
}

.ab-block {
  padding-block: var(--space-section);
  border-top: 1px solid rgb(4 32 21 / 0.2);
  scroll-margin-top: 6rem;
}

.ab-block:first-child {
  border-top: 0;
  padding-top: 0;
}

.ab-story {
  display: grid;
  gap: 1rem var(--space-gap);
  margin-top: 1rem;
  color: rgb(19 24 19 / 0.74);
  font-size: 1.05rem;
  line-height: 1.75;
}

/* Values: one yellow slab holding three plain rows */
.ab-values {
  margin: 1.25rem 0 0;
  padding: clamp(1rem, 2vw, 1.5rem) clamp(1.25rem, 2.5vw, 2rem);
  border-radius: 5px;
  background: #f5c62a;
  list-style: none;
}

.ab-values li {
  display: grid;
  gap: 0.35rem;
  padding-block: 1rem;
  border-top: 1px solid rgb(4 32 21 / 0.3);
}

.ab-values li:first-child {
  border-top: 0;
}

.ab-values__name {
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 2vw, 1.75rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.ab-values__text {
  max-width: 34rem;
  color: rgb(4 32 21 / 0.82);
  font-size: var(--page-lede);
  line-height: var(--page-lede-leading);
}

/* Journey: a grid of milestones, each under its own rule */
.ab-timeline {
  display: grid;
  gap: 0 var(--space-gap);
  margin: 1.25rem 0 0;
  padding: 0;
  list-style: none;
}

.ab-timeline li {
  display: grid;
  align-content: start;
  gap: 0.3rem;
  padding-block: 1rem 1.25rem;
  border-top: 3px solid var(--color-forest-950);
}

.ab-timeline__year {
  color: var(--color-forest-600);
  font-family: var(--font-display);
  font-size: clamp(2rem, 3.4vw, 3rem);
  font-weight: 500;
  letter-spacing: -0.04em;
  line-height: 1;
}

.ab-timeline h3 {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 500;
  letter-spacing: -0.02em;
}

.ab-timeline li p:last-child {
  max-width: 26rem;
  margin-top: 0.35rem;
  color: rgb(19 24 19 / 0.68);
  line-height: 1.6;
}

/* People: names as a list; the portrait follows hover, focus or tap */
.ab-people {
  display: grid;
  gap: 1rem;
  margin-top: 1.25rem;
}

.ab-people__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.ab-people__list button {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 0.15rem;
  padding-block: 0.9rem;
  border-top: 1px solid rgb(4 32 21 / 0.2);
  text-align: left;
  cursor: pointer;
  opacity: 0.55;
  transition: opacity 200ms ease;
}

.ab-people__list li:last-child button {
  border-bottom: 1px solid rgb(4 32 21 / 0.2);
}

.ab-people__list button.is-active,
.ab-people__list button:hover {
  opacity: 1;
}

.ab-people__name {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 2.6vw, 2.3rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.05;
}

.ab-people__role {
  color: var(--color-forest-600);
  font-size: 0.92rem;
  font-weight: 600;
}

.ab-people__photo {
  position: relative;
  aspect-ratio: 4 / 5;
  max-height: 26rem;
  overflow: hidden;
  border-radius: 5px;
  background: var(--color-forest-900);
}

.ab-people__photo img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
  opacity: 0;
  transition: opacity 350ms ease;
}

.ab-people__photo img.is-on {
  opacity: 1;
}

.ab-people__list button:focus-visible {
  outline: 3px solid var(--color-forest-600);
  outline-offset: 3px;
}

/* ---- 4: partners ---- */
.ab-partners {
  padding-block: var(--space-section);
  background: #fff;
  overflow: clip;
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

@media (min-width: 48rem) {
  /* Name and description centred on each other, so the big word and its
     one-line explanation sit on the same horizontal axis. */
  .ab-values li {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 1.5rem;
    align-items: center;
  }

  .ab-values__text {
    margin-top: 0;
  }

  .ab-story {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ab-timeline {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ab-people {
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
    gap: var(--space-gap);
    align-items: stretch;
  }

  /* The portrait takes its height from the list of names beside it. */
  .ab-people__photo {
    aspect-ratio: auto;
    max-height: none;
    min-height: 14rem;
    contain: size;
  }
}

@media (min-width: 64rem) {
  .ab-timeline {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (prefers-reduced-motion: reduce) {
  .ab-people__photo img,
  .ab-people__list button {
    transition: none;
  }
}
</style>
