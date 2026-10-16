<script setup>
/**
 * Home hero ported from the Farm-Marketplace project.
 *
 * The reference uses Swiper for its fading image carousel and thumbnail rail.
 * This Vue version keeps the same composition and timing without adding a new
 * dependency: four full-bleed slides, a five-second progress cycle, and a
 * responsive thumbnail control strip. Rotation pauses off-screen, in a hidden
 * tab, and for visitors who prefer reduced motion.
 */
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import {
  Megaphone,
  Sprout,
  TrendingUp,
  Users,
} from "@lucide/vue";

import { useInView } from "@/composables/useInView";
import { usePrefersReducedMotion } from "@/composables/useMediaQuery";
import { contact, hero, media } from "@/data/home";

const SLIDE_MS = 5000;

const featureItems = [
  { label: "Farmer Voice", icon: Megaphone },
  { label: "Market Prices", icon: TrendingUp },
  { label: "Member Support", icon: Users },
  { label: "Sustainable Farming", icon: Sprout },
];

const heroEl = ref(null);
const thumbRail = ref(null);
const activeIndex = ref(0);
const progressCycle = ref(0);
const reducedMotion = usePrefersReducedMotion();
const isInView = useInView(heroEl, { rootMargin: "200px" });

const rotating = computed(
  () => !reducedMotion.value && media.heroSlides.length > 1,
);

const headlineLines = computed(() => {
  const [first, ...rest] = hero.title.split(", ");
  return rest.length ? [`${first},`, rest.join(", ")] : [hero.title];
});

const primaryPhone = computed(() => contact.phones[0]);
const primaryPhoneHref = computed(
  () => `tel:${primaryPhone.value.replace(/\s/g, "")}`,
);

let timer = null;

function advance() {
  activeIndex.value = (activeIndex.value + 1) % media.heroSlides.length;
  progressCycle.value += 1;
}

function stopRotation() {
  if (!timer) return;
  window.clearInterval(timer);
  timer = null;
}

function startRotation() {
  stopRotation();
  if (!rotating.value || !isInView.value) return;
  timer = window.setInterval(advance, SLIDE_MS);
}

function selectSlide(index) {
  activeIndex.value = index;
  progressCycle.value += 1;
  startRotation();
}

function handleVisibilityChange() {
  if (document.visibilityState === "visible") startRotation();
  else stopRotation();
}

watch(
  [isInView, rotating],
  () => {
    if (isInView.value) startRotation();
    else stopRotation();
  },
  { flush: "post" },
);

watch(activeIndex, async (index) => {
  await nextTick();
  const rail = thumbRail.value;
  const target = rail?.querySelector(`[data-slide-index="${index}"]`);
  if (!rail || !target || rail.scrollWidth <= rail.clientWidth) return;

  rail.scrollTo({
    left: target.offsetLeft - (rail.clientWidth - target.clientWidth) / 2,
    behavior: reducedMotion.value ? "auto" : "smooth",
  });
});

onMounted(() => {
  document.addEventListener("visibilitychange", handleVisibilityChange);
});

onBeforeUnmount(() => {
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  stopRotation();
});
</script>

