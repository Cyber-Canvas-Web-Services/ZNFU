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
import { ArrowLeft, ArrowRight, Search } from "@lucide/vue";

import { media, news } from "@/data/home";


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

import { CATEGORIES, SAMPLE_CONTENT } from "@/data/newsSample";

/** Two views: the front page with its list, and one article. */
/** A photograph for each story, chosen by its category (the sample stories
 *  carry no image of their own). */
const CATEGORY_PHOTOS = {
  Policy: media.fieldMaizeDemoDay,
  "Member affairs": media.fieldSoybeanTeam,
  Weather: media.gardenSunsetIrrigation,
  Markets: media.producePeppersBaskets,
};
const photoFor = (story) => CATEGORY_PHOTOS[story.category] ?? media.growerMaizeField;

const view = ref("list");
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

function openArticle(story) {
  openStory.value = story;
  view.value = "article";
  scrollToTop();
}

function closeArticle() {
  openStory.value = null;
  view.value = "list";
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
  <div ref="containerEl" id="news" class="np">
    <!-- ================= Front page: masthead, lead story, list ================= -->
    <template v-if="view === 'list'">
      <section class="np-masthead" aria-labelledby="np-heading">
        <div class="np-shell np-masthead__grid">
          <h1 id="np-heading" class="np-masthead__title" v-reveal>News</h1>
          <p class="np-masthead__lede" v-reveal="{ delay: 80 }">
            {{ news.title }} {{ news.lede }}
          </p>
        </div>
      </section>

      <section class="np-lead" aria-label="Lead story">
        <div class="np-shell">
          <article class="np-lead__card">
            <img
              :src="news.featured.image"
              :alt="news.featured.imageAlt"
              class="np-lead__image"
              width="1200"
              height="800"
              fetchpriority="high"
              decoding="async"
            />
            <div class="np-lead__text">
              <p class="np-meta">
                <span class="np-meta__category">{{ news.featured.category }}</span>
                {{ news.featured.date }}
              </p>
              <h2 class="np-lead__headline">{{ news.featured.title }}</h2>
              <p class="np-lead__excerpt">{{ news.featured.excerpt }}</p>
              <button
                type="button"
                class="np-link"
                @click="openArticle(featuredStory)"
              >
                Read the story
                <ArrowRight class="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </article>
        </div>
      </section>

      <section class="np-list" aria-labelledby="np-list-heading">
        <div class="np-shell">
          <div class="np-tools">
            <h2 id="np-list-heading" class="np-tools__heading">Latest stories</h2>

            <div class="np-filters" role="group" aria-label="Filter stories by category">
              <button
                v-for="category in CATEGORIES"
                :key="category"
                type="button"
                class="np-filter"
                :class="{ 'np-filter--active': activeCategory === category }"
                :aria-pressed="activeCategory === category ? 'true' : 'false'"
                @click="activeCategory = category"
              >
                {{ category }}
              </button>
            </div>

            <label class="np-search">
              <Search class="h-4 w-4" aria-hidden="true" />
              <input
                v-model="searchTerm"
                type="search"
                placeholder="Search stories"
                aria-label="Search stories"
              />
            </label>
          </div>

          <ul v-if="visibleStories.length" class="np-rows">
            <li v-for="story in visibleStories" :key="story.slug">
              <button type="button" class="np-row" @click="openArticle(story)">
                <span class="np-row__meta">
                  <span class="np-meta__category">{{ story.category }}</span>
                  <span>{{ story.date }}</span>
                </span>
                <span class="np-row__main">
                  <span class="np-row__headline">{{ story.title }}</span>
                  <span class="np-row__summary">{{ story.summary }}</span>
                </span>
                <ArrowRight class="np-row__arrow" aria-hidden="true" />
              </button>
            </li>
          </ul>

          <div v-else class="np-empty" role="status">
            <p>
              No stories match
              <template v-if="searchTerm">“{{ searchTerm }}”</template>
              <template v-else>this category</template>
              yet.
            </p>
            <button
              type="button"
              class="np-link"
              @click="
                activeCategory = 'All';
                searchTerm = '';
              "
            >
              Show all stories
            </button>
          </div>
        </div>
      </section>
    </template>

    <!-- ================= One article ================= -->
    <section v-else class="np-article-wrap">
      <div class="np-shell">
        <button type="button" class="np-back" @click="closeArticle">
          <ArrowLeft class="h-4 w-4" aria-hidden="true" />
          All news
        </button>

        <article v-if="openStory" class="np-article">
          <p class="np-meta">
            <span class="np-meta__category">{{ openStory.category }}</span>
            {{ openStory.date }}
          </p>
          <h1 class="np-article__headline">{{ openStory.title }}</h1>

          <img
            class="np-article__photo"
            :src="photoFor(openStory)"
            alt=""
            width="1400"
            height="560"
            decoding="async"
          />

          <div class="np-article__grid">
            <!-- Wide: one element per paragraph. -->
            <div v-if="!isNarrow" class="np-article__body">
              <p v-for="(paragraph, index) in openStory.paragraphs" :key="index">
                {{ paragraph }}
              </p>
            </div>

            <!-- Narrow: one element, so no overflow rule is needed. -->
            <p v-else class="np-article__body">
              <template v-for="(paragraph, index) in openStory.paragraphs" :key="index">
                <br v-if="index > 0" />
                {{ paragraph }}
              </template>
            </p>

            <aside class="np-related" aria-labelledby="np-related-heading">
              <h2 id="np-related-heading">Keep reading</h2>
              <ul>
                <li v-for="story in relatedStories" :key="story.slug">
                  <button type="button" class="np-row np-row--compact" @click="showRelated(story)">
                    <span class="np-row__meta">
                      <span class="np-meta__category">{{ story.category }}</span>
                      <span>{{ story.date }}</span>
                    </span>
                    <span class="np-row__headline">{{ story.title }}</span>
                    <ArrowRight class="np-row__arrow" aria-hidden="true" />
                  </button>
                </li>
              </ul>
            </aside>
          </div>
        </article>
      </div>
    </section>

    <!-- ================= Newsletter ================= -->
    <section class="np-newsletter" aria-labelledby="np-news-heading">
      <div class="np-shell np-newsletter__grid">
        <div>
          <h2 id="np-news-heading">{{ news.fridayBrief.label }}</h2>
          <p>{{ news.fridayBrief.body }}</p>
        </div>

        <form class="np-newsletter__form" @submit.prevent="subscribe">
          <label for="np-email" class="sr-only">Email address</label>
          <input
            id="np-email"
            v-model="newsletterEmail"
            type="email"
            placeholder="you@farm.co.zm"
            required
          />
          <button type="submit">{{ news.fridayBrief.cta }}</button>
        </form>
        <p v-if="newsletterSent" class="np-newsletter__thanks" role="status">
          Thank you — this is a preview, so nothing was sent.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.np {
  position: relative;
  z-index: 1;
  overflow: clip;
  background: var(--color-cream-50);
  color: var(--color-forest-950);
}

.np-shell {
  width: 100%;
  max-width: var(--shell-max);
  margin-inline: auto;
  padding-inline: var(--shell-pad);
}

.np-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 0.85rem;
  color: rgb(19 24 19 / 0.6);
  font-size: 0.85rem;
}

