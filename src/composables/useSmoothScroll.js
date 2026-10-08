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
 * The animation frame is driven here rather than by Lenis's own `autoRaf`,
 * so it can be parked when there is nothing to animate. Lenis has to call
 * `window.scrollTo()` from the main thread, so it is not something the
 * compositor can take over — every frame it runs is main-thread work. Left on
 * `autoRaf`, that loop runs 60 times a second forever, including on a page
 * nobody is scrolling. Parking it costs nothing in feel: when the page is
 * idle there is no motion to smooth.
 *
 * @param {{ offset?: number }} [options] Anchor offset, e.g. to clear a fixed header.
 */
export function useSmoothScroll(options = {}) {
  const { offset = 0 } = options
  const reducedMotion = usePrefersReducedMotion()
  const lenis = ref(null)

  let rafId = null
  let settleFrames = 0

  /* ---------------------------------------------------------------- */
  /*  Frame loop                                                       */
  /* ---------------------------------------------------------------- */

  /**
   * Is there any scroll animation left to run?
   *
   * `isScrolling` alone is not enough — it reports input activity, not
   * whether the scroll has arrived. The distance between `targetScroll` and
   * `animatedScroll` is the authoritative answer, and cutting the loop while
   * that is non-zero would freeze the page mid-scroll. `velocity` covers the
   * tail end, after the target is reached but the easing is still bleeding off.
   */
  function stillMoving(l) {
    if (l.isScrolling) return true
    if (Math.abs(l.velocity ?? 0) > 0.01) return true
    return Math.abs((l.targetScroll ?? 0) - (l.animatedScroll ?? 0)) > 0.5
  }

  function frame(time) {
    const l = lenis.value
    if (!l) {
      rafId = null
      return
    }

    l.raf(time)

    if (stillMoving(l)) {
      settleFrames = 0
      rafId = window.requestAnimationFrame(frame)
      return
    }

    // A few extra frames so the final position lands exactly, rather than
    // parking a fraction of a pixel short of it.
    settleFrames += 1
    if (settleFrames < 3) {
      rafId = window.requestAnimationFrame(frame)
    } else {
      rafId = null
    }
  }

  /** Restart the loop. Safe to call at any time; it never double-schedules. */
  function wake() {
    if (rafId === null && lenis.value) {
      settleFrames = 0
      rafId = window.requestAnimationFrame(frame)
    }
  }

  /*
   * Every one of these means "the scroll position is about to change", so the
   * loop needs to be running when it fires:
   *
   *   wheel / touchstart / mousedown  pointer-driven scrolling
   *   keydown / scroll                keyboard, scrollbar, and any native
   *                                   scroll Lenis has to catch up with
   *   click                           Lenis's own anchors plugin handles
   *                                   `#anchor` links by calling scrollTo,
   *                                   which animates and therefore needs the
   *                                   loop. It listens on click, not
   *                                   mousedown, so this one is required —
   *                                   without it every in-page anchor link
   *                                   silently does nothing.
   *
   * Failing to wake shows up as a frozen page, so the list is deliberately
   * generous.
   */
  const wakeEvents = [
    'wheel',
    'touchstart',
    'mousedown',
    'keydown',
    'click',
    'scroll',
  ]

  /* ---------------------------------------------------------------- */
  /*  Lifecycle                                                        */
  /* ---------------------------------------------------------------- */

  function enable() {
    if (lenis.value || reducedMotion.value) return

    lenis.value = new Lenis({
      // Driven by `frame()` above, not by Lenis, so it can be parked.
      autoRaf: false,
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
       */
      lerp: 0.25,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      // Opt out with `data-lenis-prevent` for elements that scroll internally.
      prevent: (node) => node.hasAttribute?.('data-lenis-prevent') ?? false,
    })

    // Every one of these means "the scroll position is about to change", so the
    // loop needs to be running. Any one of them failing to wake it would look
    // like a frozen page, so the list is deliberately generous.
    for (const type of wakeEvents) {
      window.addEventListener(type, wake, { passive: true })
    }

    wake()
  }

  function disable() {
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId)
      rafId = null
    }
    for (const type of wakeEvents) {
      window.removeEventListener(type, wake)
    }
    lenis.value?.destroy()
    lenis.value = null
  }

  onMounted(enable)
  onBeforeUnmount(disable)

  /** Smooth-scroll to a target, e.g. from a button rather than an anchor. */
  function scrollTo(target, scrollOptions = {}) {
    if (lenis.value) {
      // The loop may be parked; `scrollTo` animates, so it has to be running.
      wake()
      lenis.value.scrollTo(target, { offset, ...scrollOptions })
      return
    }
    // Fallback for reduced motion or before Lenis has mounted.
    const el = typeof target === 'string' ? document.querySelector(target) : target
    el?.scrollIntoView({ block: 'start', behavior: 'auto' })
  }

  return { lenis, scrollTo, isEnabled: () => Boolean(lenis.value) }
}
