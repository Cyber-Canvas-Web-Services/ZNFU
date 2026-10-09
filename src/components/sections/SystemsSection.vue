<script setup>
/**
 * Member systems — one card per system.
 *
 * The three systems (e-Farm Prices, e-Transport and ZNFU Market) are shown as
 * a set of cards on a single dark band. Every title and description comes from
 * the shared data unchanged, and each card keeps its system’s anchor id so the
 * footer’s deep links (and the nav’s #systems link) still land correctly.
 */
import AppIcon from "@/components/ui/AppIcon.vue";
import StackedPanel from "@/components/sections/StackedPanel.vue";
import { systems } from "@/data/home";

/**
 * Also stands alone at /systems. The band only shows its eyebrow mid-stack,
 * so in that case the heading and lede already held in the data are shown too,
 * giving the page its single <h1>.
 */
defineProps({
  standalone: { type: Boolean, default: false },
});
</script>

<template>
  <StackedPanel
    id="systems"
    surface="bg-forest-950"
    tone="text-cream-50"
    compact
    :first="standalone"
  >
    <div
      class="glow -left-40 top-1/4 h-[420px] w-[420px] bg-[radial-gradient(closest-side,rgba(58,125,78,0.15),transparent)]"
      aria-hidden="true"
    />

    <div class="relative">
      <p class="eyebrow text-maize-400" v-reveal>{{ systems.eyebrow }}</p>

      <template v-if="standalone">
        <h1
          class="section-title mt-4 max-w-2xl text-cream-50"
          v-reveal="{ delay: 60 }"
        >
          {{ systems.title }}
        </h1>
        <p
          class="lede mt-4 max-w-2xl text-cream-200/70"
          v-reveal="{ delay: 110 }"
        >
          {{ systems.lede }}
        </p>
      </template>

      <div class="mt-10 grid gap-6 md:grid-cols-3 lg:mt-12">
        <!-- The middle tile is inverted to off-white, and every colour inside
             it is set from the same `inverted` flag so the card can never end
             up half-switched — cream background with cream text, say. -->
        <article
          v-for="(item, index) in systems.items"
          :id="item.id"
          :key="item.id"
          v-reveal="{ delay: index * 110 }"
          class="group flex flex-col rounded-3xl p-7 ring-1 transition-transform duration-500 hover:-translate-y-1.5"
          :class="
            index === 1
              ? 'bg-cream-100 ring-forest-950/10'
              : 'bg-forest-900/60 ring-white/10'
          "
        >
          <div class="flex items-center justify-between gap-4">
            <span
              class="grid h-11 w-11 place-items-center rounded-full shadow-lg"
              :class="
                index === 1
                  ? 'bg-forest-800 text-maize-300'
                  : 'bg-maize-400 text-forest-950'
              "
            >
              <AppIcon :name="item.icon" class="h-5 w-5" />
            </span>
            <p
              class="font-display text-xs font-semibold tracking-[0.24em]"
              :class="index === 1 ? 'text-ink-900/50' : 'text-cream-100/55'"
            >
              {{ item.number }} / 03
            </p>
          </div>

          <h2
            class="mt-6 font-display text-xl font-medium tracking-[-0.02em]"
            :class="index === 1 ? 'text-ink-900' : 'text-cream-50'"
          >
            {{ item.title }}
          </h2>
          <p
            class="mt-3 text-[0.92rem] leading-relaxed"
            :class="index === 1 ? 'text-ink-900/65' : 'text-cream-200/70'"
          >
            {{ item.body }}
          </p>
        </article>
      </div>
    </div>
  </StackedPanel>
</template>
