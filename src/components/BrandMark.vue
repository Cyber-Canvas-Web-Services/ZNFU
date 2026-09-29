<script setup>
/**
 * Brand lockup: the official ZNFU logo tile plus the Union's full name.
 *
 * The logo already carries the "znfu" blackletter wordmark, so the text
 * alongside it spells out the full name rather than repeating the acronym.
 */
import { brand, logo } from '@/data/home'

defineProps({
  /** 'light' for dark backgrounds, 'dark' for light backgrounds. */
  tone: { type: String, default: 'light' },
  /** Hide the full name, leaving only the logo tile. */
  compact: { type: Boolean, default: false },
})
</script>

<template>
  <span class="inline-flex items-center gap-3">
    <img
      :src="logo"
      :alt="`${brand.fullName} logo`"
      width="44"
      height="44"
      class="h-11 w-11 shrink-0 rounded-xl object-cover shadow-sm ring-1"
      :class="tone === 'light' ? 'ring-white/20' : 'ring-forest-950/15'"
    />

    <span v-if="!compact" class="flex flex-col leading-tight">
      <span
        class="font-display text-[0.95rem] font-medium tracking-[-0.02em] sm:text-base"
        :class="tone === 'light' ? 'text-white' : 'text-forest-950'"
      >
        Zambia National
      </span>
      <span
        class="font-display text-[0.95rem] font-medium tracking-[-0.02em] sm:text-base"
        :class="tone === 'light' ? 'text-white' : 'text-forest-950'"
      >
        Farmers’ Union
      </span>
    </span>
  </span>
</template>
