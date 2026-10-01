<script setup>
/**
 * About — the standalone page at /about.
 *
 * The band it shows is the same component the home page stacks, given
 * `standalone` so it heads the page: that swaps its <h2> for the page’s
 * single <h1> and drops the mid-stack card edge.
 */
import PurposeVision from "@/components/sections/PurposeVision.vue";
</script>

<template>
  <PurposeVision standalone />
</template>
