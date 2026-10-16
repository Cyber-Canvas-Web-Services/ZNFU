<script setup>
/**
 * The home page at “/”.
 *
 * The hero is the ported Farm-Marketplace slider and is untouched. Everything
 * beneath it is one continuous read, each block doing one job and handing the
 * visitor to the page that goes deeper:
 *
 *   1. what it does (with a one-line introduction) → What we do / About
 *   2. the systems members use → Systems
 *   3. what is new             → News
 *   4. how to join             → Membership
 *
 * All copy is read from the shared data in src/data/home.js. The four figures
 * in the membership band are still PLACEHOLDERS awaiting Secretariat sign-off
 * (see `stats` there) — do not present them as verified.
 */
import { ArrowRight } from "@lucide/vue";

import HeroSection from "@/components/sections/HeroSection.vue";
import {
  homeIntroduction,
  membership,
  news,
  stats,
  systems,
  whatWeDo,
} from "@/data/home";

const formatStat = (item) =>
  `${item.prefix ?? ""}${item.value.toLocaleString("en-US")}${item.suffix ?? ""}`;

</script>

<template>
  <HeroSection />

  <div class="home">
    <!-- 1 — What we do, with the one-line introduction to the Union -->
    <section class="home-do" aria-labelledby="home-do-heading">
      <div class="home-shell">
        <div class="home-head">
          <div>
            <h2 id="home-do-heading" class="home-heading">What we do</h2>
            <p class="home-do__lede">{{ homeIntroduction.primary }}</p>
          </div>
          <div class="home-head__links">
            <a href="/about" class="home-link">
              Explore the Union
              <ArrowRight class="h-4 w-4" aria-hidden="true" />
            </a>
            <a href="/what-we-do" class="home-link">
              Our mission
              <ArrowRight class="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <ul class="home-do__list">
          <li v-for="item in whatWeDo.items" :key="item.title">
            <img
              :src="item.image"
              :alt="item.imageAlt"
              width="800"
              height="600"
              loading="lazy"
              decoding="async"
            />
            <h3>{{ item.title }}</h3>
            <p>{{ item.body }}</p>
          </li>
        </ul>
      </div>
    </section>

    <!-- 3 — Systems -->
    <section class="home-systems" aria-labelledby="home-systems-heading">
      <div class="home-shell home-systems__grid">
        <div>
          <h2 id="home-systems-heading" class="home-heading home-heading--light">
            {{ systems.title }}
          </h2>
          <p class="home-systems__lede">{{ systems.lede }}</p>
          <a href="/systems" class="home-link home-link--light">
            See the systems
            <ArrowRight class="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <ul class="home-systems__list">
          <li v-for="item in systems.items" :key="item.id">
            <a :href="`/systems#${item.id}`">
              <span class="home-systems__name">{{ item.title }}</span>
              <span class="home-systems__body">{{ item.features[0] }}</span>
              <ArrowRight class="home-systems__arrow" aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>
    </section>

    <!-- 4 — News -->
    <section id="latest-updates" class="home-news" aria-labelledby="home-news-heading">
      <div class="home-shell">
        <div class="home-head">
          <h2 id="home-news-heading" class="home-heading">{{ news.homeTitle }}</h2>
          <a :href="news.allLink.href" class="home-link">
            {{ news.allLink.label }}
            <ArrowRight class="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <div class="home-news__grid">
          <a :href="news.featured.href" class="home-news__lead">
            <img
              :src="news.featured.image"
              :alt="news.featured.imageAlt"
              width="1000"
              height="700"
              loading="lazy"
              decoding="async"
            />
            <span class="home-meta">
              <span class="home-meta__category">{{ news.featured.category }}</span>
              {{ news.featured.date }}
            </span>
            <span class="home-news__headline">{{ news.featured.title }}</span>
          </a>

          <ul class="home-news__list">
            <li v-for="item in news.items" :key="item.title">
              <a :href="item.href">
                <span class="home-meta">
                  <span class="home-meta__category">{{ item.category }}</span>
                  {{ item.date }}
                </span>
                <span class="home-news__item-title">{{ item.title }}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 5 — Membership, with the numbers -->
    <section class="home-join" aria-labelledby="home-join-heading">
      <div class="home-shell">
        <h2 id="home-join-heading" class="home-join__title">
          {{ membership.homeTitle }}
        </h2>
        <div class="home-join__row">
          <p>{{ membership.homeLede }}</p>
          <div class="home-join__actions">
            <a :href="membership.cta.href" class="home-btn home-btn--solid">
              {{ membership.cta.label }}
            </a>
            <a :href="membership.secondaryCta.href" class="home-btn home-btn--line">
              {{ membership.secondaryCta.label }}
            </a>
          </div>
        </div>

        <dl class="home-join__stats">
          <div v-for="item in stats.items" :key="item.label">
            <dd>{{ formatStat(item) }}</dd>
            <dt>{{ item.label }}</dt>
          </div>
        </dl>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  position: relative;
  z-index: 1;
  overflow: clip;
  background: var(--color-cream-50);
  color: var(--color-forest-950);
}

