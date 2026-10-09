<script setup>
/**
 * Newsroom — the standalone page at /news.
 *
 * The heading, category line, dates and the featured story all come from the
 * real `news` data in `src/data/home.js`, unchanged. Everything around them —
 * the six-story list, the article pages and the newsletter strip — is sample
 * content held in SAMPLE_CONTENT below.
 *
 * Each story’s full article is drawn per reader preference: the wide view
 * renders the paragraphs as separate `<p>` elements, the narrow view renders
 * them inside a single `<p>` with `<br>` between. The markup therefore differs
 * by layout while the visible text stays identical, and the narrow form avoids
 * any overflow rule.
 *
 * The three views (featured / all news / article) are plain component state —
 * no router, no extra pages and no packages.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { ArrowLeft, ArrowRight, Clock, Search } from "@lucide/vue";

import { news } from "@/data/home";

const CATEGORIES = ["All", "Policy", "Weather", "Markets", "Member affairs"];

/** True below the `lg` breakpoint — picks the narrow article rendering. */
const isNarrow = ref(false);
let breakpointQuery = null;

function readBreakpoint(event) {
  isNarrow.value = event.matches;
}

onMounted(() => {
  breakpointQuery = window.matchMedia("(max-width: 1023px)");
  isNarrow.value = breakpointQuery.matches;
  breakpointQuery.addEventListener("change", readBreakpoint);
});

onBeforeUnmount(() => {
  breakpointQuery?.removeEventListener("change", readBreakpoint);
});

/* =====================================================================
 *  SAMPLE CONTENT - replace before publishing
 * =====================================================================
 *
 *  Six sample stories written so the newsroom reads as a finished layout.
 *  Every story, summary and article paragraph below is placeholder copy:
 *  none of it is a statistic, a forecast, a quotation, a named person or an
 *  official position. Dates reuse the spacing and month already used by the
 *  site’s own sample headlines.
 *
 *  Where a real fact would be needed, the text says [TO CONFIRM] instead.
 * ===================================================================== */
