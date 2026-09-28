import { onBeforeUnmount, onMounted, ref } from 'vue'

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

/**
 * Counts a number up from 0 to `target` the first time the attached element
 * scrolls into view. Returns the display value plus the ref to bind.
 *
 * @param {number} target
 * @param {{ duration?: number, reducedMotion?: import('vue').Ref<boolean>, threshold?: number }} [options]
 */
export function useCountUp(target, options = {}) {
  const { duration = 1500, reducedMotion, threshold = 0.4 } = options

  const value = ref(0)
  const elRef = ref(null)

  let frameId = 0
  let observer = null

  function run() {
    if (reducedMotion?.value) {
      value.value = target
      return
    }

    const startedAt = performance.now()

    const tick = (now) => {
      const elapsed = Math.min((now - startedAt) / duration, 1)
      value.value = target * easeOutCubic(elapsed)
      if (elapsed < 1) {
        frameId = window.requestAnimationFrame(tick)
      } else {
        value.value = target
      }
    }

    frameId = window.requestAnimationFrame(tick)
  }

  onMounted(() => {
    if (reducedMotion?.value || typeof IntersectionObserver === 'undefined') {
      value.value = target
      return
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        run()
        observer?.disconnect()
        observer = null
      },
      { threshold },
    )

    if (elRef.value) observer.observe(elRef.value)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    if (frameId) window.cancelAnimationFrame(frameId)
  })

  return { value, elRef }
}
