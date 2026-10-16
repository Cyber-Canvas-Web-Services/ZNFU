<script setup>
/** Design 2 — Systems. Price board panel, the journey as three tiles, FAQ. */
import { ArrowRight } from "@lucide/vue";

import AppIcon from "@/components/ui/AppIcon.vue";
import { systems } from "@/data/home";

const priceBook = systems.items[0];
const faqs = [
  { q: "Who can use the systems?", a: "They are member services, open to members of the Union. Membership is open to any person or organisation in the business of agriculture in Zambia." },
  { q: "How do I get access?", a: "Access is arranged through the Secretariat. [TO CONFIRM — the exact steps, timelines and any sign-in details.]" },
  { q: "Do the systems cost extra?", a: "Pricing is set by the Secretariat. [TO CONFIRM — whether the systems are included in the subscription or charged separately.]" },
  { q: "Who do I contact for help?", a: "Contact the ZNFU Secretariat. [TO CONFIRM — the named support contact or desk.]" },
];
</script>

<template>
  <div class="v2">
    <section id="systems" class="v2-panel v2-panel--first v2-panel--forest" aria-labelledby="v2-sys-h">
      <div class="v2-shell v2-grid-2">
        <div>
          <h1 id="v2-sys-h" class="v2-h1">{{ systems.title }}</h1>
          <p class="v2-lede" style="margin-top: 1.1rem">{{ systems.lede }}</p>
        </div>
        <div class="v2-board">
          <p class="v2-board__title">e-Farm Prices <span>Sample figures</span></p>
          <table>
            <thead><tr><th scope="col">Commodity</th><th scope="col">Market</th><th scope="col">Price</th></tr></thead>
            <tbody>
              <tr v-for="row in priceBook.prices" :key="row.commodity">
                <th scope="row">{{ row.commodity }}</th>
                <td>{{ row.market }}</td>
                <td>{{ row.price }} <small>/ {{ row.unit }}</small></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="v2-panel" aria-labelledby="v2-journey-h">
      <div class="v2-shell">
        <h2 id="v2-journey-h" class="v2-h2">From the field to the buyer</h2>
        <ol class="v2-tiles">
          <li v-for="(item, index) in systems.items" :id="item.id" :key="item.id" class="v2-tile">
            <img class="v2-img" :src="item.image" :alt="item.imageAlt" width="800" height="600" loading="lazy" />
            <div class="v2-tile__head">
              <span class="v2-tile__num" aria-hidden="true">{{ index + 1 }}</span>
              <AppIcon :name="item.icon" class="v2-tile__icon" />
            </div>
            <h3 class="v2-h3">{{ item.title }}</h3>
            <p class="v2-small">{{ item.body }}</p>
            <ul class="v2-tile__list">
              <li v-for="f in item.features" :key="f">{{ f }}</li>
            </ul>
          </li>
        </ol>
      </div>
    </section>

    <section class="v2-panel v2-panel--maize" aria-labelledby="v2-faq-h">
      <div class="v2-shell v2-faq">
        <div>
          <h2 id="v2-faq-h" class="v2-h2">Questions</h2>
          <p class="v2-small" style="margin: 0.9rem 0 1.1rem; opacity: 0.85">
            The systems are member services. Membership is open to any person or organisation in the business of agriculture in Zambia.
          </p>
          <a href="/membership" class="v2-btn v2-btn--forest">See membership options <ArrowRight class="h-4 w-4" aria-hidden="true" /></a>
        </div>
        <div>
          <details v-for="f in faqs" :key="f.q">
            <summary>{{ f.q }}</summary>
            <p>{{ f.a }}</p>
          </details>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.v2-board { padding: clamp(1rem, 2vw, 1.6rem); border-radius: 22px; background: #fff; color: var(--v2-ink); }
.v2-board__title { display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; font-size: 1.4rem; font-weight: 650; letter-spacing: -0.03em; }
.v2-board__title span { font-size: 0.8rem; font-weight: 500; opacity: 0.55; }
.v2-board table { width: 100%; margin-top: 0.75rem; border-collapse: collapse; font-size: 0.95rem; text-align: left; }
.v2-board th, .v2-board td { padding: 0.8rem 0; border-top: 1.5px solid rgb(16 36 26 / 0.12); }
.v2-board thead th { border-top: 0; padding-bottom: 0.3rem; font-size: 0.8rem; font-weight: 500; opacity: 0.55; }
.v2-board td:last-child, .v2-board thead th:last-child { text-align: right; font-variant-numeric: tabular-nums; font-weight: 650; }
.v2-board small { font-weight: 400; opacity: 0.55; }

.v2-tiles { display: grid; gap: 1rem; margin: 1.5rem 0 0; padding: 0; list-style: none; }
.v2-tile { display: grid; gap: 0.55rem; align-content: start; padding: 0.9rem 0.9rem 1.4rem; border-radius: 22px; background: var(--v2-page); scroll-margin-top: 6rem; }
.v2-tile img { aspect-ratio: 16 / 10; }
.v2-tile__head { display: flex; justify-content: space-between; align-items: center; margin-top: 0.4rem; padding-inline: 0.4rem; }
.v2-tile__num { display: grid; width: 2.4rem; height: 2.4rem; place-items: center; border-radius: 50%; background: var(--v2-forest); color: var(--v2-maize); font-weight: 650; }
.v2-tile__icon { width: 1.5rem; height: 1.5rem; color: var(--v2-forest); }
.v2-tile h3, .v2-tile p, .v2-tile__list { padding-inline: 0.4rem; }
.v2-tile__list { display: grid; gap: 0.3rem; margin: 0.4rem 0 0; list-style: none; font-size: 0.9rem; }
.v2-tile__list li { display: flex; gap: 0.55rem; }
.v2-tile__list li::before { flex: none; width: 0.4rem; height: 0.4rem; margin-top: 0.5rem; border-radius: 50%; background: var(--v2-maize); content: ""; }

.v2-faq { display: grid; gap: 1.5rem; }
.v2-faq details { border-top: 1.5px solid rgb(16 36 26 / 0.3); }
.v2-faq details:last-child { border-bottom: 1.5px solid rgb(16 36 26 / 0.3); }
.v2-faq summary { display: flex; justify-content: space-between; gap: 1rem; padding-block: 1.05rem; font-size: 1.1rem; font-weight: 600; cursor: pointer; list-style: none; }
.v2-faq summary::-webkit-details-marker { display: none; }
.v2-faq summary::after { content: "+"; font-size: 1.5rem; line-height: 1; }
.v2-faq details[open] summary::after { content: "−"; }
.v2-faq details p { max-width: 38rem; padding-bottom: 1.1rem; line-height: 1.65; }

@media (min-width: 48rem) {
  .v2-tiles { grid-template-columns: repeat(3, 1fr); }
  .v2-faq { grid-template-columns: 0.8fr 1.2fr; gap: 3rem; }
}
</style>