const SAMPLE_CONTENT = [
  {
    slug: "input-costs",
    category: "Policy",
    date: "24 September 2026",
    title: "Union tables input-cost submission ahead of the national budget",
    summary:
      "A short summary of the submission and what it asks for on behalf of members. Sample copy — replace with the newsroom’s own text.",
    paragraphs: [
      "The Union has prepared a submission setting out members’ views on the cost of farm inputs, ahead of the national budget. Sample copy — replace with the newsroom’s own reporting.",
      "The submission draws on points raised by members and associations. [TO CONFIRM — the specific measures requested, and which body they were sent to.]",
      "The Union’s stated role is to promote and safeguard the interests of members, and to speak for agriculture with a single voice.",
      "Members who want to add to the Union’s position should contact the Secretariat.",
    ],
  },
  {
    slug: "fisp",
    category: "Member affairs",
    date: "18 September 2026",
    title: "FISP distribution: guidance for District Farmers’ Associations",
    summary:
      "What the guidance covers and who it is for. Sample copy — replace with the newsroom’s own text.",
    paragraphs: [
      "Guidance has been prepared for District Farmers’ Associations on distribution under the Farmer Input Support Programme. Sample copy — replace with the newsroom’s own reporting.",
      "It sets out the steps associations are asked to follow, and who to raise problems with. [TO CONFIRM — the exact steps and the responsible office.]",
      "Associations are the first office most members meet, and are the Union’s main route to smallholders and emerging farmers in a district.",
      "Questions from members should go to their association in the first instance.",
    ],
  },
  {
    slug: "planting-dates",
    category: "Weather",
    date: "15 September 2026",
    title: "Planning planting dates around the seasonal forecast",
    summary:
      "Why the timing of the first rains matters, and what to weigh up. Sample copy — replace with the newsroom’s own text.",
    paragraphs: [
      "The timing of the first rains shapes planting decisions across the season. Sample copy — replace with the newsroom’s own reporting.",
      "The Union’s guidance has always been to treat a forecast as one input among several. [TO CONFIRM — the Union’s current seasonal guidance.]",
      "District Farmers’ Associations pass seasonal information on to their members as it reaches them.",
      "Members should also take advice on variety choice and input timing for their own district.",
    ],
  },
  {
    slug: "market-prices",
    category: "Markets",
    date: "10 September 2026",
    title: "Reading the weekly price book: what the movers tell you",
    summary:
      "How to use the weekly figures when deciding where to sell. Sample copy — replace with the newsroom’s own text.",
    paragraphs: [
      "The Union gathers commodity prices from markets across Zambia each week. Sample copy — replace with the newsroom’s own reporting.",
      "Comparing markets shows where the week’s movers are, and where a load is worth more than it is locally. [TO CONFIRM — the current price book.]",
      "Paid-up members receive e-Farm Prices for a year as part of membership.",
      "Figures should be read alongside transport cost — a higher price is not always a better price once haulage is paid for.",
    ],
  },
  {
    slug: "transport-window",
    category: "Markets",
    date: "8 September 2026",
    title: "Booking haulage early in the harvest window",
    summary:
      "Why transport is the pinch point at harvest, and how to plan around it. Sample copy — replace with the newsroom’s own text.",
    paragraphs: [
      "Haulage is the tightest part of the harvest window: everybody needs trucks at the same time. Sample copy — replace with the newsroom’s own reporting.",
      "e-Transport matches members with hauliers and tracks a job from loading to delivery.",
      "Booking early, and knowing the tonnage and cargo type, makes matching easier. [TO CONFIRM — the booking process.]",
      "Members who cannot get a match should contact the Secretariat.",
    ],
  },
  {
    slug: "member-services",
    category: "Member affairs",
    date: "5 September 2026",
    title: "What membership includes: prices, transport and market access",
    summary:
      "A short summary of the services open to paid-up members. Sample copy — replace with the newsroom’s own text.",
    paragraphs: [
      "Membership is open to any person or organisation in the business of agriculture in Zambia. Sample copy — replace with the newsroom’s own reporting.",
      "Paid members receive one year of e-Farm Prices and e-Transport, with reminders before expiry.",
      "ZNFU Market listings are for paid-up sellers only, and a listing leaves the market the day membership lapses.",
      "The Secretariat can explain the categories and the annual subscription. [TO CONFIRM — the current fees.]",
    ],
  },
];

/** The three views this page can show. */
const view = ref("featured");
const activeCategory = ref("All");
const searchTerm = ref("");
const openStory = ref(null);

const containerEl = ref(null);

const visibleStories = computed(() => {
  const term = searchTerm.value.trim().toLowerCase();
  return SAMPLE_CONTENT.filter((story) => {
    const matchesCategory =
      activeCategory.value === "All" || story.category === activeCategory.value;
    const matchesTerm =
      !term ||
      story.title.toLowerCase().includes(term) ||
      story.summary.toLowerCase().includes(term) ||
      story.category.toLowerCase().includes(term);
    return matchesCategory && matchesTerm;
  });
});

const featuredStory = computed(
  () =>
    SAMPLE_CONTENT.find((story) => story.category === "Policy") ??
    SAMPLE_CONTENT[0],
);

/** Two other stories to offer at the foot of an article. */
const relatedStories = computed(() => {
  if (!openStory.value) return [];
  return SAMPLE_CONTENT.filter(
    (story) => story.slug !== openStory.value.slug,
  ).slice(0, 2);
});

function scrollToTop() {
  nextTick(() => {
    containerEl.value?.scrollIntoView({ block: "start" });
  });
}

function showAllNews() {
  view.value = "all";
  scrollToTop();
}

function showFeatured() {
  view.value = "featured";
  openStory.value = null;
  activeCategory.value = "All";
  searchTerm.value = "";
  scrollToTop();
}

function openArticle(story) {
  openStory.value = story;
  view.value = "article";
  scrollToTop();
}

function closeArticle() {
  openStory.value = null;
  view.value = "all";
  scrollToTop();
}

function showRelated(story) {
  openArticle(story);
}

const newsletterEmail = ref("");
const newsletterSent = ref(false);

