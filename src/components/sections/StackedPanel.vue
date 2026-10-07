<script setup>
/**
 * One screen of the stacked scroll sequence.
 *
 * On large screens each panel pins to the top of the viewport while the next
 * one slides up over it, so the page reads as cards stacking rather than a
 * flat list of sections. That requires the panel to fit the viewport: a sticky
 * panel taller than the screen pins its top edge and its lower half can never
 * be scrolled into view, which is why content belonging to one of these panels
 * is sized to a single screen.
 *
 * Below `lg` the panels are ordinary blocks in normal flow — at phone widths
 * the same content is far too tall to pin safely.
 *
 * Variants are props rather than extra classes so utilities can never collide:
 * two competing Tailwind classes on one element resolve by stylesheet order,
 * not by the order they appear in the attribute.
 */
defineProps({
  id: { type: String, default: undefined },
  /**
   * The first panel in a sequence sits flush with the section before it;
   * subsequent panels get a card edge so the stacking reads clearly.
   */
  first: { type: Boolean, default: false },
  /** Opaque surface, so the pinned panel beneath never shows through. */
  surface: { type: String, default: 'bg-cream-50' },
  /** Text colour context for the panel. */
  tone: { type: String, default: 'text-ink-900' },
  /**
   * A short band rather than a full screen. Used where the content is only a
   * few lines and a full-height panel would read as an empty page.
   */
  compact: { type: Boolean, default: false },
  /**
   * Hand the whole panel to the slotted content, with no inner container or
   * padding — for panels that manage their own full-bleed layout.
   */
  bleed: { type: Boolean, default: false },
  /**
   * Force the card edge at every breakpoint instead of only from `lg` up.
   * The mobile stacking effect does not exist, so the edge is normally
   * desktop-only — but a panel that is deliberately *peeking* above the fold
   * on a phone needs it too, or the peek is just a flat change of colour.
   */
  topEdge: { type: Boolean, default: false },
  /**
   * Tighter vertical rhythm. For the panel that sits directly under the hero,
   * which has to get real content into the first screenful rather than spend
   * that space on padding.
   */
  dense: { type: Boolean, default: false },
})
</script>

<template>
  <section
    :id="id"
    class="relative isolate flex flex-col justify-center overflow-hidden motion-safe:lg:sticky motion-safe:lg:top-0"
    :class="[
      surface,
      tone,
      // Only one padding branch may apply: `p-0` and `py-*` are competing
      // utilities, and which one wins depends on stylesheet order rather than
      // the order they are written here.
      //
      // These paddings used to be 80/96/112px and every panel also carried
      // `lg:min-h-screen`. Together that meant a panel with 400px of content
      // was stretched to a full 800px screen and centred, leaving ~200px of
      // dead space above and below — which is what made the top of each
      // section look empty. The panel now takes its height from its content.
      bleed
        ? 'p-0'
        : compact
          ? 'py-8 lg:py-10'
          : dense
            ? 'py-6 sm:py-7 lg:py-8'
            : 'py-10 sm:py-12 lg:py-14',
      first
        ? ''
        : topEdge
          ? 'rounded-t-[2rem] shadow-[0_-30px_80px_-45px_rgba(10,30,19,0.6)] ring-1 ring-forest-950/5'
          : 'lg:rounded-t-[2rem] lg:shadow-[0_-30px_80px_-45px_rgba(10,30,19,0.6)] lg:ring-1 lg:ring-forest-950/5',
    ]"
  >
    <div v-if="bleed" class="relative flex w-full flex-1 flex-col">
      <slot />
    </div>
    <div v-else class="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
      <slot />
    </div>
  </section>
</template>
