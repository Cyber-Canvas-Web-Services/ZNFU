<script setup>
/**
 * What we do — the standalone page at /what-we-do.
 *
 * Deliberately compact: the page fits on about a screen and a half. The left
 * column carries the title, the introduction and the Union's three functions;
 * the right column is one photograph that takes the left column's height, with
 * the mission laid over its foot. Beneath, a single band lists who the Union
 * represents and what it works to achieve.
 *
 * Copy is confirmed-only (see docs/what-we-do-page.md): every phrase comes
 * from the mission statement or the Union's published description.
 */
import AppIcon from "@/components/ui/AppIcon.vue";
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
    icon: "Scale",
    title: "Lobbying and advocacy",
    body: "We use the Union’s voice to promote and safeguard the interest of our members.",
  },
  {
    icon: "Users",
    title: "Member services",
    body: "We provide services that support our members directly.",
  },
  {
    icon: "Newspaper",
    title: "Information",
    body: "We gather and share information for members in the business of agriculture.",
  },
];
</script>

<template>
  <div class="wwd">
    <section id="what-we-do" class="wwd-main" aria-labelledby="wwd-heading">
      <div class="wwd-shell wwd-main__grid">
        <div class="wwd-text">
          <h1 id="wwd-heading" class="wwd-title" v-reveal>What we do</h1>
          <p class="wwd-intro" v-reveal="{ delay: 80 }">
            The Zambia National Farmers’ Union is a member-led, non-political
            union. Founded in 1905 and based in Lusaka, we promote and
            safeguard the interest of our members in the business of
            agriculture.
          </p>

          <ul class="wwd-functions" aria-label="Core functions">
            <li v-for="item in functions" :key="item.title">
              <span class="wwd-functions__icon" aria-hidden="true">
                <AppIcon :name="item.icon" class="h-5 w-5" />
              </span>
              <div>
                <h2>{{ item.title }}</h2>
                <p>{{ item.body }}</p>
              </div>
            </li>
          </ul>
        </div>

        <figure class="wwd-photo">
          <img
            :src="media.growerMaizeField"
            alt="A farmer walking through tall maize"
            fetchpriority="high"
            decoding="async"
          />
          <figcaption class="wwd-mission">
            <h2>Our mission</h2>
            <blockquote>{{ whatWeDo.lede }}</blockquote>
          </figcaption>
        </figure>
      </div>
    </section>

    <section class="wwd-band" aria-label="Who we represent and what we work to achieve">
      <div class="wwd-shell wwd-band__grid">
        <div>
          <h2>Who we represent</h2>
          <ul>
            <li v-for="member in members" :key="member">{{ member }}</li>
          </ul>
        </div>
        <div>
          <h2>What we work to achieve</h2>
          <ul>
            <li v-for="aim in aims" :key="aim">{{ aim }}</li>
          </ul>
        </div>
      </div>
    </section>
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

/* ---- Main: text beside one photograph ---- */
.wwd-main {
  padding-block: clamp(5.5rem, 6.5vw, 6.25rem) var(--space-section);
}

.wwd-main__grid {
  display: grid;
  gap: var(--space-gap);
}

.wwd-title {
  font-family: var(--font-display);
  font-size: var(--page-title);
  font-weight: 500;
  letter-spacing: var(--page-title-tracking);
  line-height: var(--page-title-leading);
}

.wwd-intro {
  max-width: var(--page-lede-measure);
  margin-top: 1rem;
  color: rgb(19 24 19 / 0.74);
  font-size: var(--page-lede);
  line-height: var(--page-lede-leading);
}

.wwd-functions {
  display: grid;
  margin: 1.5rem 0 0;
  padding: 0;
  list-style: none;
}

.wwd-functions li {
  display: grid;
  grid-template-columns: 2.75rem minmax(0, 1fr);
  gap: 1rem;
  padding-block: 1rem;
  border-top: 1px solid rgb(4 32 21 / 0.2);
}

.wwd-functions li:last-child {
  border-bottom: 1px solid rgb(4 32 21 / 0.2);
}

.wwd-functions__icon {
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  place-items: center;
  border-radius: 50%;
  background: var(--color-maize-400);
  color: var(--color-forest-950);
}

.wwd-functions h2 {
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 1.6vw, 1.4rem);
  font-weight: 500;
  letter-spacing: -0.015em;
  line-height: 1.2;
}

.wwd-functions p {
  max-width: 30rem;
  margin-top: 0.25rem;
  color: rgb(19 24 19 / 0.7);
  font-size: var(--page-lede);
  line-height: var(--page-lede-leading);
}

/* ---- Photograph with the mission on it ---- */
.wwd-photo {
  position: relative;
  min-height: 28rem;
  margin: 0;
  overflow: hidden;
  border-radius: 5px;
  background: var(--color-forest-900);
}

.wwd-photo img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 25%;
}

.wwd-mission {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  left: 1rem;
  padding: clamp(1rem, 2vw, 1.5rem);
  border-radius: 5px;
  background: rgb(6 37 26 / 0.92);
  color: var(--color-cream-50);
}

.wwd-mission h2 {
  color: var(--color-maize-400);
  font-size: 0.95rem;
  font-weight: 600;
}

.wwd-mission blockquote {
  margin: 0.5rem 0 0;
  font-family: var(--font-display);
  font-size: clamp(1.05rem, 1.35vw, 1.25rem);
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.4;
}

/* ---- Band: who and what for ---- */
.wwd-band {
  padding-block: var(--space-section);
  background: var(--color-maize-400);
}

.wwd-band__grid {
  display: grid;
  gap: 1.25rem var(--space-gap);
}

.wwd-band h2 {
  font-size: 0.95rem;
  font-weight: 650;
}

.wwd-band ul {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin: 0.6rem 0 0;
  padding: 0;
  list-style: none;
}

.wwd-band li {
  padding: 0.45rem 1rem;
  border-radius: 9999px;
  background: rgb(4 32 21 / 0.12);
  font-size: 0.95rem;
  font-weight: 560;
}

.wwd-band__grid > div:last-child li {
  background: var(--color-forest-950);
  color: #fff;
}

@media (min-width: 64rem) {
  .wwd-main__grid {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  }

  /* The photo takes the text column's height, so neither side leaves a gap. */
  .wwd-photo {
    align-self: stretch;
    height: 100%;
    min-height: 0;
    contain: size;
  }

  .wwd-band__grid {
    grid-template-columns: 1.3fr 1fr;
  }
}
</style>