function subscribe() {
  if (!newsletterEmail.value) return;
  newsletterSent.value = true;
  newsletterEmail.value = "";
}
</script>

<template>
  <div ref="containerEl" id="news" class="news-page-root">
    <!-- ===================== View 1 — featured story ===================== -->
    <section
      v-if="view === 'featured'"
      class="news-page-band news-page-band--dark"
    >
      <div class="news-page-band__inner">
        <p class="news-page-eyebrow" v-reveal>{{ news.eyebrow }}</p>
        <h1 class="news-page-title" v-reveal="{ delay: 60 }">
          {{ news.title }}
        </h1>

        <header class="news-page-head">
          <div class="news-page-actions" v-reveal="{ delay: 120 }">
            <button type="button" class="btn btn--maize" @click="showAllNews">
              All news
              <ArrowRight class="news-page-icon" aria-hidden="true" />
            </button>
          </div>
        </header>

        <article class="news-page-feature" v-reveal="{ delay: 160 }">
          <div class="news-page-feature__row">
            <div class="news-page-feature__media">
              <img
                :src="news.featured.image"
                :alt="news.featured.imageAlt"
                class="news-page-feature__image"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div class="news-page-feature__text">
              <p class="news-page-tag">{{ news.featured.category }}</p>
              <p class="news-page-date">
                <Clock class="news-page-icon" aria-hidden="true" />
                {{ news.featured.date }}
              </p>
              <h2 class="news-page-feature__headline">
                {{ news.featured.title }}
              </h2>
              <p class="news-page-body">{{ news.featured.excerpt }}</p>

              <button
                type="button"
                class="btn btn--forest news-page-feature__cta"
                @click="openArticle(featuredStory)"
              >
                Read full story
                <ArrowRight class="news-page-icon" aria-hidden="true" />
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- ===================== View 2 — all news ===================== -->
    <section
      v-else-if="view === 'all'"
      class="news-page-band news-page-band--dark"
    >
      <div class="news-page-band__inner">
        <header class="news-page-head">
          <div>
            <p class="news-page-eyebrow">{{ news.eyebrow }}</p>
            <h1 class="news-page-title news-page-title--compact">All news</h1>
          </div>
          <button
            type="button"
            class="btn btn--ghost"
            @click="showFeatured"
          >
            Back to featured
          </button>
        </header>

        <!-- Filter and search -->
        <div class="news-page-tools">
          <div
            class="news-page-filters"
            role="group"
            aria-label="Filter stories by category"
          >
            <button
              v-for="category in CATEGORIES"
              :key="category"
              type="button"
              class="news-page-filter"
              :class="{
                'news-page-filter--active': activeCategory === category,
              }"
              :aria-pressed="activeCategory === category ? 'true' : 'false'"
              @click="activeCategory = category"
            >
              {{ category }}
            </button>
          </div>

          <label class="news-page-search">
            <Search class="news-page-icon" aria-hidden="true" />
            <input
              v-model="searchTerm"
              type="search"
              class="news-page-search__input"
              placeholder="Search stories"
              aria-label="Search stories"
            />
          </label>
        </div>

        <!-- Ledger list — rules and a category rail, not cards -->
        <ul v-if="visibleStories.length" class="news-page-ledger">
          <li
            v-for="(story, index) in visibleStories"
            :key="story.slug"
            class="news-page-ledger__item"
            v-reveal="{ delay: Math.min(index, 5) * 60 }"
          >
            <div class="news-page-ledger__rail">
              <p class="news-page-tag news-page-tag--ledger">
                {{ story.category }}
              </p>
              <p class="news-page-date">{{ story.date }}</p>
            </div>

            <div class="news-page-ledger__main">
              <h2 class="news-page-ledger__headline">{{ story.title }}</h2>
              <p class="news-page-ledger__summary">{{ story.summary }}</p>
              <button
                type="button"
                class="news-page-readmore"
                @click="openArticle(story)"
              >
                Read full story
                <ArrowRight class="news-page-icon" aria-hidden="true" />
              </button>
            </div>
          </li>
        </ul>

        <p v-else class="news-page-empty">
          No stories match that filter yet. [TO CONFIRM — more sample stories.]
        </p>
      </div>
    </section>

    <!-- ===================== View 3 — one article ===================== -->
    <section v-else class="news-page-band news-page-band--dark">
      <div class="news-page-band__inner">
        <button type="button" class="news-page-back" @click="closeArticle">
          <ArrowLeft class="news-page-icon" aria-hidden="true" />
          Back to all news
        </button>

        <article v-if="openStory" class="news-page-article">
          <p class="news-page-tag">{{ openStory.category }}</p>
          <p class="news-page-date">
            <Clock class="news-page-icon" aria-hidden="true" />
            {{ openStory.date }}
          </p>
          <h1 class="news-page-article__headline">{{ openStory.title }}</h1>

          <!-- Wide: one element per paragraph. -->
          <div v-if="!isNarrow" class="news-page-article__body">
            <p
              v-for="(paragraph, index) in openStory.paragraphs"
              :key="index"
              class="news-page-article__paragraph"
            >
              {{ paragraph }}
            </p>
          </div>

          <!-- Narrow: one element, so no overflow rule is needed. -->
          <p v-else class="news-page-article__paragraph">
            <template
              v-for="(paragraph, index) in openStory.paragraphs"
              :key="index"
            >
              <br v-if="index > 0" />
              {{ paragraph }}
            </template>
          </p>

          <div class="news-page-related">
            <h2 class="news-page-related__heading">Related stories</h2>
            <ul class="news-page-related__list">
              <li v-for="story in relatedStories" :key="story.slug">
                <button
                  type="button"
                  class="news-page-related__link"
                  @click="showRelated(story)"
                >
                  <span class="news-page-related__category">{{
                    story.category
                  }}</span>
                  <span class="news-page-related__title">{{
                    story.title
                  }}</span>
                  <ArrowRight class="news-page-icon" aria-hidden="true" />
                </button>
              </li>
            </ul>
          </div>
        </article>
      </div>
    </section>

    <!-- ===================== Newsletter strip ===================== -->
    <section class="news-page-band news-page-band--strip">
      <div class="news-page-band__inner">
        <div class="news-page-newsletter">
          <div>
            <p class="news-page-newsletter__title">Stay informed</p>
            <p class="news-page-newsletter__body">
              {{ news.fridayBrief.body }}
            </p>
          </div>

          <form class="news-page-newsletter__form" @submit.prevent="subscribe">
            <input
              v-model="newsletterEmail"
              type="email"
              class="field field--on-light"
              placeholder="you@farm.co.zm"
              aria-label="Email address"
              required
            />
            <button type="submit" class="btn btn--maize">
              {{ news.fridayBrief.cta }}
            </button>
          </form>

          <p
            v-if="newsletterSent"
            class="news-page-newsletter__thanks"
            role="status"
          >
            Thank you — this is a preview, so nothing was sent.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/**
 * The newsroom uses a ledger, not cards: hairline rules, a category rail and
 * a serif-free editorial rhythm, so it reads differently from the card grids
 * on About, Systems and Membership.
 *
 * The two panels this page replaces were `position: sticky` at desktop widths
 * — but note those panels are gone now; this page draws its own bands. The
 * bands still carry their own stacking level so they behave identically to the
 * other pages if a pinned panel is ever put back above them, and an opaque
 * background so nothing shows through the text.
 *
 * `position` and `z-index` are confined to `.news-page-band`. Every band is
 * laid out with padding, borders, grid and type alone — no height, no overflow
 * and no transform — so no section can be clipped.
 */
