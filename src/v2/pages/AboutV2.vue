<script setup>
/** Design 2 — About. Story panel, footage, values, journey tiles, portraits, partner marquee. */
import { ref } from "vue";

import FieldBand from "@/components/sections/FieldBand.vue";
import { useFocusMarquee } from "@/composables/useFocusMarquee";
import { SAMPLE_CONTENT } from "@/data/about";
import { partners, purposeVision } from "@/data/home";

const mission = purposeVision.blocks[0].body;
const vision = purposeVision.blocks[1].body;

const items = partners.items.map((p) => ({ ...p, logo: p.logo?.replace(/\.webp$/, "-color.webp") }));
const looped = [...items, ...items];
const box = ref(null);
const track = ref(null);
useFocusMarquee(box, track);

const facts = ["Founded 1905", "Based in Lusaka", "Non-political", "Member-led"];
</script>

<template>
  <div class="v2">
    <section id="about" class="v2-panel v2-panel--first v2-panel--forest" aria-labelledby="v2-ab-h">
      <div class="v2-shell">
        <h1 id="v2-ab-h" class="v2-h1">Our Story</h1>
        <ul class="v2-ab-facts"><li v-for="f in facts" :key="f" class="v2-chip">{{ f }}</li></ul>
        <div class="v2-ab-story">
          <p v-for="(p, i) in SAMPLE_CONTENT.storyParagraphs" :key="i" class="v2-lede" style="opacity: 0.85">{{ p }}</p>
        </div>
      </div>
    </section>

    <div id="about-purpose" class="v2-panel v2-ab-footage">
      <FieldBand standalone :mission="mission" :vision="vision" />
    </div>

    <section class="v2-panel v2-panel--maize" aria-labelledby="v2-val-h">
      <div class="v2-shell">
        <h2 id="v2-val-h" class="v2-h2">What we stand for</h2>
        <ul class="v2-ab-values">
          <li v-for="v in SAMPLE_CONTENT.values" :key="v.name">
            <p class="v2-h3">{{ v.name }}</p>
            <p class="v2-small" style="opacity: 0.85">{{ v.description }}</p>
          </li>
        </ul>
      </div>
    </section>

    <section class="v2-panel" aria-labelledby="v2-jr-h">
      <div class="v2-shell">
        <h2 id="v2-jr-h" class="v2-h2">Our journey</h2>
        <ol class="v2-ab-miles">
          <li v-for="m in SAMPLE_CONTENT.milestones" :key="m.year">
            <p class="v2-ab-year">{{ m.year }}</p>
            <h3 class="v2-h3">{{ m.title }}</h3>
            <p class="v2-small">{{ m.description }}</p>
          </li>
        </ol>
      </div>
    </section>

    <section class="v2-panel v2-panel--leaf" aria-labelledby="v2-pp-h">
      <div class="v2-shell">
        <h2 id="v2-pp-h" class="v2-h2">The people serving the Union</h2>
        <ul class="v2-ab-people">
          <li v-for="p in SAMPLE_CONTENT.leadership" :key="p.name">
            <img class="v2-img" :src="p.image" :alt="p.name" width="560" height="700" loading="lazy" />
            <p class="v2-h3">{{ p.name }}</p>
            <p class="v2-small">{{ p.role }}</p>
          </li>
        </ul>
      </div>
    </section>

    <section class="v2-panel" aria-labelledby="v2-wk-h">
      <div class="v2-shell">
        <h2 id="v2-wk-h" class="v2-small" style="text-align: center; font-weight: 650; opacity: 1">{{ partners.title }}</h2>
        <div ref="box" class="v2-ab-marquee">
          <ul ref="track">
            <li v-for="(p, i) in looped" :key="i" :aria-hidden="i >= items.length || undefined">
              <img v-if="p.logo" :src="p.logo" :alt="p.name" />
              <span v-else>{{ p.name }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.v2-ab-facts { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 1.4rem 0 0; padding: 0; list-style: none; }
.v2-ab-story { display: grid; gap: 1rem 3rem; max-width: 64rem; margin-top: 1.4rem; }
.v2-ab-footage { padding: 0; overflow: hidden; background: var(--v2-forest-deep); }
.v2-ab-values { display: grid; gap: 0.8rem; margin: 1.5rem 0 0; padding: 0; list-style: none; }
.v2-ab-values li { display: grid; gap: 0.5rem; padding: 1.4rem; border-radius: 22px; background: rgb(255 255 255 / 0.5); }
.v2-ab-values .v2-h3 { font-size: clamp(1.4rem, 2vw, 1.75rem); }
.v2-ab-values .v2-small { font-size: var(--page-lede); opacity: 0.85; }
.v2-ab-miles { display: grid; gap: 0.8rem; margin: 1.5rem 0 0; padding: 0; list-style: none; }
.v2-ab-miles li { display: grid; gap: 0.4rem; align-content: start; padding: 1.3rem; border-radius: 22px; background: var(--v2-page); }
.v2-ab-year { font-size: clamp(2.2rem, 4vw, 3.4rem); font-weight: 650; letter-spacing: -0.05em; line-height: 1; color: var(--v2-forest); }
.v2-ab-people { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem 0.8rem; margin: 1.5rem 0 0; padding: 0; list-style: none; }
.v2-ab-people img { aspect-ratio: 4 / 5; object-position: center 20%; margin-bottom: 0.6rem; }
.v2-ab-marquee { margin-top: 0.8rem; overflow: hidden; -webkit-mask-image: linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent); mask-image: linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent); }
.v2-ab-marquee ul { display: flex; width: max-content; margin: 0; padding: 0; list-style: none; will-change: transform; }
.v2-ab-marquee li { --focus: 0; display: grid; width: 12rem; min-width: 12rem; min-height: 5.5rem; place-items: center; padding: 0.5rem 0.75rem; font-size: 0.8rem; font-weight: 600; text-align: center; filter: grayscale(calc(1 - var(--focus))); opacity: calc(0.4 + 0.6 * var(--focus)); transform: scale(calc(0.88 + 0.16 * var(--focus))); }
.v2-ab-marquee img { width: 100%; max-width: 10rem; height: 4rem; object-fit: contain; }
@media (min-width: 40rem) { .v2-ab-story { grid-template-columns: repeat(2, 1fr); } .v2-ab-values, .v2-ab-miles { grid-template-columns: repeat(2, 1fr); } .v2-ab-people { grid-template-columns: repeat(4, 1fr); gap: 0.8rem; } }
@media (min-width: 64rem) { .v2-ab-values { grid-template-columns: repeat(3, 1fr); } .v2-ab-miles { grid-template-columns: repeat(3, 1fr); } }
</style>
