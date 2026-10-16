<script setup>
/**
 * About — the standalone page at /about.
 *
 * The footage panel still opens the page, so the video is the first thing on
 * screen; it and its effects are untouched. Below it are the About-specific
 * sections, which replace the band that used to repeat the home page.
 */
import { onBeforeUnmount, onMounted, ref } from "vue";
import { ArrowRight, User } from "@lucide/vue";

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
const activePerson = ref(0);
const loopedPartners = [...partnerItems, ...partnerItems];
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
  <div class="about-page">
    <!-- Reference-inspired editorial hero, using the existing ZNFU story. -->
    <section id="about" class="about-hero" aria-labelledby="about-heading">
      <div class="about-shell about-hero__inner">
        <p class="about-kicker" v-reveal>
          <span>01</span>
          About the Union
        </p>

        <h1 id="about-heading" class="about-hero__heading" v-reveal="{ delay: 60 }">
          Our Story
        </h1>

        <p class="about-hero__lede" v-reveal="{ delay: 110 }">
          The Zambia National Farmers’ Union was founded in 1905 and is based in
          Lusaka. It is a non-political, member-led union.
        </p>

        <div class="about-hero__copy">
          <p
            v-for="(paragraph, index) in SAMPLE_CONTENT.storyParagraphs"
            :key="index"
            v-reveal="{ delay: 160 + index * 60 }"
          >
            {{ paragraph }}
          </p>
        </div>

        <a href="#about-purpose" class="about-hero__cta" v-reveal="{ delay: 260 }">
          Why the Union exists
          <ArrowRight class="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>

    <!-- Existing ZNFU footage and copy become the reference's image showcase. -->
    <div id="about-purpose" class="about-showcase">
      <FieldBand standalone :mission="mission" :vision="vision" />
    </div>

    <!-- A compact foundations band for the Union's existing values. -->
    <section class="about-mvv-section" aria-labelledby="about-mvv-heading">
      <div class="about-shell">
        <p class="about-kicker about-kicker--light" v-reveal>
          <span>03</span>
          Our foundations
        </p>
        <h2 id="about-mvv-heading" class="about-section-heading" v-reveal="{ delay: 60 }">
          Our Values
        </h2>

        <ul class="about-values" aria-label="Our values">
          <li
            v-for="(value, index) in SAMPLE_CONTENT.values"
            :key="value.name"
            v-reveal="{ delay: 140 + index * 70 }"
          >
            <p class="about-values__name">{{ value.name }}</p>
            <p class="about-values__text">{{ value.description }}</p>
          </li>
        </ul>
      </div>
    </section>

    <!-- Existing milestone content in the reference's horizontal feature rhythm. -->
    <section class="about-section about-section--light" aria-labelledby="about-milestones-heading">
      <div class="about-shell">
        <p class="about-kicker" v-reveal>
          <span>04</span>
          Our journey
        </p>
        <h2 id="about-milestones-heading" class="about-section-heading" v-reveal="{ delay: 60 }">
          Milestones
        </h2>

        <ol class="about-milestones">
          <li
            v-for="(milestone, index) in SAMPLE_CONTENT.milestones"
            :key="index"
            class="about-milestones__card"
            v-reveal="{ delay: 120 + index * 70 }"
          >
            <p class="about-milestones__index">0{{ index + 1 }}</p>
            <p class="about-milestones__year">{{ milestone.year }}</p>
            <h3>{{ milestone.title }}</h3>
            <p>{{ milestone.description }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- Existing leadership entries use the clean card composition from the reference. -->
    <section class="about-section about-section--muted" aria-labelledby="about-leadership-heading">
      <div class="about-shell">
        <p class="about-kicker" v-reveal>
          <span>05</span>
          Leadership
        </p>
        <h2 id="about-leadership-heading" class="about-section-heading" v-reveal="{ delay: 60 }">
          The people serving the Union
        </h2>

        <ul
          class="about-leadership"
          :style="{ '--cols': SAMPLE_CONTENT.leadership.map((_, i) => (i === activePerson ? 'minmax(0, 2.15fr)' : 'minmax(5.5rem, 0.38fr)')).join(' ') }"
        >
          <li
            v-for="(person, index) in SAMPLE_CONTENT.leadership"
            :key="index"
            class="about-leadership__card"
            :class="{ 'is-active': index === activePerson }"
            :style="{ backgroundImage: `url(${person.image})` }"
            v-reveal="{ delay: 120 + index * 70 }"
          >
            <button
              type="button"
              class="about-leadership__button"
              :aria-expanded="index === activePerson"
              :aria-label="`${person.name}, ${person.role}`"
              @click="activePerson = index"
            ></button>
            <div class="about-leadership__content">
              <User class="about-leadership__icon" aria-hidden="true" />
              <div class="about-leadership__text">
                <p class="about-leadership__name">{{ person.name }}</p>
                <p class="about-leadership__role">{{ person.role }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <section class="about-section about-section--light about-section--partners" aria-labelledby="about-partners-heading">
      <div class="about-shell">
        <h2 id="about-partners-heading" class="about-partners__heading" v-reveal>
          {{ partnerData.title }}
        </h2>

        <div ref="marquee" class="about-partners" v-reveal="{ delay: 80 }">
          <ul ref="track" class="about-partners__track">
            <li
              v-for="(partner, index) in loopedPartners"
              :key="index"
              class="about-partners__item"
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
.about-page {
  position: relative;
  z-index: 1;
  overflow: clip;
  background: var(--color-cream-50);
  color: var(--color-forest-950);
}

.about-shell {
  width: 100%;
  max-width: 90rem;
  margin-inline: auto;
  padding-inline: clamp(1.25rem, 4vw, 5.5rem);
}

.about-kicker {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  width: fit-content;
  margin: 0;
  padding: 0.32rem 0.75rem 0.32rem 0.35rem;
  border: 1px solid rgb(4 32 21 / 0.14);
  border-radius: 9999px;
  background: rgb(255 255 255 / 0.72);
  color: var(--color-forest-900);
  font-size: 0.68rem;
  font-weight: 650;
  letter-spacing: 0.08em;
  line-height: 1;
  text-transform: uppercase;
}

.about-kicker span {
  display: grid;
  width: 1.55rem;
  height: 1.55rem;
  place-items: center;
  border: 1px solid rgb(4 32 21 / 0.12);
  border-radius: 50%;
  background: #fff;
  letter-spacing: 0;
}

.about-kicker--light {
  border-color: rgb(4 32 21 / 0.1);
  background: rgb(255 255 255 / 0.75);
}

.about-hero {
  position: relative;
  padding-block: clamp(6rem, 8vw, 7rem) clamp(2.5rem, 3vw, 3.5rem);
  background:
    radial-gradient(circle at 50% 42%, rgb(8 58 31 / 0.04), transparent 36%),
    var(--color-cream-50);
  text-align: center;
}

.about-hero::before {
  position: absolute;
  inset: 5.5rem auto auto 50%;
  width: min(46rem, 82vw);
  aspect-ratio: 1;
  border: clamp(2.5rem, 7vw, 6rem) solid rgb(8 58 31 / 0.018);
  border-radius: 50%;
  content: "";
  pointer-events: none;
  transform: translateX(-50%);
}

.about-hero__inner {
  position: relative;
}

.about-hero__heading {
  max-width: 12ch;
  margin: clamp(1.25rem, 2vw, 2rem) auto 0;
  color: var(--color-forest-950);
  font-family: var(--font-display);
  font-size: clamp(3.25rem, 5.5vw, 5.5rem);
  font-weight: 500;
  letter-spacing: -0.045em;
  line-height: 0.92;
}

.about-hero__lede {
  max-width: 48rem;
  margin: clamp(1.25rem, 2vw, 2rem) auto 0;
  color: rgb(19 24 19 / 0.72);
  font-size: clamp(1rem, 1.5vw, 1.25rem);
  font-weight: 500;
  line-height: 1.65;
}

.about-hero__copy {
  display: grid;
  max-width: 64rem;
  gap: 1rem 2rem;
  margin: 1.5rem auto 0;
  color: rgb(19 24 19 / 0.62);
  font-size: 0.94rem;
  line-height: 1.7;
  text-align: left;
}

.about-hero__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 3rem;
  margin-top: 1.5rem;
  padding-inline: 1.4rem;
  border-radius: 9999px;
  background: var(--color-forest-950);
  color: #fff;
  font-size: 0.82rem;
  font-weight: 650;
  text-decoration: none;
  transition:
    background-color 180ms ease,
    transform 180ms ease;
}

.about-hero__cta:hover {
  background: var(--color-forest-700);
  transform: translateY(-2px);
}

.about-showcase {
  position: relative;
  z-index: 2;
  width: 100%;
  overflow: clip;
}

.about-mvv-section,
.about-section {
  padding-block: clamp(3rem, 5vw, 4.75rem);
}

.about-mvv-section {
  background: #f5c62a;
}

.about-section--light {
  background: #fff;
}

.about-section--muted {
  background:
    linear-gradient(135deg, rgb(8 58 31 / 0.018), transparent 45%),
    var(--color-cream-100);
}

.about-section--partners {
  padding-block: clamp(2.25rem, 3vw, 3rem);
}

.about-section-heading {
  max-width: 14ch;
  margin-top: clamp(1rem, 2vw, 1.75rem);
  color: var(--color-forest-950);
  font-family: var(--font-display);
  font-size: clamp(2.25rem, 4vw, 4.25rem);
  font-weight: 500;
  letter-spacing: -0.04em;
  line-height: 0.98;
  text-wrap: balance;
}

.about-values {
  display: grid;
  gap: 1rem;
  margin: clamp(2rem, 3.5vw, 3rem) 0 0;
  padding: 0;
  list-style: none;
}

.about-values li {
  padding-top: 1.25rem;
  border-top: 1px solid rgb(4 32 21 / 0.26);
}

.about-values__name {
  color: var(--color-forest-950);
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 2vw, 2rem);
  font-weight: 520;
}

