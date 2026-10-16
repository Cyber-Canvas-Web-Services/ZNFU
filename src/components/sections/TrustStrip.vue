<script setup>
import {
  BadgeCheck,
  Megaphone,
  ShieldCheck,
  TrendingUp,
  Users,
} from "@lucide/vue";

import { trustStrip } from "@/data/home";

const iconMap = {
  advocacy: Megaphone,
  members: Users,
  markets: TrendingUp,
  independent: ShieldCheck,
};
</script>

<template>
  <aside class="trust-strip" aria-label="Why farmers trust ZNFU">
    <div class="shell">
      <div class="trust-strip__scroller">
        <div class="trust-strip__inner">
          <div class="trust-strip__lead">
            <span class="trust-strip__established">Est.</span>
            <strong>{{ trustStrip.founded }}</strong>
            <span class="trust-strip__divider" aria-hidden="true" />
            <span>{{ trustStrip.foundedLabel }}</span>
          </div>

          <div
            v-for="item in trustStrip.items"
            :key="item.label"
            class="trust-strip__item"
          >
            <component :is="iconMap[item.icon]" aria-hidden="true" />
            <span>{{ item.label }}</span>
          </div>

          <div class="trust-strip__badge">
            <BadgeCheck aria-hidden="true" />
            <span>{{ trustStrip.badge }}</span>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.trust-strip {
  width: 100%;
  border-block: 1px solid rgb(4 32 21 / 0.09);
  background: #f4f5f4;
  color: #525b56;
}

.trust-strip__scroller {
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  scrollbar-width: none;
}

.trust-strip__scroller::-webkit-scrollbar {
  display: none;
}

.trust-strip__inner {
  display: flex;
  width: max-content;
  min-width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: clamp(1.75rem, 3.5vw, 4rem);
  padding-block: 0.95rem;
  white-space: nowrap;
}

.trust-strip__lead,
.trust-strip__item,
.trust-strip__badge {
  display: inline-flex;
  flex: none;
  align-items: center;
}

.trust-strip__lead {
  gap: 0.65rem;
  font-size: clamp(0.8125rem, 0.95vw, 0.9375rem);
  font-weight: 520;
}

.trust-strip__established {
  color: var(--color-maize-400);
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.trust-strip__lead strong {
  color: var(--color-ink-900);
  font-size: clamp(0.9375rem, 1.15vw, 1.125rem);
  font-weight: 720;
}

.trust-strip__divider {
  width: 1px;
  height: 1.1rem;
  margin-inline: 0.2rem;
  background: rgb(4 32 21 / 0.16);
}

.trust-strip__item {
  gap: 0.55rem;
  font-size: clamp(0.8125rem, 0.95vw, 0.9375rem);
  font-weight: 520;
}

.trust-strip__item svg {
  width: 1.05rem;
  height: 1.05rem;
  color: var(--color-forest-700);
  stroke-width: 1.9;
}

.trust-strip__badge {
  gap: 0.45rem;
  padding: 0.35rem 0.7rem;
  border: 1px solid rgb(4 32 21 / 0.1);
  border-radius: 9999px;
  background: rgb(255 255 255 / 0.82);
  box-shadow: 0 6px 18px -14px rgb(4 32 21 / 0.4);
  color: var(--color-ink-900);
  font-size: 0.8125rem;
  font-weight: 650;
}

.trust-strip__badge svg {
  width: 0.95rem;
  height: 0.95rem;
  color: var(--color-forest-500);
  stroke-width: 2.2;
}

@media (max-width: 47.999rem) {
  .trust-strip__inner {
    justify-content: flex-start;
    gap: 1.75rem;
  }
}
</style>
