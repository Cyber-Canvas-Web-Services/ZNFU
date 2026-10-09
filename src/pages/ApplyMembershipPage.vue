<script setup>
/**
 * Apply for Membership — a standalone page at /apply-membership, opened from
 * the “Apply for membership” and “Join ZNFU” buttons.
 *
 * The five steps are the same confirmed facts the membership section shows on
 * the home page; here they fill the main band, and the Secretariat’s contact
 * details sit in a short band just above the footer.
 */
import { Mail, MapPin, Phone } from "@lucide/vue";

import StackedPanel from "@/components/sections/StackedPanel.vue";
import { applyMembership, contact } from "@/data/home";
</script>

<template>
  <!-- Band 1 — the application steps -->
  <StackedPanel
    id="apply-membership"
    class="apply-band"
    surface="bg-cream-100"
    :first="true"
  >
    <div>
      <p class="eyebrow text-forest-600" v-reveal>
        {{ applyMembership.eyebrow }}
      </p>
      <h1 class="section-title mt-5 text-forest-950" v-reveal="{ delay: 60 }">
        {{ applyMembership.title }}
      </h1>
      <p class="lede mt-5 max-w-md text-ink-900/65" v-reveal="{ delay: 110 }">
        {{ applyMembership.lede }}
      </p>
    </div>

    <!-- The five confirmed application facts, shown here as cards (the
         home page’s membership section lists them). -->
    <ol class="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-12">
      <li
        v-for="(step, index) in applyMembership.steps"
        :key="step.number"
        v-reveal="{ delay: 120 + index * 70 }"
        class="group rounded-2xl bg-cream-50 p-6 shadow-soft ring-1 ring-forest-900/5"
      >
        <span
          class="font-display text-sm font-semibold tracking-[0.2em] text-maize-400"
        >
          {{ step.number }}
        </span>
        <span
          class="mt-2 block font-display text-lg font-medium tracking-[-0.02em] text-forest-950 transition group-hover:text-forest-700"
        >
          {{ step.title }}
        </span>
        <span
          class="mt-1.5 block text-[0.9rem] leading-relaxed text-ink-900/60"
        >
          {{ step.body }}
        </span>
      </li>
    </ol>
  </StackedPanel>

  <!-- Band 2 — Secretariat contact, just above the footer -->
  <StackedPanel surface="bg-cream-100" compact>
    <div
      class="mt-9 max-w-md rounded-2xl bg-cream-50 p-6 shadow-soft ring-1 ring-forest-900/5"
      v-reveal="{ delay: 150 }"
    >
      <p
        class="font-display text-base font-medium tracking-[-0.02em] text-forest-950"
      >
        {{ applyMembership.contactHeading }}
      </p>

      <ul class="mt-4 space-y-4 text-sm text-ink-900/65">
        <li class="flex gap-3">
          <MapPin
            class="mt-0.5 h-4 w-4 shrink-0 text-maize-400"
            aria-hidden="true"
          />
          <address class="not-italic leading-relaxed">
            <span
              v-for="line in contact.addressLines"
              :key="line"
              class="block"
            >
              {{ line }}
            </span>
          </address>
        </li>
        <li class="flex gap-3">
          <Phone
            class="mt-0.5 h-4 w-4 shrink-0 text-maize-400"
            aria-hidden="true"
          />
          <span class="flex flex-col gap-1">
            <a
              v-for="phone in contact.phones"
              :key="phone"
              :href="`tel:${phone.replace(/\s/g, '')}`"
              class="transition hover:text-forest-700"
            >
              {{ phone }}
            </a>
          </span>
        </li>
        <li class="flex gap-3">
          <Mail
            class="mt-0.5 h-4 w-4 shrink-0 text-maize-400"
            aria-hidden="true"
          />
          <a
            :href="`mailto:${contact.email}`"
            class="transition hover:text-forest-700"
          >
            {{ contact.email }}
          </a>
        </li>
      </ul>
    </div>
  </StackedPanel>
</template>

<style scoped>
/**
 * This band holds the heading plus five step cards — taller than a laptop
 * screen. StackedPanel pins itself on large screens (`sticky`), and a pinned
 * panel taller than the viewport cuts off everything below the fold: the
 * fifth step sat below the screen edge, could not be scrolled to, and its
 * reveal animation never fired either, so it stayed invisible.
 *
 * Keeping this one band in normal flow lets the page scroll normally, so all
 * five steps are reachable. Scoped to this page only — no other page and no
 * shared style is affected.
 */
.apply-band {
  position: relative;
}
</style>
