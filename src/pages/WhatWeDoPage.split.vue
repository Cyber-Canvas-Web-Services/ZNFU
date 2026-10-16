<script setup>
/**
 * What we do — the standalone page at /what-we-do.
 *
 * A split page. On desktop the left column stays pinned — title, introduction
 * and one photograph — while the right column scrolls through the mission and
 * the Union's three core functions. As each function crosses the middle of
 * the screen, the pinned photograph changes to match it, so the picture always
 * belongs to the text being read. On phones the columns stack and each
 * function carries its own photo.
 *
 * Copy is confirmed-only (see docs/what-we-do-page.md): every phrase comes
 * from the mission statement or the Union's published description.
 */
import { onBeforeUnmount, onMounted, ref } from "vue";

import { media, whatWeDo } from "@/data/home";

const members = [
  "Individual farmers",
  "Corporations",
  "Companies",
  "Purveyors",
  "Other organisations involved in the business of agriculture",
];

const aims = ["Sustainable agriculture", "Economic development", "Social development"];

const functions = [
  {
    title: "Lobbying and advocacy",
    body: "We use the Union’s voice to promote and safeguard the interest of our members.",
    image: media.fieldMaizeDemoDay,
    alt: "Farmers and agronomists inspecting a maize demonstration plot",
  },
  {
    title: "Member services",
    body: "We provide services that support our members directly.",
    image: media.livestockGoatsKraal,
    alt: "A kraal of goats held by farmers at a livestock pen",
  },
  {
    title: "Information",
    body: "We gather and share information for members in the business of agriculture.",
    image: media.horticulturePassionFruit,
    alt: "Passion fruit ripening on a trellised orchard",
  },
];

/** The pinned photograph: -1 is the opening image, 0–2 follow the functions. */
const active = ref(-1);
const rows = ref([]);
let observer = null;

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) active.value = Number(entry.target.dataset.index);
      }
    },
    { rootMargin: "-40% 0px -40% 0px" },
  );
  rows.value.forEach((row) => row && observer.observe(row));
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <div class="wwd">
    <div id="what-we-do" class="wwd-shell wwd-split">
      <!-- Pinned column -->
      <aside class="wwd-pin" aria-labelledby="wwd-heading">
        <h1 id="wwd-heading" class="wwd-title" v-reveal>What we do</h1>
        <p class="wwd-intro" v-reveal="{ delay: 80 }">
          The Zambia National Farmers’ Union is a member-led, non-political
          union. Founded in 1905 and based in Lusaka, we promote and safeguard
          the interest of our members in the business of agriculture.
        </p>

        <div class="wwd-photo" aria-hidden="true">
          <img
            class="wwd-photo__img"
            :class="{ 'is-on': active === -1 }"
            :src="media.growerMaizeField"
            alt=""
          />
          <img
            v-for="(item, index) in functions"
            :key="item.title"
            class="wwd-photo__img"
            :class="{ 'is-on': active === index }"
            :src="item.image"
            alt=""
          />
        </div>
      </aside>

      <!-- Scrolling column -->
      <div class="wwd-flow">
        <section class="wwd-mission" aria-labelledby="wwd-mission-heading">
          <h2 id="wwd-mission-heading">Our mission</h2>
          <blockquote>{{ whatWeDo.lede }}</blockquote>

          <div class="wwd-mission__lists">
            <div>
              <h3>Who we represent</h3>
              <ul>
                <li v-for="member in members" :key="member">{{ member }}</li>
              </ul>
            </div>
            <div>
              <h3>What we work to achieve</h3>
              <ul>
                <li v-for="aim in aims" :key="aim">{{ aim }}</li>
              </ul>
            </div>
          </div>
        </section>

        <section class="wwd-functions" aria-labelledby="wwd-functions-heading">
          <h2 id="wwd-functions-heading" class="wwd-functions__heading">
            How the Union works for members
          </h2>

          <ul>
            <li
              v-for="(item, index) in functions"
              :key="item.title"
              :ref="(el) => (rows[index] = el)"
              :data-index="index"
              class="wwd-function"
              :class="{ 'is-active': active === index }"
            >
              <img class="wwd-function__img" :src="item.image" :alt="item.alt" loading="lazy" decoding="async" />
              <h3>{{ item.title }}</h3>
              <p>{{ item.body }}</p>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wwd {
  position: relative;
  z-index: 1;
  background: var(--color-cream-50);
  color: var(--color-forest-950);
}

