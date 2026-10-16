<script setup>
import { ArrowRight } from "@lucide/vue";

import { membership, stats } from "@/data/home";

function formatStat(item) {
  return `${item.prefix ?? ""}${item.value.toLocaleString("en-US")}${item.suffix ?? ""}`;
}
</script>

<template>
  <section class="membership-stats" aria-labelledby="membership-stats-title">
    <div class="shell">
      <div class="membership-stats__header">
        <h2 id="membership-stats-title" v-reveal>
          {{ membership.homeTitle }}
        </h2>

        <div class="membership-stats__intro" v-reveal="{ delay: 80 }">
          <p>{{ membership.homeLede }}</p>
          <div class="membership-stats__actions">
            <a :href="membership.cta.href" class="btn btn--forest">
              {{ membership.cta.label }}
            </a>
            <a :href="membership.secondaryCta.href" class="btn btn--outline">
              {{ membership.secondaryCta.label }}
            </a>
          </div>
        </div>
      </div>

      <div class="membership-stats__grid">
        <a
          :href="membership.cta.href"
          class="membership-stats__quick-link"
          aria-label="Apply for ZNFU membership"
        >
          <ArrowRight aria-hidden="true" />
        </a>

        <article
          v-for="(item, index) in stats.items"
          :key="item.label"
          class="membership-stats__card"
          v-reveal="{ delay: index * 70 }"
        >
          <strong>{{ formatStat(item) }}</strong>
          <span>{{ item.label }}</span>
        </article>
      </div>

      <div class="membership-stats__divider" aria-hidden="true">
        <span>Membership</span>
        <span class="membership-stats__line" />
        <span>Zambian agriculture</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.membership-stats {
  position: relative;
  z-index: 1;
  background: #f9fbf8;
  color: #1a201c;
  padding-block: clamp(4rem, 7vw, 6rem);
}

.membership-stats__header {
  display: grid;
  gap: 2rem;
  align-items: center;
  margin-bottom: clamp(3.5rem, 6vw, 5rem);
}

.membership-stats__header h2 {
  max-width: 37rem;
  color: var(--color-forest-950);
  font-family: var(--font-sans);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1.04;
}

.membership-stats__intro {
  max-width: 28rem;
}

.membership-stats__intro p {
  max-width: 25rem;
  color: #6e7771;
  font-size: clamp(0.875rem, 1.15vw, 1rem);
  line-height: 1.5;
}

.membership-stats__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.membership-stats__grid {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.membership-stats__card {
  display: flex;
  min-height: 9.5rem;
  flex-direction: column;
  justify-content: center;
  border: 1px solid rgb(4 32 21 / 0.035);
  border-radius: 1.25rem;
  background: #eaf3ec;
  padding: clamp(1.75rem, 3vw, 2.5rem);
}

.membership-stats__card strong {
  color: #1a201c;
  font-family: var(--font-sans);
  font-size: clamp(1.875rem, 3vw, 2.5rem);
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1;
}

.membership-stats__card span {
  margin-top: 0.65rem;
  color: #525b56;
  font-size: 0.875rem;
  font-weight: 520;
  line-height: 1.35;
}

.membership-stats__quick-link {
  display: none;
}

.membership-stats__divider {
  display: flex;
  align-items: center;
  gap: clamp(1rem, 2.5vw, 2rem);
  margin-top: clamp(3.5rem, 6vw, 5rem);
  color: var(--color-forest-950);
  font-size: 0.75rem;
  font-weight: 650;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.membership-stats__line {
  height: 1px;
  flex: 1;
  background: rgb(4 32 21 / 0.28);
}

@media (min-width: 40rem) {
  .membership-stats__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.25rem;
  }
}

@media (min-width: 64rem) {
  .membership-stats__header {
    grid-template-columns: minmax(0, 1.25fr) minmax(22rem, 0.75fr);
    justify-content: space-between;
  }

  .membership-stats__grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .membership-stats__quick-link {
    position: absolute;
    top: 50%;
    left: calc(25% - 1.625rem);
    z-index: 2;
    display: grid;
    width: 3.25rem;
    height: 3.25rem;
    place-items: center;
    translate: 0 -50%;
    border: 4px solid #f9fbf8;
    border-radius: 50%;
    background: #1a201c;
    box-shadow: 0 12px 28px rgb(4 32 21 / 0.2);
    color: #fff;
    transition:
      scale 180ms ease,
      background-color 180ms ease;
  }

  .membership-stats__quick-link:hover {
    scale: 1.08;
    background: var(--color-forest-700);
  }

  .membership-stats__quick-link svg {
    width: 1.25rem;
    height: 1.25rem;
  }
}
</style>
