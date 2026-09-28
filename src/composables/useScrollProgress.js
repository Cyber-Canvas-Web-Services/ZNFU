import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Maps the scroll position of a tall "pin" element to a 0 → 1 progress value.
 *
 * The element is expected to be `pinHeight` tall with a `position: sticky`
 * child that fills the viewport. Progress reaches 1 when the sticky child has
 * finished travelling through the pin.
 *
 * Reads are throttled to one per animation frame so the scroll handler never
 * forces more than a single layout read per frame.
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

  function read() {
    const el = targetRef.value
    if (!el || !isEnabled()) return

    const rect = el.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const travel = rect.height - viewportHeight

    if (travel <= 1) {
      progress.value = rect.top <= 0 ? 1 : 0
      isPinned.value = false
      return
    }

    const travelled = Math.min(Math.max(-rect.top, 0), travel)
    progress.value = travelled / travel
    isPinned.value = rect.top <= 0 && rect.bottom > viewportHeight
  }

  function schedule() {
    if (queued) return
    queued = true
    frameId = window.requestAnimationFrame(() => {
      queued = false
      read()
    })
  }

  onMounted(() => {
    read()

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

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    window.addEventListener('orientationchange', schedule, { passive: true })
    schedule()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)
    window.removeEventListener('orientationchange', schedule)
    if (frameId) window.cancelAnimationFrame(frameId)
    observer?.disconnect()
  })

  return { progress, isPinned, isInView, refresh: read }
}