.wwd-shell {
  width: 100%;
  max-width: var(--shell-max);
  margin-inline: auto;
  padding-inline: var(--shell-pad);
}

.wwd-split {
  display: grid;
  gap: 1.75rem;
  padding-block: clamp(5.5rem, 6.5vw, 6.25rem) var(--space-section);
}

/* ---- Pinned column ---- */
.wwd-title {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: var(--page-title);
  letter-spacing: var(--page-title-tracking);
  line-height: var(--page-title-leading);
}

.wwd-intro {
  margin-top: 1.1rem;
  color: rgb(19 24 19 / 0.74);
  font-size: var(--page-lede);
  line-height: var(--page-lede-leading);
  max-width: var(--page-lede-measure);
}

.wwd-photo {
  display: none;
}

/* ---- Mission ---- */
.wwd-mission {
  padding: clamp(1.5rem, 3vw, 2.5rem);
  border-radius: 5px;
  background: var(--color-forest-900);
  color: var(--color-cream-50);
}

.wwd-mission h2 {
  color: var(--color-maize-400);
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 500;
}

.wwd-mission blockquote {
  margin: 0.85rem 0 0;
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 1.7vw, 1.5rem);
  font-weight: 500;
  letter-spacing: -0.015em;
  line-height: 1.35;
  text-wrap: pretty;
}

.wwd-mission__lists {
  display: grid;
  gap: 1.25rem;
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgb(251 249 243 / 0.25);
}

.wwd-mission__lists h3 {
  color: rgb(251 249 243 / 0.6);
  font-size: 0.88rem;
  font-weight: 500;
}

.wwd-mission__lists ul {
  display: grid;
  gap: 0.3rem;
  margin: 0.5rem 0 0;
  padding: 0;
  list-style: none;
  font-size: var(--page-lede);
  line-height: 1.4;
}

/* ---- Functions ---- */
.wwd-functions {
  margin-top: clamp(1.75rem, 3vw, 2.5rem);
}

.wwd-functions__heading {
  font-family: var(--font-display);
  font-size: var(--section-title);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.05;
}

.wwd-functions ul {
  margin: 1rem 0 0;
  padding: 0;
  list-style: none;
}

.wwd-function {
  display: grid;
  gap: 0.5rem;
  padding-block: 1.25rem;
  border-top: 2px solid rgb(4 32 21 / 0.15);
  transition: border-color 300ms ease;
}

.wwd-function:last-child {
  border-bottom: 2px solid rgb(4 32 21 / 0.15);
}

.wwd-function__img {
  width: 100%;
  aspect-ratio: 16 / 9;
  margin-bottom: 0.5rem;
  border-radius: 5px;
  object-fit: cover;
}

.wwd-function h3 {
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 2vw, 1.75rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

.wwd-function p {
  max-width: 30rem;
  color: rgb(19 24 19 / 0.72);
  font-size: var(--page-lede);
  line-height: var(--page-lede-leading);
}

@media (min-width: 64rem) {
  .wwd-split {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    gap: var(--space-gap);
    align-items: start;
  }

  .wwd-pin {
    position: sticky;
    top: 6.5rem;
  }

  .wwd-photo {
    position: relative;
    display: block;
    height: min(42vh, 26rem);
    margin-top: 1.5rem;
    overflow: hidden;
    border-radius: 5px;
    background: var(--color-forest-900);
  }

  .wwd-photo__img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 500ms ease;
  }

  .wwd-photo__img.is-on {
    opacity: 1;
  }

  /* The pinned photo carries the picture on desktop, so rows drop theirs. */
  .wwd-function__img {
    display: none;
  }

  .wwd-function {
    min-height: 8rem;
    align-content: center;
    padding-block: 1.25rem;
    opacity: 0.45;
    transition: opacity 300ms ease, border-color 300ms ease;
  }

  .wwd-function.is-active {
    border-top-color: var(--color-maize-400);
    opacity: 1;
  }

  .wwd-mission__lists {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 48rem) and (max-width: 63.999rem) {
  .wwd-mission__lists {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (prefers-reduced-motion: reduce) {
  .wwd-photo__img,
  .wwd-function {
    transition: none;
  }
}
</style>