/* The root keeps a real box so the skip link’s `#news` target stays a
   scrollable, focusable landmark. */
.news-page-root {
  background-color: var(--color-cream-50);
}

.news-page-band {
  position: relative;
  z-index: 1;
  background-color: var(--color-cream-50);
  padding-top: 4rem;
  padding-bottom: 4rem;
}

.news-page-band--dark {
  background-color: var(--color-forest-950);
}

.news-page-band--strip {
  background-color: var(--color-cream-100);
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.news-page-band__inner {
  margin-left: auto;
  margin-right: auto;
  max-width: 72rem;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}

@media (min-width: 40rem) {
  .news-page-band__inner {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

@media (min-width: 64rem) {
  .news-page-band {
    padding-top: 5.5rem;
    padding-bottom: 5.5rem;
  }
}

/* ---- Shared type ---- */
.news-page-eyebrow {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--color-maize-400);
}

.news-page-title {
  margin-top: 1rem;
  font-family: var(--font-display);
  font-size: var(--text-display);
  font-weight: 500;
  line-height: 1.06;
  letter-spacing: -0.03em;
  color: var(--color-cream-50);
}

.news-page-title--compact {
  font-size: var(--text-display-sm);
}

.news-page-tag {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-maize-400);
}

.news-page-tag--ledger {
  color: var(--color-forest-600);
}

.news-page-date {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.5rem;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: color-mix(in oklab, var(--color-cream-200) 60%, transparent);
}

.news-page-body {
  margin-top: 1rem;
  max-width: 40rem;
  font-size: 1rem;
  line-height: 1.75;
  color: color-mix(in oklab, var(--color-cream-200) 78%, transparent);
}

.news-page-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}


