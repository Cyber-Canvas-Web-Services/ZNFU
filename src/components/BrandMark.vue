<script setup>
/**
 * Brand wordmark. Text-based until the official ZNFU logo file is supplied —
 * swap the <svg> block for the real asset when it arrives.
 */
import { brand } from '@/data/home'

defineProps({
  /** 'light' for dark backgrounds, 'dark' for light backgrounds. */
  tone: { type: String, default: 'light' },
  compact: { type: Boolean, default: false },
})
</script>

<template>
  <span class="inline-flex items-center gap-3">
    <span
      class="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
      :class="tone === 'light' ? 'bg-maize-400' : 'bg-forest-900'"
      aria-hidden="true"
    >
      <svg viewBox="0 0 32 32" class="h-6 w-6" fill="none">
        <path
          d="M16 27V14"
          :stroke="tone === 'light' ? '#0a1e13' : '#f5c62a'"
          stroke-width="2.6"
          stroke-linecap="round"
        />
        <path
          d="M16 15c0-4.6 2.7-7.9 7.3-9C22.5 11 20 14 16 15Z"
          :fill="tone === 'light' ? '#1c402a' : '#8ebd99'"
        />
        <path
          d="M16 20.5c0-4.6-2.7-7.9-7.3-9C9.5 16.5 12 19.5 16 20.5Z"
          :fill="tone === 'light' ? '#1c402a' : '#f5c62a'"
        />
        <path
          d="M10.5 27h11"
          :stroke="tone === 'light' ? '#0a1e13' : '#f5c62a'"
          stroke-width="2.6"
          stroke-linecap="round"
        />
      </svg>
    </span>

    <span class="flex flex-col leading-none">
      <span
        class="font-display text-xl font-semibold tracking-[-0.01em]"
        :class="tone === 'light' ? 'text-white' : 'text-forest-950'"
        >{{ brand.shortName }}</span
      >
      <span
        v-if="!compact"
        class="mt-1 text-[0.55rem] font-semibold uppercase tracking-[0.2em]"
        :class="tone === 'light' ? 'text-white/60' : 'text-forest-700'"
        >Zambia National Farmers’ Union</span
      >
    </span>
  </span>
</template>
