<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";

import { usePrefersReducedMotion } from "@/composables/useMediaQuery";
import { homeIntroduction, partners } from "@/data/home";

const partnerLogos = computed(() =>
  partners.items.filter((partner) => partner.logo),
);
const beforeWords = computed(() =>
  homeIntroduction.secondaryBeforeImage.trim().split(/\s+/),
);
const afterWords = computed(() =>
  homeIntroduction.secondaryAfterImage.trim().split(/\s+/),
);
const totalAnimatedWords = computed(
  () => beforeWords.value.length + afterWords.value.length,
);

const sectionEl = ref(null);
const statementEl = ref(null);
const revealProgress = ref(0);
const reducedMotion = usePrefersReducedMotion();

let animationFrame = null;

function greenVariant(src) {
  return src.replace(/\.webp$/, "-green.webp");
}

function wordColor(index) {
  if (reducedMotion.value) return "rgb(8 58 31)";

  const sweep = revealProgress.value * (totalAnimatedWords.value + 1);
  const mix = Math.min(1, Math.max(0, sweep - index));
  const muted = [112, 124, 116];
  const green = [8, 58, 31];
  const channel = (start, end) => Math.round(start + (end - start) * mix);

  return `rgb(${channel(muted[0], green[0])} ${channel(muted[1], green[1])} ${channel(muted[2], green[2])})`;
}

function updateRevealProgress() {
  animationFrame = null;

  if (reducedMotion.value) {
    revealProgress.value = 1;
    return;
  }

  const statement = statementEl.value;
  if (!statement) return;

  const rect = statement.getBoundingClientRect();
  const start = window.innerHeight * 0.86;
  const end = window.innerHeight * 0.22;
  revealProgress.value = Math.min(
    1,
    Math.max(0, (start - rect.top) / (start - end)),
  );
}

function queueRevealUpdate() {
  if (animationFrame !== null) return;
  animationFrame = window.requestAnimationFrame(updateRevealProgress);
}

onMounted(async () => {
  await nextTick();
  updateRevealProgress();
  window.addEventListener("scroll", queueRevealUpdate, { passive: true });
  window.addEventListener("resize", queueRevealUpdate);
});

watch(reducedMotion, queueRevealUpdate);

onBeforeUnmount(() => {
  window.removeEventListener("scroll", queueRevealUpdate);
  window.removeEventListener("resize", queueRevealUpdate);
  if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
});
</script>

<template>
  <section
    ref="sectionEl"
    class="home-introduction bg-cream-100 text-ink-900"
    aria-labelledby="home-introduction-heading"
  >
    <div class="shell">
      <div class="home-introduction__partners">
        <p class="home-introduction__partner-copy">
          <span class="font-semibold text-ink-900">
            {{ homeIntroduction.partnerLead.title }}
          </span>
          <span class="text-[#6e7771]">
            {{ homeIntroduction.partnerLead.subtitle }}
          </span>
        </p>

        <div class="home-introduction__logo-viewport">
          <div class="home-introduction__logo-track">
            <ul
              v-for="groupIndex in 2"
              :key="groupIndex"
              class="home-introduction__logos"
              :aria-label="groupIndex === 1 ? 'ZNFU partners' : undefined"
              :aria-hidden="groupIndex === 2 ? 'true' : undefined"
            >
              <li
                v-for="partner in partnerLogos"
                :key="`${groupIndex}-${partner.name}`"
                class="home-introduction__logo"
              >
                <img
                  :src="greenVariant(partner.logo)"
                  :alt="groupIndex === 1 ? partner.name : ''"
                  loading="eager"
                  decoding="async"
                />
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="home-introduction__mission" v-reveal>
        <p class="home-introduction__badge">
          <span aria-hidden="true" />
          {{ homeIntroduction.badge }}
        </p>

        <h2
          id="home-introduction-heading"
          ref="statementEl"
          class="home-introduction__statement"
        >
          <span class="home-introduction__statement-primary">
            {{ homeIntroduction.primary }}
          </span>
          {{ " " }}
          <span
            class="home-introduction__statement-secondary"
            :aria-label="`${homeIntroduction.secondaryBeforeImage} ${homeIntroduction.secondaryAfterImage}`"
          >
            <span aria-hidden="true">
              <template v-for="(word, index) in beforeWords" :key="`before-${index}`">
                <span
                  class="home-introduction__animated-word"
                  :style="{ color: wordColor(index) }"
                >{{ word }}</span>
                {{ " " }}
              </template>
              <span class="home-introduction__image-chip">
                <img
                  :src="homeIntroduction.image"
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </span>
              {{ " " }}
              <template v-for="(word, index) in afterWords" :key="`after-${index}`">
                <span
                  class="home-introduction__animated-word"
                  :style="{ color: wordColor(beforeWords.length + index) }"
                >{{ word }}</span>
                <template v-if="index < afterWords.length - 1">{{ " " }}</template>
              </template>
            </span>
          </span>
        </h2>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-introduction {
  border-top: 1px solid rgb(4 32 21 / 0.08);
}

