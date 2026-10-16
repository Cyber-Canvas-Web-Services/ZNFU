<script setup>
/** Design 2 — Home. A full-bleed rotating photo hero, then colour-blocked panels. */
import { onBeforeUnmount, onMounted, ref } from "vue";
import { ArrowRight } from "@lucide/vue";

import { hero, homeIntroduction, media, membership, news, stats, systems, whatWeDo } from "@/data/home";

const slide = ref(0);
let timer = null;
onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  timer = setInterval(() => (slide.value = (slide.value + 1) % media.heroSlides.length), 5000);
});
onBeforeUnmount(() => clearInterval(timer));

const fmt = (i) => `${i.prefix ?? ""}${i.value.toLocaleString("en-US")}${i.suffix ?? ""}`;
</script>

<template>
  <div class="v2">
    <section id="hero" class="v2-panel v2-panel--first v2-home-hero" aria-labelledby="v2-hero-h">
      <img
        v-for="(src, i) in media.heroSlides"
        :key="src"
        :src="src"
        alt=""
        class="v2-home-hero__img"
        :class="{ 'is-on': i === slide }"
        :fetchpriority="i === 0 ? 'high' : undefined"
      />
      <div class="v2-home-hero__shade" aria-hidden="true"></div>
      <div class="v2-home-hero__content">
        <h1 id="v2-hero-h" class="v2-h1">{{ hero.title }}</h1>
        <p class="v2-lede">{{ hero.tagline }}</p>
        <div class="v2-home-hero__actions">
          <a :href="hero.primaryCta.href" class="v2-btn v2-btn--maize">{{ hero.primaryCta.label }}</a>
          <a :href="hero.secondaryCta.href" class="v2-btn v2-btn--ghost">{{ hero.secondaryCta.label }}</a>
        </div>
      </div>
    </section>

    <section class="v2-panel" aria-labelledby="v2-do-h">
      <div class="v2-shell">
        <div class="v2-home-head">
          <div>
            <h2 id="v2-do-h" class="v2-h2">What we do</h2>
            <p class="v2-lede" style="margin-top: 0.6rem">{{ homeIntroduction.primary }}</p>
          </div>
          <div class="v2-home-hero__actions" style="margin-top: 0">
            <a href="/about" class="v2-btn v2-btn--forest">Explore the Union <ArrowRight class="h-4 w-4" aria-hidden="true" /></a>
            <a href="/what-we-do" class="v2-btn v2-btn--ghost">Our mission</a>
          </div>
        </div>
        <ul class="v2-home-do">
          <li v-for="item in whatWeDo.items" :key="item.title">
            <img class="v2-img" :src="item.image" :alt="item.imageAlt" width="800" height="600" loading="lazy" />
            <h3 class="v2-h3">{{ item.title }}</h3>
            <p class="v2-small">{{ item.body }}</p>
          </li>
        </ul>
      </div>
    </section>

    <section class="v2-panel v2-panel--forest" aria-labelledby="v2-sys-h">
      <div class="v2-shell v2-grid-2">
        <div>
          <h2 id="v2-sys-h" class="v2-h2">{{ systems.title }}</h2>
          <p class="v2-lede" style="margin: 1rem 0 1.25rem">{{ systems.lede }}</p>
          <a href="/systems" class="v2-btn v2-btn--maize">See the systems <ArrowRight class="h-4 w-4" aria-hidden="true" /></a>
        </div>
        <ul class="v2-rows">
          <li v-for="item in systems.items" :key="item.id">
            <a :href="`/systems#${item.id}`" class="v2-home-sys">
              <span class="v2-h3">{{ item.title }}</span>
              <ArrowRight class="h-5 w-5" aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>
    </section>

    <section class="v2-panel" aria-labelledby="v2-news-h">
      <div class="v2-shell">
        <div class="v2-home-head">
          <h2 id="v2-news-h" class="v2-h2">Latest news</h2>
          <a :href="news.allLink.href" class="v2-btn v2-btn--ghost">{{ news.allLink.label }}</a>
        </div>
        <div class="v2-home-news">
          <a :href="news.featured.href" class="v2-home-news__lead">
            <img class="v2-img" :src="news.featured.image" :alt="news.featured.imageAlt" width="1000" height="700" loading="lazy" />
            <span class="v2-chip">{{ news.featured.category }}</span>
            <span class="v2-h3">{{ news.featured.title }}</span>
          </a>
          <ul class="v2-rows">
            <li v-for="item in news.items" :key="item.title">
              <a :href="item.href" class="v2-home-news__row">
                <span class="v2-small">{{ item.category }} · {{ item.date }}</span>
                <span class="v2-h3">{{ item.title }}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section class="v2-panel v2-panel--leaf" aria-labelledby="v2-join-h">
      <div class="v2-shell">
        <h2 id="v2-join-h" class="v2-h2" style="max-width: 20ch">{{ membership.homeTitle }}</h2>
        <div class="v2-home-hero__actions" style="margin-top: 1.25rem">
          <a :href="membership.cta.href" class="v2-btn v2-btn--forest">{{ membership.cta.label }}</a>
          <a :href="membership.secondaryCta.href" class="v2-btn v2-btn--ghost">{{ membership.secondaryCta.label }}</a>
        </div>
        <dl class="v2-home-stats">
          <div v-for="item in stats.items" :key="item.label">
            <dd>{{ fmt(item) }}</dd>
            <dt>{{ item.label }}</dt>
          </div>
        </dl>
      </div>
    </section>
  </div>