/* ---- Header row ---- */
.news-page-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
  margin-top: 2.5rem;
}

.news-page-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

/* Outline button readable on the dark band is now the shared `.btn--ghost`,
   so the page no longer needs its own variant. */

/* ---- Featured ---- */
.news-page-feature {
  margin-top: 2.5rem;
  border-top: 1px solid
    color-mix(in oklab, var(--color-cream-200) 22%, transparent);
  padding-top: 2.5rem;
}

.news-page-feature__row {
  display: grid;
  gap: 2rem;
}

@media (min-width: 64rem) {
  .news-page-feature__row {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 3.5rem;
    align-items: center;
  }
}

.news-page-feature__image {
  width: 100%;
  /* 5px, matching every other card on the site. */
  border-radius: 5px;
  object-fit: cover;
  aspect-ratio: 16 / 10;
}

.news-page-feature__headline {
  margin-top: 1rem;
  font-family: var(--font-display);
  font-size: var(--text-display);
  font-weight: 500;
  line-height: 1.15;
  letter-spacing: -0.03em;
  color: var(--color-cream-50);
}

.news-page-feature__cta {
  margin-top: 1.75rem;
}

/* ---- Filter and search ---- */
.news-page-tools {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  margin-top: 2.5rem;
  border-top: 1px solid
    color-mix(in oklab, var(--color-cream-200) 22%, transparent);
  border-bottom: 1px solid
    color-mix(in oklab, var(--color-cream-200) 22%, transparent);
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
}

.news-page-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.news-page-filter {
  border-color: color-mix(in oklab, var(--color-cream-200) 30%, transparent);
  font-weight: 600;
  color: color-mix(in oklab, var(--color-cream-200) 75%, transparent);
  cursor: pointer;
  transition:
    background-color 0.25s ease,
    color 0.25s ease,
    border-color 0.25s ease;
}

.news-page-filter:hover {
  background-color: rgb(255 255 255 / 0.08);
  color: var(--color-cream-50);
}

.news-page-filter--active,
.news-page-filter--active:hover {
  background-color: var(--color-maize-400);
  border-color: var(--color-maize-400);
  color: var(--color-forest-950);
}

.news-page-search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-color: color-mix(in oklab, var(--color-cream-200) 30%, transparent);
  color: color-mix(in oklab, var(--color-cream-200) 70%, transparent);
}

/* The container above is the field: it owns the pill, the border and the
   padding. The input inside it is just the text slot. */
.news-page-search__input {
  width: 11rem;
  border: 0;
  padding: 0;
  min-height: 0;
  background-color: transparent;
  font-size: inherit;
  color: var(--color-cream-50);
}

.news-page-search__input:focus {
  outline: none;
}

.news-page-search__input::placeholder {
  color: color-mix(in oklab, var(--color-cream-200) 45%, transparent);
}

