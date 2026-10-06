<script setup>
/**
 * Contact — the standalone page at /contact.
 *
 * Every detail here already sits in the shared data: the same address, phone
 * numbers, email and social accounts the footer shows. Nothing is new.
 *
 * The band id is `contact-page`, not `contact` — the footer owns that id and
 * renders on every page, so reusing it would put two elements on one id.
 */
import { Mail, MapPin, Phone } from "@lucide/vue";

import StackedPanel from "@/components/sections/StackedPanel.vue";
import SocialIcon from "@/components/ui/SocialIcon.vue";
import { brand, contact } from "@/data/home";
</script>

<template>
  <StackedPanel
    id="contact-page"
    class="contact-page-band"
    surface="bg-cream-100"
    :first="true"
  >
    <div class="max-w-2xl" v-reveal>
      <p class="eyebrow text-forest-600">Contact</p>
      <h1 class="section-title mt-5 text-forest-950">
        Talk to the ZNFU Secretariat
      </h1>
      <p class="lede mt-5 max-w-md text-ink-900/65">
        Reach the {{ brand.fullName }} at the Secretariat in Lusaka — by post,
        by phone or by email.
      </p>
    </div>

    <div class="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-3">
      <!-- Visit or write -->
      <div
        class="rounded-2xl bg-cream-50 p-6 shadow-soft ring-1 ring-forest-900/5"
        v-reveal="{ delay: 120 }"
      >
        <span
          class="grid h-11 w-11 place-items-center rounded-full bg-maize-400 text-forest-950 shadow-lg"
        >
          <MapPin class="h-5 w-5" aria-hidden="true" />
        </span>
        <h2
          class="mt-5 font-display text-lg font-medium tracking-[-0.02em] text-forest-950"
        >
          Visit or write
        </h2>
        <address
          class="mt-3 not-italic text-[0.92rem] leading-relaxed text-ink-900/65"
        >
          <span v-for="line in contact.addressLines" :key="line" class="block">
            {{ line }}
          </span>
        </address>
      </div>

      <!-- Call -->
      <div
        class="rounded-2xl bg-cream-50 p-6 shadow-soft ring-1 ring-forest-900/5"
        v-reveal="{ delay: 180 }"
      >
        <span
          class="grid h-11 w-11 place-items-center rounded-full bg-maize-400 text-forest-950 shadow-lg"
        >
          <Phone class="h-5 w-5" aria-hidden="true" />
        </span>
        <h2
          class="mt-5 font-display text-lg font-medium tracking-[-0.02em] text-forest-950"
        >
          Call the Secretariat
        </h2>
        <ul class="mt-3 flex flex-col gap-2 text-[0.92rem] text-ink-900/65">
          <li v-for="phone in contact.phones" :key="phone">
            <a
              :href="`tel:${phone.replace(/\s/g, '')}`"
              class="transition hover:text-forest-700"
            >
              {{ phone }}
            </a>
          </li>
        </ul>
      </div>

      <!-- Email -->
      <div
        class="rounded-2xl bg-cream-50 p-6 shadow-soft ring-1 ring-forest-900/5"
        v-reveal="{ delay: 240 }"
      >
        <span
          class="grid h-11 w-11 place-items-center rounded-full bg-maize-400 text-forest-950 shadow-lg"
        >
          <Mail class="h-5 w-5" aria-hidden="true" />
        </span>
        <h2
          class="mt-5 font-display text-lg font-medium tracking-[-0.02em] text-forest-950"
        >
          Email the Union
        </h2>
        <p class="mt-3 text-[0.92rem]">
          <a
            :href="`mailto:${contact.email}`"
            class="text-ink-900/65 transition hover:text-forest-700"
          >
            {{ contact.email }}
          </a>
        </p>
      </div>
    </div>

    <!-- Follow -->
    <div class="mt-10" v-reveal="{ delay: 300 }">
      <h2
        class="font-display text-lg font-medium tracking-[-0.02em] text-forest-950"
      >
        Follow the Union
      </h2>
      <ul class="mt-4 flex gap-3">
        <li v-for="social in contact.socials" :key="social.network">
          <a
            :href="social.href"
            :aria-label="social.label"
            target="_blank"
            rel="noopener noreferrer"
            class="grid h-11 w-11 place-items-center rounded-full border border-forest-900/15 text-forest-800 transition hover:border-maize-400 hover:bg-maize-400 hover:text-forest-950"
          >
            <SocialIcon :network="social.network" :label="social.label" />
          </a>
        </li>
      </ul>
    </div>
  </StackedPanel>
</template>

<style scoped>
/**
 * The panel holds the heading, three detail cards and the social row — taller
 * than a laptop screen. StackedPanel pins itself on large screens (`sticky`),
 * and a pinned panel taller than the viewport cuts off everything below the
 * fold, so the social row could not be scrolled to.
 *
 * Keeping this one band in normal flow lets the page scroll normally. Scoped
 * to this page only — no other page and no shared style is affected.
 */
.contact-page-band {
  position: relative;
}
</style>
