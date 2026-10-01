<script setup>
import AppIcon from '@/components/ui/AppIcon.vue'
import StackedPanel from '@/components/sections/StackedPanel.vue'
import { whatWeDo } from '@/data/home'

/**
 * Copy for the three blocks below the mission cards.
 *
 * Every phrase is taken from the mission statement quoted above: the member
 * kinds it names, and the three aims it closes with. Nothing here adds a fact,
 * a number or a claim of its own.
 */
const missionTags = [
  'Individual farmers',
  'Corporations',
  'Companies',
  'Purveyors',
  'Other organisations involved in the business of agriculture',
]

const focusPillars = [
  {
    number: '01',
    title: 'Sustainable Agriculture',
    line: 'The Union works to achieve sustainable agriculture.',
  },
  {
    number: '02',
    title: 'Economic Development',
    line: 'The Union works to achieve economic development.',
  },
  {
    number: '03',
    title: 'Social Development',
    line: 'The Union works to achieve social development.',
  },
]

/**
 * Also stands alone at /what-we-do, where it heads the page: it then carries
 * the page’s single <h1> and drops the stacked-card edge meant for mid-stack.
 */
defineProps({
  standalone: { type: Boolean, default: false },
})
</script>

<template>
  <StackedPanel
    id="what-we-do"
    class="what-we-do-panel"
    surface="bg-cream-100"
    :first="standalone"
  >
    <div class="max-w-2xl" v-reveal>
      <p class="eyebrow text-forest-600">{{ whatWeDo.eyebrow }}</p>
      <component
        :is="standalone ? 'h1' : 'h2'"
        class="section-title mt-4 text-forest-950"
      >
        {{ whatWeDo.title }}
      </component>
      <p class="lede mt-4 text-ink-900/65">{{ whatWeDo.lede }}</p>
    </div>

    <div class="mt-10 grid gap-6 md:grid-cols-3 lg:mt-12">
      <article
        v-for="(item, index) in whatWeDo.items"
        :key="item.number"
        v-reveal="{ delay: index * 110 }"
        class="group flex flex-col overflow-hidden rounded-3xl bg-cream-50 shadow-soft ring-1 ring-forest-900/5 transition-transform duration-500 hover:-translate-y-1.5"
      >
        <div class="relative h-40 overflow-hidden lg:h-44">
          <img
            :src="item.image"
            :alt="item.imageAlt"
            class="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-forest-950/75 via-forest-950/10 to-transparent"
          />
          <span
            class="absolute left-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-maize-400 text-forest-950 shadow-lg"
          >
            <AppIcon :name="item.icon" class="h-5 w-5" />
          </span>
          <p
            class="absolute bottom-4 right-5 font-display text-sm font-semibold tracking-[0.2em] text-cream-100/80"
          >
            {{ item.number }}
          </p>
        </div>

        <div class="flex flex-1 flex-col p-6">
          <h3 class="font-display text-xl font-medium tracking-[-0.02em] text-forest-950">
            {{ item.title }}
          </h3>
          <p class="mt-3 text-[0.92rem] leading-relaxed text-ink-900/65">
            {{ item.body }}
          </p>
        </div>
      </article>
    </div>

    <!-- Who we represent — the member kinds named in the mission statement. -->
    <div class="mission-block" v-reveal>
      <h3 class="mission-block__heading">Who we represent</h3>
      <ul class="mission-tags">
        <li v-for="tag in missionTags" :key="tag" class="mission-tag">
          {{ tag }}
        </li>
      </ul>
    </div>

    <!-- Our focus — the three aims named at the close of the mission statement. -->
    <div class="mission-block" v-reveal="{ delay: 80 }">
      <h3 class="mission-block__heading">Our focus</h3>
      <ul class="focus-pillars">
        <li v-for="pillar in focusPillars" :key="pillar.number" class="focus-pillar">
          <p class="focus-pillar__number">{{ pillar.number }}</p>
          <h4 class="focus-pillar__title">{{ pillar.title }}</h4>
          <p class="focus-pillar__line">{{ pillar.line }}</p>
        </li>
      </ul>
    </div>

    <!-- Closing banner — same destination as the header’s “Join ZNFU” button. -->
    <div class="mission-banner" v-reveal="{ delay: 160 }">
      <p class="mission-banner__title">Join the Union</p>
      <a href="/apply-membership" class="btn btn--maize">Apply for membership</a>
    </div>
  </StackedPanel>
</template>

<style scoped>
/**
 * The three blocks below the mission cards: the member kinds, the three aims
 * and the closing banner.
 *
 * With those in place the panel holds well over a screen of content, so it
 * stays in normal flow. A panel pinned to the top of the viewport that is
 * taller than the screen traps everything below the fold — the same reason the
 * Apply for Membership and Types of Membership bands opt out of the pin.
 *
 * Only spacing, borders, flex/grid and type are set on the blocks themselves:
 * no overflow, height or transform, so nothing here can clip its content.
 */
.what-we-do-panel {
  position: relative;
}

.mission-block {
  margin-top: 3.5rem;
}

.mission-block__heading {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--color-forest-950);
}

.mission-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 1.25rem;
  padding: 0;
  list-style: none;
}

.mission-tag {
  border-radius: 9999px;
  border: 1px solid color-mix(in oklab, var(--color-forest-900) 15%, transparent);
  background-color: var(--color-cream-50);
  padding: 0.55rem 1.15rem;
  font-size: 0.9rem;
  color: var(--color-forest-950);
}

.focus-pillars {
  display: grid;
  gap: 2rem;
  margin-top: 1.5rem;
  padding: 0;
  list-style: none;
}

.focus-pillar__number {
  font-family: var(--font-display);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  color: var(--color-maize-600);
}

.focus-pillar__title {
  margin-top: 0.65rem;
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--color-forest-950);
}

.focus-pillar__line {
  margin-top: 0.5rem;
  font-size: 0.92rem;
  line-height: 1.6;
  color: color-mix(in oklab, var(--color-ink-900) 65%, transparent);
}

.mission-banner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  margin-top: 3.5rem;
  border-radius: 1.5rem;
  background-color: var(--color-forest-900);
  padding: 2rem 1.75rem;
}

.mission-banner__title {
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 2.6vw, 1.9rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--color-cream-50);
}

@media (min-width: 48rem) {
  .focus-pillars {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .mission-banner {
    padding: 2.25rem 2.5rem;
  }
}
</style>