.np-meta__category {
  color: var(--color-forest-600);
  font-weight: 650;
}

.np-link {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--color-forest-950);
  font-weight: 650;
  text-decoration: underline;
  text-underline-offset: 0.3em;
  cursor: pointer;
}

.np-link:focus-visible,
.np-filter:focus-visible,
.np-row:focus-visible,
.np-back:focus-visible,
.np-search:focus-within,
.np-newsletter input:focus-visible,
.np-newsletter button:focus-visible {
  outline: 3px solid var(--color-forest-600);
  outline-offset: 3px;
}

/* ---- Masthead ---- */
.np-masthead {
  padding-block: clamp(5.5rem, 6.5vw, 6.25rem) var(--space-section);
}

/* Title with its description directly beneath, as on every other page. */
.np-masthead__grid {
  display: block;
}

.np-masthead__title {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: var(--page-title);
  letter-spacing: var(--page-title-tracking);
  line-height: var(--page-title-leading);
}

.np-masthead__lede {
  margin-top: 1rem;
  color: rgb(19 24 19 / 0.72);
  font-size: var(--page-lede);
  line-height: var(--page-lede-leading);
  max-width: var(--page-lede-measure);
}

/* ---- Lead story ---- */
.np-lead {
  padding-bottom: clamp(2rem, 3.5vw, 3rem);
}

