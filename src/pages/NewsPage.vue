<script setup>
/**
 * Newsroom — the standalone page at /news.
 *
 * The band it shows is the same component the home page stacks, given
 * `standalone` so it heads the page and carries the page’s single <h1>.
 */
import NewsSection from "@/components/sections/NewsSection.vue";
</script>

<template>
  <NewsSection standalone />
</template>