.about-values__text {
  max-width: 22rem;
  margin-top: 0.65rem;
  color: rgb(4 32 21 / 0.68);
  font-size: 0.9rem;
  line-height: 1.6;
}

.about-milestones {
  display: grid;
  gap: 1rem;
  margin: clamp(2rem, 3.5vw, 3rem) 0 0;
  padding: 0;
  list-style: none;
}

.about-milestones__card {
  position: relative;
  min-height: 13rem;
  overflow: hidden;
  padding: 1.75rem;
  border: 1px solid rgb(4 32 21 / 0.1);
  border-radius: 5px;
  background: var(--color-cream-50);
}

.about-milestones__index {
  position: absolute;
  top: 1.25rem;
  right: 1.5rem;
  color: rgb(8 58 31 / 0.1);
  font-family: var(--font-display);
  font-size: 4rem;
  font-weight: 600;
  line-height: 1;
}

.about-milestones__year {
  color: var(--color-forest-600);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.about-milestones__card h3 {
  max-width: 10ch;
  margin-top: 3.25rem;
  color: var(--color-forest-950);
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 2vw, 2rem);
  font-weight: 500;
  line-height: 1.08;
}

.about-milestones__card > p:last-child {
  max-width: 24rem;
  margin-top: 0.75rem;
  color: rgb(19 24 19 / 0.62);
  font-size: 0.88rem;
  line-height: 1.6;
}

