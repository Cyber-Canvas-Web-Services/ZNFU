<script setup>
/**
 * What we do — the standalone page at /what-we-do.
 *
 * The band it shows is the same component the home page stacks, given
 * `standalone` so it heads the page: that swaps its <h2> for the page’s
 * single <h1> and drops the mid-stack card edge.
 */
import WhatWeDo from "@/components/sections/WhatWeDo.vue";
</script>

<template>
  <WhatWeDo standalone />
</template>
