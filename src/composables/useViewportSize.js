import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Reactive viewport size, in CSS pixels.
 *
 * Reads on creation so the first render already has correct dimensions, and
 * updates are coalesced to one per animation frame so a resize drag cannot
 * flood the renderer.
 */
export function useViewportSize() {
  const width = ref(typeof window === 'undefined' ? 0 : window.innerWidth)
  const height = ref(typeof window === 'undefined' ? 0 : window.innerHeight)

  let frameId = 0

  function read() {
    width.value = window.innerWidth
    height.value = window.innerHeight
  }

  function schedule() {
    if (frameId) return
    frameId = window.requestAnimationFrame(() => {
      frameId = 0
      read()
    })
  }

  onMounted(() => {
    read()
    window.addEventListener('resize', schedule, { passive: true })
    window.addEventListener('orientationchange', schedule, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', schedule)
    window.removeEventListener('orientationchange', schedule)
    if (frameId) window.cancelAnimationFrame(frameId)
  })

  return { width, height }
}
