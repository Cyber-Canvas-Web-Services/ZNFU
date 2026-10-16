<script setup>
/** Design 2 — News. Lead story panel, filter chips + list tiles, reading view. */
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { ArrowLeft, ArrowRight, Search } from "@lucide/vue";

import { news } from "@/data/home";
import { CATEGORIES, SAMPLE_CONTENT } from "@/data/newsSample";

const isNarrow = ref(false);
let query = null;
const onChange = (e) => (isNarrow.value = e.matches);
onMounted(() => {
  query = window.matchMedia("(max-width: 1023px)");
  isNarrow.value = query.matches;
  query.addEventListener("change", onChange);
});
onBeforeUnmount(() => query?.removeEventListener("change", onChange));

const view = ref("list");
const category = ref("All");
const term = ref("");
const openStory = ref(null);
const root = ref(null);

const visible = computed(() => {
  const t = term.value.trim().toLowerCase();
  return SAMPLE_CONTENT.filter(
    (s) =>
      (category.value === "All" || s.category === category.value) &&
      (!t || s.title.toLowerCase().includes(t) || s.summary.toLowerCase().includes(t) || s.category.toLowerCase().includes(t)),
  );
});
const featured = computed(() => SAMPLE_CONTENT.find((s) => s.category === "Policy") ?? SAMPLE_CONTENT[0]);
const related = computed(() => (openStory.value ? SAMPLE_CONTENT.filter((s) => s.slug !== openStory.value.slug).slice(0, 2) : []));

const top = () => nextTick(() => root.value?.scrollIntoView({ block: "start" }));
function open(story) { openStory.value = story; view.value = "article"; top(); }
function close() { openStory.value = null; view.value = "list"; top(); }

const email = ref("");
const sent = ref(false);
function subscribe() { if (email.value) { sent.value = true; email.value = ""; } }
</script>

<template>
  <div ref="root" id="news" class="v2">
    <template v-if="view === 'list'">
      <section class="v2-panel v2-panel--first v2-panel--leaf" aria-labelledby="v2-news-h">
        <div class="v2-shell v2-grid-2">
          <div>
            <h1 id="v2-news-h" class="v2-h1">News</h1>
            <p class="v2-lede" style="margin: 1rem 0 1.25rem">{{ news.title }} {{ news.lede }}</p>
            <button type="button" class="v2-btn v2-btn--forest" @click="open(featured)">
              Read the lead story <ArrowRight class="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <img class="v2-img v2-n-lead" :src="news.featured.image" :alt="news.featured.imageAlt" fetchpriority="high" />
        </div>
      </section>

      <section class="v2-panel" aria-labelledby="v2-latest-h">
        <div class="v2-shell">
          <div class="v2-n-tools">
            <h2 id="v2-latest-h" class="v2-h2">Latest stories</h2>
            <label class="v2-n-search">
              <Search class="h-4 w-4" aria-hidden="true" />
              <input v-model="term" type="search" placeholder="Search stories" aria-label="Search stories" />
            </label>
          </div>
          <div class="v2-n-chips" role="group" aria-label="Filter stories by category">
            <button v-for="c in CATEGORIES" :key="c" type="button" :class="{ on: category === c }" :aria-pressed="category === c" @click="category = c">{{ c }}</button>
          </div>

          <ul v-if="visible.length" class="v2-n-grid">
            <li v-for="s in visible" :key="s.slug">
              <button type="button" class="v2-n-card" @click="open(s)">
                <span class="v2-chip">{{ s.category }}</span>
                <span class="v2-h3">{{ s.title }}</span>
                <span class="v2-small">{{ s.summary }}</span>
                <span class="v2-small v2-n-card__date">{{ s.date }}</span>
              </button>
            </li>
          </ul>
          <div v-else class="v2-n-empty" role="status">
            <p>No stories match <template v-if="term">“{{ term }}”</template><template v-else>this category</template> yet.</p>
            <button type="button" class="v2-btn v2-btn--ghost" @click="category = 'All'; term = ''">Show all stories</button>
          </div>
        </div>
      </section>
    </template>

    <section v-else class="v2-panel v2-panel--first">
      <div class="v2-shell">
        <button type="button" class="v2-btn v2-btn--ghost" @click="close"><ArrowLeft class="h-4 w-4" aria-hidden="true" /> All news</button>
        <article v-if="openStory" class="v2-n-article">
          <span class="v2-chip">{{ openStory.category }}</span>
          <p class="v2-small" style="margin-top: 0.6rem">{{ openStory.date }}</p>
          <h1 class="v2-h1" style="margin-top: 0.6rem">{{ openStory.title }}</h1>
          <div v-if="!isNarrow" class="v2-n-body"><p v-for="(p, i) in openStory.paragraphs" :key="i">{{ p }}</p></div>
          <p v-else class="v2-n-body"><template v-for="(p, i) in openStory.paragraphs" :key="i"><br v-if="i > 0" />{{ p }}</template></p>

          <h2 class="v2-h3" style="margin-top: 2rem">Keep reading</h2>
          <ul class="v2-n-grid v2-n-grid--two">
            <li v-for="s in related" :key="s.slug">
              <button type="button" class="v2-n-card" @click="open(s)">
                <span class="v2-chip">{{ s.category }}</span>
                <span class="v2-h3">{{ s.title }}</span>
              </button>
            </li>
          </ul>
        </article>
      </div>
    </section>

    <section class="v2-panel v2-panel--forest" aria-labelledby="v2-brief-h">
      <div class="v2-shell v2-grid-2">
        <div>
          <h2 id="v2-brief-h" class="v2-h2">{{ news.fridayBrief.label }}</h2>
          <p class="v2-lede" style="margin-top: 0.8rem">{{ news.fridayBrief.body }}</p>
        </div>
        <div>
          <form class="v2-n-form" @submit.prevent="subscribe">
            <label for="v2-email" class="sr-only">Email address</label>
            <input id="v2-email" v-model="email" type="email" placeholder="you@farm.co.zm" required />
            <button type="submit" class="v2-btn v2-btn--maize">{{ news.fridayBrief.cta }}</button>
          </form>
          <p v-if="sent" role="status" class="v2-small" style="margin-top: 0.7rem">Thank you — this is a preview, so nothing was sent.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.v2-n-lead { aspect-ratio: 4 / 3; }