.home-shell {
  width: 100%;
  max-width: var(--shell-max);
  margin-inline: auto;
  padding-inline: var(--shell-pad);
}

.home-heading {
  font-family: var(--font-display);
  font-size: var(--section-title);
  font-weight: 500;
  letter-spacing: -0.035em;
  line-height: 1.02;
  text-wrap: balance;
}

.home-heading--light {
  color: var(--color-cream-50);
}

.home-head {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: 0.75rem 2rem;
}

.home-link {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 650;
  text-decoration: underline;
  text-underline-offset: 0.3em;
}

.home-link--light {
  color: var(--color-maize-400);
}

.home-link:focus-visible,
.home-systems__list a:focus-visible,
.home-news a:focus-visible,
.home-btn:focus-visible {
  outline: 3px solid var(--color-forest-600);
  outline-offset: 3px;
}

.home-systems a:focus-visible,
.home-join .home-btn:focus-visible {
  outline-color: var(--color-maize-400);
}

.home-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem 0.8rem;
  color: rgb(19 24 19 / 0.6);
  font-size: 0.85rem;
}

.home-meta__category {
  color: var(--color-forest-600);
  font-weight: 650;
}

/* ---- 2: what we do ---- */
.home-do {
  padding-block: var(--space-section);
}

.home-do__lede {
  max-width: var(--page-lede-measure);
  margin-top: 0.6rem;
  color: rgb(19 24 19 / 0.72);
  font-size: var(--page-lede);
  line-height: var(--page-lede-leading);
}

.home-head__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.75rem;
}

.home-do__list {
  display: grid;
  gap: 1.75rem;
  margin: clamp(1.25rem, 2.5vw, 2rem) 0 0;
  padding: 0;
  list-style: none;
}

.home-do__list img {
  width: 100%;
  aspect-ratio: 3 / 2;
  border-radius: 5px;
  object-fit: cover;
}

.home-do__list h3 {
  margin-top: 0.9rem;
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 2vw, 1.8rem);
  font-weight: 500;
  letter-spacing: -0.02em;
}

.home-do__list p {
  max-width: 24rem;
  margin-top: 0.4rem;
  color: rgb(19 24 19 / 0.7);
  line-height: 1.6;
}

/* ---- 3: systems ---- */
.home-systems {
  padding-block: var(--space-section);
  background: var(--color-forest-950);
  color: var(--color-cream-50);
}

.home-systems__grid {
  display: grid;
  gap: 1.5rem;
  align-items: center;
}

.home-systems__lede {
  max-width: 26rem;
  margin: 0.9rem 0 1.1rem;
  color: rgb(251 249 243 / 0.72);
  line-height: 1.65;
}

.home-systems__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.home-systems__list a {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.3rem 1rem;
  padding-block: 1.15rem;
  border-top: 1px solid rgb(251 249 243 / 0.25);
  color: inherit;
  text-decoration: none;
}

.home-systems__list li:last-child a {
  border-bottom: 1px solid rgb(251 249 243 / 0.25);
}

