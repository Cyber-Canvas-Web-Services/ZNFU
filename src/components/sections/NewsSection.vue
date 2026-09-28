<script setup>
import { ref } from 'vue'
import { ArrowRight, Clock, Send } from '@lucide/vue'

import { news } from '@/data/home'

const email = ref('')
const subscribed = ref(false)

function subscribe() {
  if (!email.value) return
  subscribed.value = true
  email.value = ''
}
</script>

<template>
  <section id="news" class="relative bg-cream-50 py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-5 sm:px-8">
      <div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between" v-reveal>
        <div class="max-w-2xl">
          <p class="eyebrow text-forest-600">{{ news.eyebrow }}</p>
          <h2 class="section-title mt-5 text-forest-950">{{ news.title }}</h2>
          <p class="lede mt-5 text-ink-900/65">{{ news.lede }}</p>
        </div>
        <a
          :href="news.allLink.href"
          class="btn btn--outline shrink-0"
        >
          {{ news.allLink.label }}
          <ArrowRight class="h-4 w-4" aria-hidden="true" />
        </a>
      </div>

      <div class="mt-16 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        <!-- Featured story -->
        <article v-reveal class="group flex flex-col">
          <a :href="news.featured.href" class="flex flex-1 flex-col overflow-hidden rounded-3xl bg-cream-100 shadow-soft ring-1 ring-forest-900/5">
            <div class="relative h-72 overflow-hidden sm:h-96">
              <img
                :src="news.featured.image"
                :alt="news.featured.imageAlt"
                class="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-forest-950/60 to-transparent" />
              <span
                class="absolute left-5 top-5 rounded-full bg-maize-400 px-3.5 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-forest-950"
              >
                {{ news.featured.category }}
              </span>
            </div>
            <div class="flex flex-1 flex-col p-7 sm:p-9">
              <p class="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-ink-900/45">
                <Clock class="h-3.5 w-3.5" aria-hidden="true" />
                {{ news.featured.date }}
              </p>
              <h3
                class="mt-4 font-display text-2xl font-semibold leading-snug text-forest-950 sm:text-3xl"
              >
                {{ news.featured.title }}
              </h3>
              <p class="mt-4 leading-relaxed text-ink-900/65">{{ news.featured.excerpt }}</p>
              <span
                class="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-forest-800 transition group-hover:gap-3"
              >
                Read story
                <ArrowRight class="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </a>
        </article>

        <!-- Latest list + Friday Briefs -->
        <div class="flex flex-col gap-8">
          <ul class="divide-y divide-forest-900/10 border-y border-forest-900/10" v-reveal="{ delay: 90 }">
            <li v-for="item in news.items" :key="item.title">
              <a
                :href="item.href"
                class="group flex flex-col gap-3 py-6 transition-colors hover:bg-cream-100/70 sm:flex-row sm:items-start sm:gap-6"
              >
                <span
                  class="shrink-0 pt-0.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-maize-700 sm:w-32"
                >
                  {{ item.category }}
                </span>
                <span class="flex-1">
                  <span
                    class="block font-display text-lg font-semibold leading-snug text-forest-950 transition group-hover:text-forest-700"
                  >
                    {{ item.title }}
                  </span>
                  <span class="mt-2 block text-xs uppercase tracking-[0.14em] text-ink-900/45">
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

          <!-- Friday Briefs signup -->
          <div
            v-reveal="{ delay: 150 }"
            class="grain relative overflow-hidden rounded-3xl bg-forest-900 p-7 text-cream-50 sm:p-9"
          >
            <p class="eyebrow eyebrow--plain text-maize-400">{{ news.fridayBrief.label }}</p>
            <h3 class="mt-4 font-display text-2xl font-semibold leading-snug">
              {{ news.fridayBrief.title }}
            </h3>
            <p class="mt-4 text-sm leading-relaxed text-cream-200/70">
              {{ news.fridayBrief.body }}
            </p>

            <form v-if="!subscribed" class="mt-6 flex flex-col gap-3 sm:flex-row" @submit.prevent="subscribe">
              <label class="sr-only" for="news-email">Email address</label>
              <input
                id="news-email"
                v-model="email"
                type="email"
                required
                placeholder="you@farm.co.zm"
                class="w-full rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm text-cream-50 placeholder:text-cream-200/40 focus:border-maize-400 focus:outline-none"
              />
              <button type="submit" class="btn btn--maize shrink-0">
                {{ news.fridayBrief.cta }}
                <Send class="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
            <p v-else class="mt-6 rounded-2xl bg-maize-400/15 px-5 py-4 text-sm text-maize-200">
              Thank you — please check your inbox to confirm.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
