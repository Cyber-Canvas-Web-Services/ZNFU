<script setup>
/**
 * The focused home page at “/”. Detailed subjects live on the standalone
 * pages linked from the main navigation.
 */
import HeroSection from "@/components/sections/HeroSection.vue";
import HomeIntroduction from "@/components/sections/HomeIntroduction.vue";
import HomeNewsPreview from "@/components/sections/HomeNewsPreview.vue";
import StatsBand from "@/components/sections/StatsBand.vue";
import TrustStrip from "@/components/sections/TrustStrip.vue";
</script>

<template>
  <HeroSection />
  <HomeIntroduction />
  <HomeNewsPreview />
  <TrustStrip />
  <StatsBand />
</template>