<template>
  <section
    id="hero"
    ref="heroEl"
    class="market-hero relative isolate min-h-[clamp(34rem,80svh,48rem)] overflow-hidden bg-[#151515] text-white"
    aria-labelledby="hero-heading"
  >
    <!-- Full-height fading slider from the Farm-Marketplace hero. -->
    <div class="absolute inset-0 z-0" aria-hidden="true">
      <img
        v-for="(src, index) in media.heroSlides"
        :key="src"
        :src="src"
        alt=""
        class="absolute inset-0 h-full w-full object-cover transition-opacity duration-[800ms] ease-in-out"
        :class="activeIndex === index ? 'opacity-100' : 'opacity-0'"
        :loading="index === 0 ? undefined : 'lazy'"
        :fetchpriority="index === 0 ? 'high' : undefined"
        decoding="async"
      />

      <div class="market-hero__shade market-hero__shade--top absolute inset-0" />
      <div
        class="market-hero__shade market-hero__shade--bottom absolute inset-0"
      />
    </div>

    <!-- Text overlay: top-right tagline and bottom-left headline. -->
    <div class="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      <p class="market-hero__tagline">
        {{ hero.tagline }}
      </p>

      <div class="market-hero__content">
        <h1 id="hero-heading" class="market-hero__headline">
          <template v-for="(line, index) in headlineLines" :key="line">
            <span>{{ line }}</span>
            <br v-if="index < headlineLines.length - 1" />
          </template>
        </h1>

        <div class="pointer-events-auto flex flex-wrap items-center gap-4 sm:gap-5">
          <a :href="hero.primaryCta.href" class="market-hero__primary">
            <span class="market-hero__primary-dot" aria-hidden="true" />
            {{ hero.primaryCta.label }}
          </a>

          <a :href="primaryPhoneHref" class="market-hero__phone">
            Call us:
            <span class="font-semibold">{{ primaryPhone }}</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Timed progress and thumbnail navigation. -->
    <div class="market-hero__controls absolute inset-x-0 bottom-0 z-20">
      <div class="market-hero__progress-track">
        <div
          v-if="rotating"
          :key="progressCycle"
          class="market-hero__progress-fill"
        />
      </div>

      <div ref="thumbRail" class="market-hero__thumb-rail">
        <button
          v-for="(item, index) in featureItems"
          :key="item.label"
          type="button"
          class="market-hero__thumb"
          :class="{ 'market-hero__thumb--active': activeIndex === index }"
          :data-slide-index="index"
          :aria-label="`Show slide ${index + 1}: ${item.label}`"
          :aria-pressed="activeIndex === index"
          @click="selectSlide(index)"
        >
          <component :is="item.icon" class="market-hero__thumb-icon" />
          <span class="market-hero__thumb-label">{{ item.label }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.market-hero__shade--top {
  background: linear-gradient(
    to top,
    transparent 40%,
    rgb(21 21 21 / 0.8) 100%
  );
}

.market-hero__shade--bottom {
  background: linear-gradient(
    to bottom,
    transparent 35%,
    rgb(21 21 21 / 0.9) 90%
  );
}

.market-hero__tagline {
  position: absolute;
  top: clamp(6.5rem, 8vw, 8rem);
  right: max(var(--shell-pad), calc((100% - var(--shell-max)) / 2 + var(--shell-pad)));
  max-width: 20rem;
  margin: 0;
  color: rgb(255 255 255 / 0.82);
  font-size: var(--page-lede);
  font-weight: 500;
  line-height: 1.65;
  text-align: right;
}

.market-hero__content {
  position: absolute;
  right: max(var(--shell-pad), calc((100% - var(--shell-max)) / 2 + var(--shell-pad)));
  bottom: clamp(9.5rem, 20vh, 13rem);
  left: max(var(--shell-pad), calc((100% - var(--shell-max)) / 2 + var(--shell-pad)));
  display: flex;
  flex-direction: column;
  gap: clamp(1.25rem, 3vw, 2.25rem);
  pointer-events: none;
}

.market-hero__headline {
  max-width: 56.25rem;
  margin: 0;
  color: var(--color-maize-400);
  font-family: var(--font-display);
  font-size: clamp(2.25rem, 3.8vw, 3.5rem);
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.02;
}

.market-hero__primary {
  display: inline-flex;
  align-items: center;
  min-height: 2.5rem;
  gap: 0.625rem;
  padding: 0 1.375rem;
  border-radius: 3px;
  background: #fff;
  color: var(--color-forest-800);
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.3s ease;
}

.market-hero__primary:hover {
  opacity: 0.88;
}

.market-hero__primary-dot {
  width: 0.5rem;
  height: 0.5rem;
  flex: 0 0 auto;
  border-radius: 9999px;
  background: var(--color-forest-800);
}

.market-hero__phone {
  color: rgb(255 255 255 / 0.85);
  font-size: clamp(0.8125rem, 1.1vw, 0.9375rem);
  font-weight: 500;
  letter-spacing: 0.01em;
  text-decoration: none;
  transition: color 0.3s ease;
}

.market-hero__phone:hover {
  color: var(--color-maize-300);
}

.market-hero__progress-track {
  height: 1px;
  margin: 0 max(var(--shell-pad), calc((100% - var(--shell-max)) / 2 + var(--shell-pad))) 0.9375rem;
  overflow: hidden;
  background: rgb(255 255 255 / 0.3);
}

.market-hero__progress-fill {
  width: 100%;
  height: 100%;
  transform-origin: left;
  background: var(--color-maize-400);
  animation: market-hero-progress 5s linear forwards;
}

.market-hero__thumb-rail {
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
  scroll-snap-type: x mandatory;
}

.market-hero__thumb-rail::-webkit-scrollbar {
  display: none;
}

.market-hero__thumb {
  display: flex;
  flex: 0 0 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 0;
  padding: clamp(1rem, 1.5vw, 1.5rem) 1rem;
  border: 0;
  background: transparent;
  color: rgb(255 255 255 / 0.5);
  cursor: pointer;
  scroll-snap-align: center;
  transition:
    color 375ms cubic-bezier(0.7, 0, 0.3, 1),
    transform 375ms cubic-bezier(0.7, 0, 0.3, 1);
}

.market-hero__thumb:hover {
  color: var(--color-maize-300);
}

.market-hero__thumb--active {
  color: #fff;
  transform: translateY(-2px);
}

.market-hero__thumb-icon {
  width: clamp(1.75rem, 1.6vw, 2.25rem);
  height: clamp(1.75rem, 1.6vw, 2.25rem);
  stroke-width: 2.2;
}

.market-hero__thumb-label {
  max-width: 12rem;
  margin-top: clamp(0.625rem, 0.8vw, 0.875rem);
  font-family: var(--font-display);
  font-size: clamp(0.875rem, 0.9vw, 1rem);
  font-weight: 500;
  line-height: 1.2;
  text-align: center;
}

@keyframes market-hero-progress {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

@media (min-width: 30rem) {
  .market-hero__thumb {
    flex-basis: 50%;
  }
}

@media (min-width: 48rem) {
  .market-hero__thumb {
    flex-basis: 33.3333%;
  }
}

@media (min-width: 64.0625rem) {
  /* The four tabs sit inside the same left and right edges as the headline
     and the page below, each one left-aligned in its quarter, so the first
     icon lines up with the headline instead of floating in the middle of a
     full-width column. */
  .market-hero__thumb-rail {
    margin-inline: max(var(--shell-pad), calc((100% - var(--shell-max)) / 2 + var(--shell-pad)));
  }

  .market-hero__thumb {
    flex-basis: 25%;
    align-items: flex-start;
    padding-inline: 0;
  }
}

@media (max-width: 47.999rem) {
  .market-hero__tagline {
    max-width: 14rem;
  }

  .market-hero__content {
    bottom: 12.5rem;
  }

  .market-hero__headline {
    font-size: clamp(2rem, 9vw, 2.75rem);
  }
}
</style>
