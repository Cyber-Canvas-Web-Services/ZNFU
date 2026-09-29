<script setup>
/**
 * Apply for Membership — a standalone page at /apply-membership, opened from
 * the “Apply for membership” and “Join ZNFU” buttons.
 *
 * The five steps are the same confirmed facts the membership section shows on
 * the home page; here they are the whole page, with the Secretariat’s contact
 * details alongside for anyone who needs help applying.
 */
import { Mail, MapPin, Phone } from "@lucide/vue";

import StackedPanel from "@/components/sections/StackedPanel.vue";
import { applyMembership, contact } from "@/data/home";
</script>

<template>
  <StackedPanel id="apply-membership" surface="bg-cream-100" :first="true">
    <div class="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
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
                class="mt-0.5 h-4 w-4 shrink-0 text-maize-600"
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
                class="mt-0.5 h-4 w-4 shrink-0 text-maize-600"
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
                class="mt-0.5 h-4 w-4 shrink-0 text-maize-600"
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
      </div>

      <!-- The five confirmed application facts, exactly as shown on the
           home page’s membership section. -->
      <ol class="grid gap-x-10 sm:grid-cols-2">
        <li
          v-for="(step, index) in applyMembership.steps"
          :key="step.number"
          v-reveal="{ delay: 120 + index * 70 }"
          class="group border-b border-forest-900/10 py-5"
        >
          <span
            class="font-display text-sm font-semibold tracking-[0.2em] text-maize-600"
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
    </div>
  </StackedPanel>
</template>