.np-lead__card {
  display: grid;
  gap: 1.25rem;
  align-items: center;
}

.np-lead__image {
  width: 100%;
  aspect-ratio: 3 / 2;
  border-radius: 5px;
  object-fit: cover;
}

.np-lead__headline {
  margin-top: 0.75rem;
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 2.2vw, 1.875rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.08;
  text-wrap: balance;
}

.np-lead__excerpt {
  max-width: 34rem;
  margin: 0.85rem 0 1.1rem;
  color: rgb(19 24 19 / 0.72);
  font-size: var(--page-lede);
  line-height: var(--page-lede-leading);
}

/* ---- List ---- */
.np-list {
  padding-block: var(--space-section) var(--space-section);
  border-top: 1px solid rgb(4 32 21 / 0.2);
}

.np-tools {
  display: grid;
  gap: 0.9rem;
  align-items: center;
}

.np-tools__heading {
  font-family: var(--font-display);
  font-size: var(--section-title);
  font-weight: 500;
  letter-spacing: -0.025em;
}

.np-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.np-filter {
  padding: 0.45rem 0.95rem;
  border: 1px solid rgb(4 32 21 / 0.22);
  border-radius: 9999px;
  font-size: 0.86rem;
  font-weight: 560;
  cursor: pointer;
  transition: background-color 160ms ease, color 160ms ease;
}

.np-filter:hover {
  background: rgb(4 32 21 / 0.06);
}

.np-filter--active {
  border-color: var(--color-forest-950);
  background: var(--color-forest-950);
  color: var(--color-cream-50);
}

.np-search {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.9rem;
  border: 1px solid rgb(4 32 21 / 0.22);
  border-radius: 9999px;
  background: #fff;
}

.np-search input {
  width: 100%;
  min-width: 0;
  border: 0;
  background: transparent;
  font-size: 0.9rem;
  outline: none;
}

.np-rows {
  margin: 1rem 0 0;
  padding: 0;
  list-style: none;
}

.np-row {
  display: grid;
  width: 100%;
  gap: 0.4rem;
  align-items: start;
  padding-block: 1.1rem;
  border-top: 1px solid rgb(4 32 21 / 0.14);
  text-align: left;
  cursor: pointer;
}

.np-rows li:last-child .np-row {
  border-bottom: 1px solid rgb(4 32 21 / 0.14);
}

.np-row__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem 0.8rem;
  color: rgb(19 24 19 / 0.6);
  font-size: 0.85rem;
}

.np-row__main {
  display: grid;
  gap: 0.35rem;
}

.np-row__headline {
  font-family: var(--font-display);
  font-size: clamp(1.15rem, 1.5vw, 1.35rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.np-row__summary {
  max-width: 42rem;
  color: rgb(19 24 19 / 0.65);
  font-size: var(--page-lede);
  line-height: 1.55;
}

.np-row__arrow {
  display: none;
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-forest-600);
  transition: transform 180ms ease;
}

.np-row:hover .np-row__headline {
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.np-row:hover .np-row__arrow {
  transform: translateX(4px);
}

.np-empty {
  display: grid;
  gap: 0.75rem;
  justify-items: start;
  margin-top: 1.25rem;
  padding: 1.5rem 0;
  border-top: 1px solid rgb(4 32 21 / 0.14);
}

/* ---- Article ---- */
.np-article-wrap {
  padding-block: clamp(5.5rem, 6.5vw, 6.25rem) var(--space-section);
}

.np-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-forest-600);
  font-weight: 650;
  cursor: pointer;
}