.about-leadership {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0.75rem;
  margin: clamp(2rem, 3.5vw, 3rem) 0 0;
  padding: 0;
  list-style: none;
}

.about-leadership__card {
  position: relative;
  display: flex;
  min-height: 11rem;
  align-items: flex-end;
  overflow: hidden;
  padding: 1.25rem;
  border-radius: 8px;
  background-color: var(--color-forest-900);
  background-position: center 20%;
  background-size: cover;
  isolation: isolate;
}

.about-leadership__button {
  position: absolute;
  z-index: 1;
  inset: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.about-leadership__button:focus-visible {
  outline: 3px solid #f5c62a;
  outline-offset: -3px;
}

.about-leadership__card::after {
  position: absolute;
  z-index: -1;
  inset: 0;
  background: linear-gradient(180deg, rgb(4 32 21 / 0.05) 20%, rgb(4 32 21 / 0.9) 100%);
  content: "";
}

.about-leadership__content {
  color: #fff;
}

.about-leadership__icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-bottom: 0.65rem;
  color: #e7f59c;
}

.about-leadership__name {
  color: #fff;
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 520;
}

.about-leadership__role {
  margin-top: 0.25rem;
  color: rgb(255 255 255 / 0.7);
  font-size: 0.76rem;
  font-weight: 650;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.about-partners {
  position: relative;
  margin-top: 1.25rem;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent);
}

.about-partners__track {
  display: flex;
  width: max-content;
  margin: 0;
  padding: 0;
  list-style: none;
  will-change: transform;
}

.about-partners__heading {
  color: var(--color-forest-900);
  font-size: 0.9rem;
  font-weight: 560;
  text-align: center;
}

.about-partners__item {
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

.about-partners__item img {
  width: 100%;
  max-width: 10rem;
  height: 4rem;
  object-fit: contain;
}

@media (min-width: 40rem) {
  .about-hero__copy {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .about-values {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .about-milestones {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 64rem) {
  .about-milestones {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .about-leadership {
    grid-template-columns: var(--cols);
    transition: grid-template-columns 600ms cubic-bezier(0.22, 1, 0.36, 1);
    grid-auto-rows: 22rem;
  }

  .about-leadership__card {
    min-height: 0;
  }

  .about-leadership__card {
    transition: padding 300ms ease;
  }

  .about-leadership__card:not(.is-active) {
    padding: 1rem 0.85rem;
  }

  .about-leadership__card:not(.is-active) .about-leadership__content {
    display: flex;
    height: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }

  .about-leadership__card:not(.is-active) .about-leadership__icon {
    margin: 0;
  }

  /* Collapsed: name and role become two side-by-side columns reading
     bottom-to-top, starting at the foot of the card. */
  .about-leadership__card:not(.is-active) .about-leadership__text {
    display: flex;
    gap: 0.7rem;
    writing-mode: vertical-rl;
    white-space: nowrap;
    transform: rotate(180deg);
  }

  .about-leadership__card:not(.is-active) .about-leadership__name {
    font-size: 1.1rem;
    line-height: 1.2;
  }

  .about-leadership__card:not(.is-active) .about-leadership__role {
    margin: 0;
    font-size: 0.68rem;
    line-height: 1.8;
  }
}

@media (prefers-reduced-motion: reduce) {
  .about-leadership {
    transition: none !important;
  }
}

@media (max-width: 39.999rem) {
  .about-hero__heading {
    font-size: clamp(3rem, 17vw, 4.5rem);
  }
}
</style>