</template>

<style scoped>
.v2-home-hero {
  position: relative;
  display: flex;
  min-height: min(78vh, 46rem);
  align-items: flex-end;
  overflow: hidden;
  background: var(--v2-forest-deep);
  color: #fff;
  isolation: isolate;
}
.v2-home-hero__img {
  position: absolute;
  z-index: -2;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 900ms ease;
}
.v2-home-hero__img.is-on { opacity: 1; }
.v2-home-hero__shade {
  position: absolute;
  z-index: -1;
  inset: 0;
  background: linear-gradient(180deg, rgb(6 37 26 / 0.15), rgb(6 37 26 / 0.85));
}
.v2-home-hero__content .v2-h1 { max-width: 12ch; }
.v2-home-hero__content .v2-lede { margin-top: 1rem; }
.v2-home-hero__actions { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-top: 1.4rem; }

.v2-home-do { display: grid; gap: 1.5rem; margin: 1.5rem 0 0; padding: 0; list-style: none; }
.v2-home-do img { aspect-ratio: 3 / 2; }
.v2-home-do h3 { margin-top: 0.8rem; }
.v2-home-do p { margin-top: 0.35rem; max-width: 24rem; }

.v2-home-sys { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding-block: 1.1rem; color: inherit; text-decoration: none; }
.v2-home-sys svg { color: var(--v2-maize); transition: transform 180ms ease; }
.v2-home-sys:hover svg { transform: translateX(5px); }

.v2-home-head { display: flex; flex-wrap: wrap; align-items: end; justify-content: space-between; gap: 1rem; }
.v2-home-news { display: grid; gap: 1.5rem; margin-top: 1.5rem; }
.v2-home-news__lead { display: grid; gap: 0.7rem; align-content: start; color: inherit; text-decoration: none; justify-items: start; }
.v2-home-news__lead img { aspect-ratio: 3 / 2; }
.v2-home-news__row { display: grid; gap: 0.3rem; padding-block: 1.1rem; color: inherit; text-decoration: none; }
.v2-home-news a:hover .v2-h3 { text-decoration: underline; text-underline-offset: 0.18em; }

.v2-home-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1.75rem 0 0; }
.v2-home-stats div { display: flex; flex-direction: column-reverse; padding: 1.1rem; border-radius: 20px; background: rgb(255 255 255 / 0.55); }
.v2-home-stats dd { margin: 0; font-size: clamp(2rem, 4vw, 3.6rem); font-weight: 650; letter-spacing: -0.045em; line-height: 1; font-variant-numeric: tabular-nums; }
.v2-home-stats dt { margin-top: 0.4rem; font-size: 0.9rem; }

@media (min-width: 48rem) {
  .v2-home-do { grid-template-columns: repeat(3, 1fr); }
  .v2-home-news { grid-template-columns: 1.15fr 1fr; gap: 2.5rem; }
  .v2-home-stats { grid-template-columns: repeat(4, 1fr); }
}
@media (prefers-reduced-motion: reduce) { .v2-home-hero__img { transition: none; } }
</style>
