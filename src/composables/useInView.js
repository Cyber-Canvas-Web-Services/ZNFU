import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Tracks whether an element is intersecting the viewport. Used to pause
 * off-screen video decoding so the page stays light on battery and CPU.
 *
 * @param {import('vue').Ref<HTMLElement|null>} targetRef
 * @param {{ rootMargin?: string, threshold?: number }} [options]
 */
export function useInView(targetRef, options = {}) {
  const { rootMargin = '0px', threshold = 0 } = options
  const isInView = ref(false)

  let observer = null

  onMounted(() => {
    if (typeof IntersectionObserver === 'undefined') {
      isInView.value = true
      return
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        isInView.value = entry.isIntersecting
      },
      { rootMargin, threshold },
    )

    if (targetRef.value) observer.observe(targetRef.value)
  })

  onBeforeUnmount(() => observer?.disconnect())

  return isInView
}