.home-systems__name {
  font-family: var(--font-display);
  font-size: clamp(1.3rem, 1.8vw, 1.6rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

.home-systems__body {
  grid-column: 1;
  color: rgb(251 249 243 / 0.7);
  font-size: var(--page-lede);
  line-height: 1.5;
}

.home-systems__arrow {
  grid-row: 1 / span 2;
  grid-column: 2;
  align-self: center;
  width: 1.4rem;
  height: 1.4rem;
  color: var(--color-maize-400);
  transition: transform 180ms ease;
}

.home-systems__list a:hover .home-systems__arrow {
  transform: translateX(5px);
}

/* ---- 4: news ---- */
.home-news {
  padding-block: var(--space-section);
}

.home-news__grid {
  display: grid;
  gap: 1.5rem;
  margin-top: clamp(1.25rem, 2.5vw, 2rem);
}

.home-news__lead {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  color: inherit;
  text-decoration: none;
}

.home-news__lead img {
  width: 100%;
  aspect-ratio: 3 / 2;
  border-radius: 5px;
  object-fit: cover;
}

.home-news__headline {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 2.6vw, 2.3rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.08;
  text-wrap: balance;
}

.home-news__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.home-news__list a {
  display: grid;
  gap: 0.3rem;
  padding-block: 1.1rem;
  border-top: 1px solid rgb(4 32 21 / 0.2);
  color: inherit;
  text-decoration: none;
}

.home-news__list li:last-child a {
  border-bottom: 1px solid rgb(4 32 21 / 0.2);
}

.home-news__item-title {
  font-family: var(--font-display);
  font-size: clamp(1.15rem, 1.7vw, 1.45rem);
  font-weight: 500;
  letter-spacing: -0.015em;
  line-height: 1.2;
}

.home-news a:hover .home-news__headline,
.home-news a:hover .home-news__item-title {
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

/* ---- 5: membership + numbers ---- */
.home-join {
  padding-block: var(--space-section);
  background: #f5c62a;
}

.home-join__title {
  max-width: 20ch;
  font-family: var(--font-display);
  font-size: var(--section-title);
  font-weight: 500;
  letter-spacing: -0.04em;
  line-height: 1;
  text-wrap: balance;
}

.home-join__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem 2rem;
  margin-top: 1.25rem;
}

.home-join__row p {
  max-width: 32rem;
  line-height: 1.6;
}

.home-join__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.home-btn {
  display: inline-flex;
  align-items: center;
  min-height: 3rem;
  padding-inline: 1.4rem;
  border-radius: 9999px;
  font-size: 0.9rem;
  font-weight: 650;
  text-decoration: none;
  transition: background-color 180ms ease, color 180ms ease;
}

.home-btn--solid {
  background: var(--color-forest-950);
  color: #fff;
}

.home-btn--solid:hover {
  background: var(--color-forest-700);
}

.home-btn--line {
  border: 1px solid rgb(4 32 21 / 0.5);
}

.home-btn--line:hover {
  background: rgb(4 32 21 / 0.1);
}

.home-join__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 1rem;
  margin: clamp(1.5rem, 3vw, 2.5rem) 0 0;
}

.home-join__stats div {
  display: flex;
  flex-direction: column-reverse;
  padding-block: 1rem;
  border-top: 1px solid rgb(4 32 21 / 0.4);
}

.home-join__stats dd {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 4.6vw, 4.2rem);
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.04em;
  line-height: 1;
}

.home-join__stats dt {
  margin-top: 0.4rem;
  color: rgb(4 32 21 / 0.82);
  font-size: 0.92rem;
  line-height: 1.35;
}

@media (min-width: 48rem) {
  .home-do__list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: clamp(1.25rem, 3vw, 2.5rem);
  }

  /* The lead photo takes whatever height the story list beside it needs, so
     neither column leaves empty space under the other. */
  .home-news__lead img {
    flex: 1 1 0;
    min-height: 14rem;
    aspect-ratio: auto;
    contain: size;
  }

  .home-news__grid {
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    gap: var(--space-gap);
  }

  .home-join__stats {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0 1.5rem;
  }
}

@media (min-width: 64rem) {
  .home-systems__grid {
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
    gap: var(--space-gap);
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-systems__arrow {
    transition: none;
  }
}
</style>