.np-article {
  margin: 1.25rem 0 0;
}

.np-article__headline {
  max-width: 48rem;
  margin-top: 0.6rem;
  font-family: var(--font-display);
  font-size: var(--page-title);
  font-weight: 500;
  letter-spacing: var(--page-title-tracking);
  line-height: var(--page-title-leading);
  text-wrap: pretty;
}

.np-article__photo {
  width: 100%;
  height: clamp(12rem, 24vw, 20rem);
  margin-top: 1.25rem;
  border-radius: 5px;
  object-fit: cover;
}

.np-article__grid {
  display: grid;
  gap: 1.5rem var(--space-gap);
  margin-top: 1.5rem;
}

.np-article__body {
  max-width: 44rem;
  font-size: 1.05rem;
  line-height: 1.7;
}

.np-article__body p + p {
  margin-top: 1rem;
}

.np-related h2 {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 500;
}

.np-related ul {
  margin: 0.5rem 0 0;
  padding: 0;
  list-style: none;
}

.np-row--compact {
  grid-template-columns: 1fr auto;
}

.np-row--compact .np-row__meta {
  grid-column: 1 / -1;
}

.np-row--compact .np-row__arrow {
  display: block;
}

/* ---- Newsletter ---- */
.np-newsletter {
  padding-block: var(--space-section);
  background: var(--color-forest-900);
  color: var(--color-cream-50);
}

.np-newsletter__grid {
  display: grid;
  gap: 1.25rem;
  align-items: center;
}

.np-newsletter h2 {
  font-family: var(--font-display);
  font-size: var(--section-title);
  font-weight: 500;
  letter-spacing: -0.025em;
}

.np-newsletter p {
  max-width: 30rem;
  margin-top: 0.5rem;
  color: rgb(251 249 243 / 0.72);
  line-height: 1.6;
}

.np-newsletter__form {
  display: flex;
  gap: 0.5rem;
}

.np-newsletter input {
  flex: 1;
  min-width: 0;
  padding: 0.8rem 1.1rem;
  border-radius: 9999px;
  border: 0;
  background: var(--color-cream-50);
  color: var(--color-forest-950);
}

.np-newsletter button {
  padding-inline: 1.4rem;
  border-radius: 9999px;
  background: var(--color-maize-400);
  color: var(--color-forest-950);
  font-weight: 650;
  cursor: pointer;
}

.np-newsletter button:hover {
  background: var(--color-maize-300);
}

.np-newsletter__thanks {
  grid-column: 1 / -1;
  margin: 0;
}

@media (min-width: 64rem) {
  .np-article__grid {
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
    align-items: start;
  }

  .np-related {
    position: sticky;
    top: 6.5rem;
  }
}

@media (min-width: 48rem) {
  .np-lead__card {
    grid-template-columns: 1.3fr 1fr;
    gap: var(--space-gap);
  }

  /* The photo takes its height from the text beside it, so it can never be
     taller than the copy and leave empty space around it. */
  .np-lead__image {
    align-self: stretch;
    height: 100%;
    min-height: 12rem;
    aspect-ratio: auto;
    contain: size;
  }

  .np-tools {
    grid-template-columns: auto 1fr minmax(13rem, 17rem);
    gap: 1.5rem;
  }

  .np-row {
    grid-template-columns: 11rem minmax(0, 1fr) auto;
    gap: 1.5rem;
  }

  .np-row__meta {
    flex-direction: column;
  }

  .np-row__arrow {
    display: block;
  }

  .np-row--compact {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .np-newsletter__grid {
    grid-template-columns: 1fr minmax(18rem, 26rem);
    gap: 2rem;
  }
}
</style>
