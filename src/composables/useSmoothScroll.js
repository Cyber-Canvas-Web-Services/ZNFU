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
      // Lower = longer glide. 0.1 is close to native feel with the edge taken off.
      lerp: 0.1,
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
