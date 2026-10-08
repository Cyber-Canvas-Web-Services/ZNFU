<script setup>
/**
 * Newsroom — split into two panels: the featured story, then the latest list
 * with the Friday Briefs signup. Together they are well over a screen tall.
 */
import { ref } from "vue";
import { ArrowRight, Clock, Send } from "@lucide/vue";

import StackedPanel from "@/components/sections/StackedPanel.vue";
import { news } from "@/data/home";

const email = ref("");
const subscribed = ref(false);

function subscribe() {
  if (!email.value) return;
  subscribed.value = true;
  email.value = "";
}

/**
 * Also stands alone at /news, where it heads the page and carries the page’s
 * single <h1>.
 */
defineProps({
  standalone: { type: Boolean, default: false },
});
</script>

<template>
  <!-- Panel 1 — featured story -->
  <StackedPanel id="news" surface="bg-cream-50" :first="true">
    <div
      class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
      v-reveal
    >
      <div class="max-w-2xl">
        <p class="eyebrow text-forest-600">{{ news.eyebrow }}</p>
        <component
          :is="standalone ? 'h1' : 'h2'"
          class="section-title mt-4 text-forest-950"
        >
          {{ news.title }}
        </component>
      </div>
      <!-- An in-app "/…" path, so the shell’s document click handler turns
           this into a page switch the same way the header’s buttons work —
           no router, and no change to App.vue needed. -->
      <a href="/news" class="btn btn--outline shrink-0">
        {{ news.allLink.label }}
        <ArrowRight class="h-4 w-4" aria-hidden="true" />
      </a>
    </div>

    <article v-reveal="{ delay: 90 }" class="group mt-10">
      <!-- The whole card is the “Read story” call to action, so it opens the
           News page, where this story is shown in full. -->
      <a
        href="/news"
        class="grid overflow-hidden rounded-3xl bg-cream-100 shadow-soft ring-1 ring-forest-900/5 lg:grid-cols-2"
      >
        <div class="relative h-56 overflow-hidden lg:h-[400px]">
          <img
            :src="news.featured.image"
            :alt="news.featured.imageAlt"
            class="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-forest-950/60 to-transparent"
          />
          <span
            class="absolute left-5 top-5 rounded-full bg-maize-400 px-3.5 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-forest-950"
          >
            {{ news.featured.category }}
          </span>
        </div>

        <div class="flex flex-col justify-center p-7 sm:p-10">
          <p
            class="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-ink-900/45"
          >
            <Clock class="h-3.5 w-3.5" aria-hidden="true" />
            {{ news.featured.date }}
          </p>
          <h3
            class="mt-4 font-display text-2xl font-medium leading-snug tracking-[-0.025em] text-forest-950 lg:text-3xl"
          >
            {{ news.featured.title }}
          </h3>
          <p class="mt-4 leading-relaxed text-ink-900/65">
            {{ news.featured.excerpt }}
          </p>
          <span
            class="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-forest-800 transition group-hover:gap-3"
          >
            Read story
            <ArrowRight class="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </a>
    </article>
  </StackedPanel>

  <!-- Panel 2 — latest + Friday Briefs -->
  <StackedPanel surface="bg-cream-100">
    <div class="grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
      <div>
        <p class="eyebrow text-forest-600" v-reveal>Latest</p>
        <ul
          class="mt-6 divide-y divide-forest-900/10 border-y border-forest-900/10"
        >
          <li
            v-for="(item, index) in news.items"
            :key="item.title"
            v-reveal="{ delay: index * 80 }"
          >
            <a
              :href="item.href"
              class="group flex flex-col gap-3 py-6 transition-colors hover:bg-cream-50/70 sm:flex-row sm:items-start sm:gap-6"
            >
              <span
                class="shrink-0 pt-0.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-maize-700 sm:w-32"
              >
                {{ item.category }}
              </span>
              <span class="flex-1">
                <span
                  class="block font-display text-lg font-medium leading-snug tracking-[-0.02em] text-forest-950 transition group-hover:text-forest-700"
                >
                  {{ item.title }}
                </span>
                <span
                  class="mt-2 block text-xs uppercase tracking-[0.14em] text-ink-900/45"
                >
                  {{ item.date }}
                </span>
              </span>
              <ArrowRight
                class="hidden h-5 w-5 shrink-0 self-center text-forest-800/40 transition group-hover:translate-x-1 group-hover:text-forest-800 sm:block"
                aria-hidden="true"
              />
            </a>
          </li>
        </ul>
      </div>

      <div
        v-reveal="{ delay: 140 }"
        class="grain relative flex flex-col justify-center overflow-hidden rounded-3xl bg-forest-900 p-7 text-cream-50 sm:p-9"
      >
        <p class="eyebrow eyebrow--plain text-maize-400">
          {{ news.fridayBrief.label }}
        </p>
        <h3
          class="mt-4 font-display text-2xl font-medium leading-snug tracking-[-0.025em]"
        >
          {{ news.fridayBrief.title }}
        </h3>
        <p class="mt-4 text-sm leading-relaxed text-cream-200/70">
          {{ news.fridayBrief.body }}
        </p>

        <form
          v-if="!subscribed"
          class="mt-6 flex flex-col gap-3 sm:flex-row"
          @submit.prevent="subscribe"
        >
          <label class="sr-only" for="news-email">Email address</label>
          <input
            id="news-email"
            v-model="email"
            type="email"
            required
            placeholder="you@farm.co.zm"
            class="field field--on-dark min-w-0"
          />
          <button type="submit" class="btn btn--maize shrink-0">
            {{ news.fridayBrief.cta }}
            <Send class="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
        <p
          v-else
          class="mt-6 rounded-2xl bg-maize-400/15 px-5 py-4 text-sm text-maize-200"
        >
          Thank you — please check your inbox to confirm.
        </p>
      </div>
    </div>
  </StackedPanel>
</template>