.home-introduction > .shell {
  padding-block: clamp(2.5rem, 4vw, 3.25rem);
}

.home-introduction__partners {
  display: grid;
  grid-template-columns: minmax(9rem, 0.8fr) minmax(0, 4fr);
  align-items: center;
  gap: 2rem clamp(2.5rem, 4vw, 3.5rem);
  padding-bottom: clamp(2rem, 3vw, 2.5rem);
  border-bottom: 1px solid rgb(4 32 21 / 0.1);
}

.home-introduction__partner-copy {
  display: flex;
  flex-direction: column;
  margin: 0;
  font-size: clamp(1rem, 1.05vw, 1.25rem);
  line-height: 1.3;
}

.home-introduction__logo-viewport {
  min-width: 0;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  scrollbar-width: none;
}

.home-introduction__logo-viewport::-webkit-scrollbar {
  display: none;
}

.home-introduction__logo-track {
  display: flex;
  width: max-content;
  animation: partner-logo-slide 38s linear infinite;
  will-change: transform;
}

.home-introduction__logo-viewport:hover .home-introduction__logo-track {
  animation-play-state: paused;
}

.home-introduction__logos {
  display: flex;
  flex: none;
  align-items: center;
  gap: clamp(1.25rem, 3vw, 3rem);
  margin: 0;
  padding: 0 clamp(1.25rem, 3vw, 3rem) 0 0;
  list-style: none;
}

.home-introduction__logo {
  display: flex;
  flex: 0 0 clamp(9rem, 11vw, 11rem);
  align-items: center;
  justify-content: center;
}

.home-introduction__logo img {
  width: 100%;
  max-width: 11rem;
  height: 4.5rem;
  object-fit: contain;
  opacity: 0.86;
}

@keyframes partner-logo-slide {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(-50%, 0, 0);
  }
}

.home-introduction__mission {
  width: 100%;
  padding-top: clamp(2.25rem, 3.5vw, 3rem);
}

.home-introduction__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  margin: 0 0 clamp(1.25rem, 2.5vw, 1.75rem);
  padding: 0.42rem 0.9rem;
  border: 1px solid rgb(4 32 21 / 0.14);
  border-radius: 9999px;
  background: rgb(255 255 255 / 0.88);
  box-shadow: 0 8px 24px -18px rgb(4 32 21 / 0.4);
  color: #333d37;
  font-size: 0.8125rem;
  font-weight: 520;
  line-height: 1.2;
}

.home-introduction__badge span {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 9999px;
  background: var(--color-forest-700);
}

.home-introduction__statement {
  margin: 0;
  font-family: var(--font-sans);
  font-size: clamp(1.9rem, 3.45vw, 3rem);
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: -0.028em;
}

.home-introduction__statement-primary {
  color: var(--color-forest-800);
  font-weight: 520;
}

.home-introduction__statement-secondary {
  color: #707c74;
}

.home-introduction__animated-word {
  transition: color 120ms linear;
}

.home-introduction__image-chip {
  display: inline-block;
  width: clamp(4.5rem, 7vw, 5.5rem);
  height: clamp(1.9rem, 3.2vw, 2.35rem);
  margin: 0 0.18em;
  overflow: hidden;
  border: 2px solid var(--color-forest-800);
  border-radius: 9999px;
  vertical-align: -0.12em;
  box-shadow: 0 8px 20px -12px rgb(4 32 21 / 0.55);
}

.home-introduction__image-chip img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 66%;
}

@media (max-width: 63.999rem) {
  .home-introduction__partners {
    grid-template-columns: 1fr;
  }

  .home-introduction__logo-track {
    animation-duration: 32s;
  }
}

@media (max-width: 39.999rem) {
  .home-introduction__partners {
    gap: 1.75rem;
  }

  .home-introduction__logo {
    flex-basis: 9rem;
  }

  .home-introduction__logo img {
    height: 4rem;
  }

  .home-introduction__statement {
    font-size: clamp(1.85rem, 8.4vw, 2.35rem);
    line-height: 1.22;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-introduction__logo-track {
    animation: none;
  }

  .home-introduction__logos[aria-hidden="true"] {
    display: none;
  }
}
</style>