@media (min-width: 56rem) { .v2-n-lead { align-self: stretch; height: 100%; min-height: 12rem; aspect-ratio: auto; contain: size; } }
.v2-n-tools { display: flex; flex-wrap: wrap; align-items: end; justify-content: space-between; gap: 1rem; }
.v2-n-search { display: flex; align-items: center; gap: 0.6rem; min-width: min(100%, 18rem); padding: 0.65rem 1rem; border-radius: 9999px; background: var(--v2-page); }
.v2-n-search input { width: 100%; min-width: 0; border: 0; background: transparent; outline: none; }
.v2-n-chips { display: flex; flex-wrap: wrap; gap: 0.45rem; margin-top: 1.1rem; }
.v2-n-chips button { padding: 0.5rem 1.05rem; border-radius: 9999px; background: var(--v2-page); font-weight: 560; font-size: 0.9rem; cursor: pointer; }
.v2-n-chips button.on { background: var(--v2-forest); color: #fff; }
.v2-n-grid { display: grid; gap: 0.9rem; margin: 1.25rem 0 0; padding: 0; list-style: none; }
.v2-n-card { display: grid; width: 100%; height: 100%; gap: 0.6rem; align-content: start; justify-items: start; padding: 1.25rem; border-radius: 22px; background: var(--v2-page); text-align: left; cursor: pointer; transition: background-color 180ms ease; }
.v2-n-card:hover { background: var(--v2-leaf); }
.v2-n-card .v2-chip { background: #fff; }
.v2-n-card__date { margin-top: auto; }
.v2-n-empty { display: grid; gap: 0.8rem; justify-items: start; margin-top: 1.25rem; }
.v2-n-article { max-width: 44rem; margin-top: 1.25rem; }
.v2-n-body { margin-top: 1.25rem; font-size: 1.1rem; line-height: 1.8; }
.v2-n-body p + p { margin-top: 1.1rem; }
.v2-n-form { display: flex; gap: 0.5rem; }
.v2-n-form input { flex: 1; min-width: 0; padding: 0.8rem 1.2rem; border-radius: 9999px; background: #fff; color: var(--v2-ink); }
@media (min-width: 48rem) { .v2-n-grid { grid-template-columns: repeat(3, 1fr); } .v2-n-grid--two { grid-template-columns: repeat(2, 1fr); } }
</style>
