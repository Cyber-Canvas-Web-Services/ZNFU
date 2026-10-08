<script setup>
/**
 * The stacked home page — every section in order, as they always were.
 * It is the “/” page inside the app shell (src/App.vue).
 */
import FieldBand from "@/components/sections/FieldBand.vue";
import HeroSection from "@/components/sections/HeroSection.vue";
import MembershipSection from "@/components/sections/MembershipSection.vue";
import NewsSection from "@/components/sections/NewsSection.vue";
import PurposeVision from "@/components/sections/PurposeVision.vue";
import StatsBand from "@/components/sections/StatsBand.vue";
import SystemsSection from "@/components/sections/SystemsSection.vue";
import WhatWeDo from "@/components/sections/WhatWeDo.vue";
</script>

<template>
  <HeroSection />
  <StatsBand />
  <PurposeVision />
  <FieldBand />
  <WhatWeDo />
  <SystemsSection />
  <NewsSection />
  <MembershipSection />
</template>