/* ---- Ledger list ---- */
.news-page-ledger {
  margin-top: 0.5rem;
  padding: 0;
  list-style: none;
}

.news-page-ledger__item {
  display: grid;
  gap: 0.75rem;
  border-bottom: 1px solid
    color-mix(in oklab, var(--color-cream-200) 16%, transparent);
  padding-top: 2rem;
  padding-bottom: 2rem;
}

@media (min-width: 48rem) {
  .news-page-ledger__item {
    grid-template-columns: 12rem minmax(0, 1fr);
    gap: 2.5rem;
  }
}

.news-page-ledger__rail {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.news-page-ledger__headline {
  font-family: var(--font-display);
  font-size: var(--text-display-sm);
  font-weight: 500;
  line-height: 1.25;
  letter-spacing: -0.025em;
  color: var(--color-cream-50);
}

.news-page-ledger__summary {
  margin-top: 0.7rem;
  max-width: 44rem;
  font-size: 0.95rem;
  line-height: 1.7;
  color: color-mix(in oklab, var(--color-cream-200) 68%, transparent);
}

.news-page-readmore {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.1rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-maize-400);
  cursor: pointer;
  transition: gap 0.25s ease;
}

.news-page-readmore:hover {
  gap: 0.75rem;
}

.news-page-empty {
  margin-top: 2.5rem;
  font-size: 0.95rem;
  line-height: 1.7;
  color: color-mix(in oklab, var(--color-cream-200) 60%, transparent);
}

/* ---- Article ---- */
.news-page-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-maize-400);
  cursor: pointer;
}

.news-page-article {
  margin-top: 2.5rem;
  border-top: 1px solid
    color-mix(in oklab, var(--color-cream-200) 22%, transparent);
  padding-top: 2.5rem;
}

.news-page-article__headline {
  margin-top: 1rem;
  max-width: 46rem;
  font-family: var(--font-display);
  font-size: var(--text-display);
  font-weight: 500;
  line-height: 1.12;
  letter-spacing: -0.03em;
  color: var(--color-cream-50);
}

.news-page-article__paragraph {
  margin-top: 1.35rem;
  max-width: 44rem;
  font-size: 1.02rem;
  line-height: 1.8;
  color: color-mix(in oklab, var(--color-cream-200) 78%, transparent);
}

.news-page-related {
  margin-top: 3rem;
  border-top: 1px solid
    color-mix(in oklab, var(--color-cream-200) 22%, transparent);
  padding-top: 2rem;
}

.news-page-related__heading {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--color-cream-50);
}

.news-page-related__list {
  display: grid;
  gap: 1rem;
  margin-top: 1.25rem;
  padding: 0;
  list-style: none;
}

@media (min-width: 48rem) {
  .news-page-related__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.news-page-related__link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  width: 100%;
  border: 1px solid color-mix(in oklab, var(--color-cream-200) 20%, transparent);
  /* 5px, matching every other card on the site. */
  border-radius: 5px;
  padding: 1.1rem 1.25rem;
  text-align: left;
  cursor: pointer;
  transition:
    background-color 0.25s ease,
    border-color 0.25s ease;
}

.news-page-related__link:hover {
  background-color: rgb(255 255 255 / 0.06);
  border-color: color-mix(in oklab, var(--color-maize-400) 45%, transparent);
}

.news-page-related__category {
  display: block;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-maize-400);
}

.news-page-related__title {
  display: block;
  margin-top: 0.4rem;
  font-family: var(--font-display);
  font-size: 0.98rem;
  font-weight: 500;
  line-height: 1.35;
  letter-spacing: -0.02em;
  color: var(--color-cream-50);
}

/* ---- Newsletter strip ---- */
.news-page-newsletter {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.news-page-newsletter__title {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--color-forest-950);
}

.news-page-newsletter__body {
  margin-top: 0.5rem;
  max-width: 34rem;
  font-size: 0.92rem;
  line-height: 1.65;
  color: color-mix(in oklab, var(--color-ink-900) 65%, transparent);
}

.news-page-newsletter__form {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.news-page-newsletter__thanks {
  width: 100%;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--color-forest-700);
}
</style>
