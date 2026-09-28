<script setup>
import SiteHeader from '@/components/sections/SiteHeader.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import StatsBand from '@/components/sections/StatsBand.vue'
import PurposeVision from '@/components/sections/PurposeVision.vue'
import FieldBand from '@/components/sections/FieldBand.vue'
import WhatWeDo from '@/components/sections/WhatWeDo.vue'
import SystemsSection from '@/components/sections/SystemsSection.vue'
import NewsSection from '@/components/sections/NewsSection.vue'
import MembershipSection from '@/components/sections/MembershipSection.vue'
import PartnersStrip from '@/components/sections/PartnersStrip.vue'
import SiteFooter from '@/components/sections/SiteFooter.vue'
</script>

<template>
  <a
    href="#about"
    class="sr-only focus:not-sr-only focus:absolute focus:left-5 focus:top-5 focus:z-[60] focus:rounded-full focus:bg-maize-400 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-forest-950"
  >
    Skip to content
  </a>

  <SiteHeader />

  <main>
    <HeroSection />
    <StatsBand />
    <PurposeVision />
    <FieldBand />
    <WhatWeDo />
    <SystemsSection />
    <NewsSection />
    <MembershipSection />
    <PartnersStrip />
  </main>

  <SiteFooter />
</template>
