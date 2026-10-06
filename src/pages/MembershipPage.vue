<script setup>
/**
 * Membership — the standalone page at /membership.
 *
 * The band it shows is the same component the home page stacks, given
 * `standalone` so it heads the page and carries the page’s single <h1>.
 */
import MembershipSection from "@/components/sections/MembershipSection.vue";
</script>

<template>
  <MembershipSection standalone />
</template>
