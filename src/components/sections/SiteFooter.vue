<script setup>
import { ref } from 'vue'
import { ArrowRight, Mail, MapPin, Phone, Send } from '@lucide/vue'

import BrandMark from '@/components/BrandMark.vue'
import SocialIcon from '@/components/ui/SocialIcon.vue'
import { brand, contact, footer, navLinks } from '@/data/home'

const email = ref('')
const subscribed = ref(false)

function subscribe() {
  if (!email.value) return
  subscribed.value = true
  email.value = ''
}

const year = new Date().getFullYear()
</script>

<template>
  <footer
    id="contact"
    class="relative z-10 scroll-mt-24 overflow-hidden bg-forest-950 text-cream-50 lg:rounded-t-[2rem] lg:shadow-[0_-30px_80px_-45px_rgba(10,30,19,0.6)] lg:ring-1 lg:ring-forest-950/5"
  >
    <div
      class="pointer-events-none absolute -left-40 -top-20 h-[420px] w-[420px] rounded-full bg-maize-500/8 blur-3xl"
      aria-hidden="true"
    />

    <div class="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
      <div class="grid gap-14 lg:grid-cols-[1.05fr_1.35fr_1fr]">
        <!-- Brand + mission -->
        <div>
          <BrandMark />
          <p class="mt-6 max-w-sm text-sm leading-relaxed text-cream-200/65">
            {{ footer.mission }}
          </p>
          <p class="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-maize-400">
            {{ footer.meta }}
          </p>

          <ul class="mt-8 flex gap-3">
            <li v-for="social in contact.socials" :key="social.network">
              <a
                :href="social.href"
                :aria-label="social.label"
                target="_blank"
                rel="noopener noreferrer"
                class="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-cream-100/80 transition hover:border-maize-400 hover:bg-maize-400 hover:text-forest-950"
              >
                <SocialIcon :network="social.network" :label="social.label" />
              </a>
            </li>
          </ul>
        </div>

        <!-- Link columns -->
        <div class="grid grid-cols-2 gap-8 sm:gap-10">
          <div v-for="column in footer.columns" :key="column.title">
            <h2
              class="font-display text-sm font-semibold uppercase tracking-[0.1em] text-cream-100"
            >
              {{ column.title }}
            </h2>
            <ul class="mt-5 space-y-3">
              <li v-for="link in column.links" :key="link.label">
                <a
                  :href="link.href"
                  class="text-sm text-cream-200/65 transition hover:text-maize-300"
                >
                  {{ link.label }}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Contact + newsletter -->
        <div>
          <h2 class="font-display text-sm font-semibold uppercase tracking-[0.1em] text-cream-100">
            Visit or call
          </h2>

          <ul class="mt-5 space-y-4 text-sm text-cream-200/70">
            <li class="flex gap-3">
              <MapPin class="mt-0.5 h-4 w-4 shrink-0 text-maize-400" aria-hidden="true" />
              <address class="not-italic leading-relaxed">
                <span v-for="line in contact.addressLines" :key="line" class="block">
                  {{ line }}
                </span>
              </address>
            </li>
            <li class="flex gap-3">
              <Phone class="mt-0.5 h-4 w-4 shrink-0 text-maize-400" aria-hidden="true" />
              <span class="flex flex-col gap-1">
                <a
                  v-for="phone in contact.phones"
                  :key="phone"
                  :href="`tel:${phone.replace(/\s/g, '')}`"
                  class="transition hover:text-maize-300"
                >
                  {{ phone }}
                </a>
              </span>
            </li>
            <li class="flex gap-3">
              <Mail class="mt-0.5 h-4 w-4 shrink-0 text-maize-400" aria-hidden="true" />
              <a :href="`mailto:${contact.email}`" class="transition hover:text-maize-300">
                {{ contact.email }}
              </a>
            </li>
          </ul>

          <div class="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
            <p class="font-display text-base font-medium tracking-[-0.02em]">{{ footer.newsletter.title }}</p>
            <p class="mt-2 text-xs leading-relaxed text-cream-200/60">
              {{ footer.newsletter.body }}
            </p>

            <form v-if="!subscribed" class="mt-4 flex gap-2" @submit.prevent="subscribe">
              <label class="sr-only" for="footer-email">Email address</label>
              <input
                id="footer-email"
                v-model="email"
                type="email"
                required
                :placeholder="footer.newsletter.placeholder"
                class="min-w-0 flex-1 rounded-full border border-white/15 bg-forest-950/60 px-4 py-2.5 text-sm text-cream-50 placeholder:text-cream-200/35 focus:border-maize-400 focus:outline-none"
              />
              <button
                type="submit"
                class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-maize-400 text-forest-950 transition hover:bg-maize-300"
                aria-label="Subscribe"
              >
                <Send class="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
            <p v-else class="mt-4 text-xs text-maize-200">{{ footer.newsletter.success }}</p>
          </div>
        </div>
      </div>

      <!-- Bottom bar -->
      <div
        class="mt-16 flex flex-col gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between"
      >
        <p class="text-xs text-cream-200/50">
          © {{ year }} {{ brand.fullName }}. All rights reserved.
        </p>
        <ul class="flex flex-wrap items-center gap-x-6 gap-y-2">
          <li v-for="link in footer.legal" :key="link.label">
            <a :href="link.href" class="text-xs text-cream-200/50 transition hover:text-maize-300">
              {{ link.label }}
            </a>
          </li>
          <li>
            <a
              href="#hero"
              class="inline-flex items-center gap-1.5 text-xs font-semibold text-maize-400 transition hover:text-maize-300"
            >
              Back to top
              <ArrowRight class="h-3.5 w-3.5 -rotate-90" aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>

      <!-- Sitemap helper for crawlers / screen readers -->
      <nav class="sr-only" aria-label="Footer sitemap">
        <a v-for="link in navLinks" :key="link.href" :href="link.href">{{ link.label }}</a>
      </nav>
    </div>
  </footer>
</template>
