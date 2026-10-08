import { onBeforeUnmount, onMounted, ref } from 'vue'

import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

import { usePrefersReducedMotion } from './useMediaQuery'

/**
 * Lenis smooth scrolling.
 *
 * Lenis keeps real document scrolling (it does not hijack or virtualise it),
 * so `window.scrollY`, `position: sticky` and anchor links all keep working —
 * it just interpolates the scroll position instead of jumping to it.
 *
 * Two things matter for this to behave:
 *
 *  1. `scroll-behavior: smooth` must NOT be set in CSS. Two smooth-scroll
 *     implementations fighting over the same scroll position produces a
 *     stutter, so the base stylesheet leaves it to Lenis.
 *  2. Visitors who ask for reduced motion get native scrolling instead. Lenis
 *     is skipped entirely rather than merely shortened.
 *
 * @param {{ offset?: number }} [options] Anchor offset, e.g. to clear a fixed header.
 */
export function useSmoothScroll(options = {}) {
  const { offset = 0 } = options
  const reducedMotion = usePrefersReducedMotion()
  const lenis = ref(null)

  function enable() {
    if (lenis.value || reducedMotion.value) return

    lenis.value = new Lenis({
      // Lenis drives its own animation frame; no manual raf loop needed.
      autoRaf: true,
      // Handle in-page `#anchor` clicks, offset so the fixed header clears.
      anchors: { offset },
      /*
       * 0.25 rather than the usual 0.1.
       *
       * `lerp` is the fraction of the remaining distance covered each frame, so
       * it is the direct trade between glide and input lag. At 0.1 the page
       * takes roughly 470ms to catch up to the wheel — smooth, but it reads as
       * the page lagging behind you, especially on a page this tall. At 0.25
       * that falls to about 170ms: still eased, but no longer feels detached
       * from the input.
       *
       * Worth knowing: Lenis drives scrolling from requestAnimationFrame, so
       * scrolling runs on the main thread rather than the compositor. Any main
       * thread work is therefore felt directly in the scroll. Removing Lenis
       * entirely is the way to make scrolling unconditionally smooth — the
       * native fallbacks for it already exist below and in App.vue.
       */
      lerp: 0.25,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      // Opt out with `data-lenis-prevent` for elements that scroll internally.
      prevent: (node) => node.hasAttribute?.('data-lenis-prevent') ?? false,
    })
  }

  function disable() {
    lenis.value?.destroy()
    lenis.value = null
  }

  onMounted(enable)
  onBeforeUnmount(disable)

  /** Smooth-scroll to a target, e.g. from a button rather than an anchor. */
  function scrollTo(target, scrollOptions = {}) {
    if (lenis.value) {
      lenis.value.scrollTo(target, { offset, ...scrollOptions })
      return
    }
    // Fallback for reduced motion or before Lenis has mounted.
    const el = typeof target === 'string' ? document.querySelector(target) : target
    el?.scrollIntoView({ block: 'start', behavior: 'auto' })
  }

  return { lenis, scrollTo, isEnabled: () => Boolean(lenis.value) }
}
