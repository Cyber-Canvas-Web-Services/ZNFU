<script setup>
/** Design 2 — What we do. Colour-blocked: lead, mission quote, three function panels. */
import { media, whatWeDo } from "@/data/home";

const members = ["Individual farmers", "Corporations", "Companies", "Purveyors", "Other organisations involved in the business of agriculture"];
const aims = ["Sustainable agriculture", "Economic development", "Social development"];
const functions = [
  { title: "Lobbying and advocacy", body: "We use the Union’s voice to promote and safeguard the interest of our members.", image: media.fieldMaizeDemoDay, alt: "Farmers inspecting a maize demonstration plot" },
  { title: "Member services", body: "We provide services that support our members directly.", image: media.livestockGoatsKraal, alt: "A kraal of goats at a livestock pen" },
  { title: "Information", body: "We gather and share information for members in the business of agriculture.", image: media.horticulturePassionFruit, alt: "Passion fruit ripening on a trellis" },
];
</script>

<template>
  <div class="v2">
    <section id="what-we-do" class="v2-panel v2-panel--first" aria-labelledby="v2-wwd-h">
      <div class="v2-shell v2-grid-2">
        <div>
          <h1 id="v2-wwd-h" class="v2-h1">What we do</h1>
          <p class="v2-lede" style="margin-top: 1.1rem">
            The Zambia National Farmers’ Union is a member-led, non-political union. Founded in 1905 and based in
            Lusaka, we promote and safeguard the interest of our members in the business of agriculture.
          </p>
        </div>
        <img class="v2-img v2-wwd-photo" :src="media.growerMaizeField" alt="A farmer walking through tall maize" fetchpriority="high" />
      </div>
    </section>

    <section class="v2-panel v2-panel--maize" aria-labelledby="v2-mission-h">
      <div class="v2-shell">
        <h2 id="v2-mission-h" class="v2-small" style="font-weight: 650; opacity: 1">Our mission</h2>
        <blockquote class="v2-quote v2-wwd-quote">{{ whatWeDo.lede }}</blockquote>
        <div class="v2-wwd-lists">
          <div>
            <h3 class="v2-small" style="opacity: 1; font-weight: 650">Who we represent</h3>
            <ul class="v2-wwd-chips"><li v-for="m in members" :key="m" class="v2-chip" style="background: rgb(12 55 32 / 0.14)">{{ m }}</li></ul>
          </div>
          <div>
            <h3 class="v2-small" style="opacity: 1; font-weight: 650">What we work to achieve</h3>
            <ul class="v2-wwd-chips"><li v-for="a in aims" :key="a" class="v2-chip" style="background: var(--v2-forest); color: #fff">{{ a }}</li></ul>
          </div>
        </div>
      </div>
    </section>

    <section class="v2-panel v2-panel--forest" aria-labelledby="v2-fn-h">
      <div class="v2-shell">
        <h2 id="v2-fn-h" class="v2-h2">How the Union works for members</h2>
        <ul class="v2-wwd-fns">
          <li v-for="f in functions" :key="f.title">
            <img class="v2-img" :src="f.image" :alt="f.alt" width="800" height="600" loading="lazy" />
            <h3 class="v2-h3">{{ f.title }}</h3>
            <p class="v2-small">{{ f.body }}</p>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
.v2-wwd-photo { aspect-ratio: 5 / 4; }
@media (min-width: 56rem) { .v2-wwd-photo { align-self: stretch; height: 100%; min-height: 12rem; aspect-ratio: auto; contain: size; } }
.v2-wwd-quote { max-width: 56rem; margin: 0.9rem 0 0; font-size: clamp(1.4rem, 2.4vw, 2rem); }
.v2-wwd-lists { display: grid; gap: 1.5rem; margin-top: 1.75rem; }
.v2-wwd-chips { display: flex; flex-wrap: wrap; gap: 0.45rem; margin: 0.7rem 0 0; padding: 0; list-style: none; }
.v2-wwd-fns { display: grid; gap: 1.5rem; margin: 1.5rem 0 0; padding: 0; list-style: none; }
.v2-wwd-fns img { aspect-ratio: 4 / 3; }
.v2-wwd-fns h3 { margin-top: 0.8rem; }
.v2-wwd-fns p { margin-top: 0.35rem; max-width: 22rem; }
@media (min-width: 48rem) {
  .v2-wwd-lists { grid-template-columns: 1.2fr 1fr; gap: 2.5rem; }
  .v2-wwd-fns { grid-template-columns: repeat(3, 1fr); }
}
</style>
