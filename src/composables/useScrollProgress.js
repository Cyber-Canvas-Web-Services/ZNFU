import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Maps the scroll position of a tall "pin" element to a 0 → 1 progress value.
 *
 * The element is expected to be `pinHeight` tall with a `position: sticky`
 * child that fills the viewport. Progress reaches 1 when the sticky child has
 * finished travelling through the pin.
 *
 * Performance: the pin's geometry is measured **only when layout actually
 * changes** (mount, resize, orientationchange, or a ResizeObserver callback)
 * and then cached. The per-frame path reads nothing but `window.scrollY`, so
 * scrolling never forces a synchronous layout — measuring inside a scroll
 * handler fights the style writes that follow it and causes visible jank.
 *
 * @param {import('vue').Ref<HTMLElement|null>} targetRef
 * @param {{ enabled?: import('vue').Ref<boolean> }} [options]
 */
export function useScrollProgress(targetRef, options = {}) {
  const progress = ref(0)
  /** True while the sticky child is actually stuck to the viewport. */
  const isPinned = ref(false)
  /** True while any part of the pin is on screen — used to pause video. */
  const isInView = ref(false)

  const isEnabled = () => options.enabled?.value !== false

  let frameId = 0
  let queued = false
  let observer = null
  let resizeObserver = null

  /* Cached geometry, in document coordinates. */
  let sectionTop = 0
  let travel = 0

  function compute() {
    if (!isEnabled()) return

    // Layout is unusably small (e.g. a zero-height section) — treat as done.
    if (travel <= 1) {
      progress.value = sectionTop - window.scrollY <= 0 ? 1 : 0
      isPinned.value = false
      return
    }

    // Position relative to the top of the pin.
    const offset = window.scrollY - sectionTop
    const travelled = offset < 0 ? 0 : offset > travel ? travel : offset

    progress.value = travelled / travel
    isPinned.value = offset >= 0 && offset < travel
  }

  /** Runs a layout read, then caches the result and recomputes. */
  function measure() {
    const el = targetRef.value
    if (!el) return

    sectionTop = el.getBoundingClientRect().top + window.scrollY
    travel = el.offsetHeight - window.innerHeight
    compute()
  }

  function schedule() {
    if (queued) return
    queued = true
    frameId = window.requestAnimationFrame(() => {
      queued = false
      compute()
    })
  }

  onMounted(() => {
    measure()

    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        ([entry]) => {
          isInView.value = entry.isIntersecting
        },
        { threshold: 0 },
      )
      if (targetRef.value) observer.observe(targetRef.value)
    } else {
      isInView.value = true
    }

    // A viewport change alters `travel` (the pin is sized in vh), so the
    // cache has to be rebuilt rather than merely recomputed.
    if (typeof ResizeObserver !== 'undefined' && targetRef.value) {
      resizeObserver = new ResizeObserver(measure)
      resizeObserver.observe(targetRef.value)
    }

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', measure, { passive: true })
    window.addEventListener('orientationchange', measure, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', measure)
    window.removeEventListener('orientationchange', measure)
    if (frameId) window.cancelAnimationFrame(frameId)
    observer?.disconnect()
    resizeObserver?.disconnect()
  })

  return { progress, isPinned, isInView, refresh: measure }
}
