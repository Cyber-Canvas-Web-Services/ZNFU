import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * `true` once the page has scrolled past `threshold` pixels.
 *
 * Why not a `scroll` listener reading `window.scrollY`:
 *
 * Lenis scrolls by calling `window.scrollTo()` on every animation frame. A
 * scroll listener that then reads `window.scrollY` is doing a read directly
 * after a write in the same frame, which is the textbook layout-thrash
 * pattern — the browser has to flush style and layout to answer the read.
 * That cost lands on every single frame of every scroll.
 *
 * An IntersectionObserver on a sentinel element answers the same question with
 * no per-frame JavaScript at all: the browser tells us once, when the boundary
 * is crossed, and stays quiet the rest of the time.
 *
 * The sentinel is 1px wide, absolutely positioned at the document origin with
 * the requested height, and invisible. Absolute positioning takes it out of
 * flow, and with no positioned ancestor its containing block is the initial
 * containing block — so `top: 0` means the top of the *document*, and it
 * scrolls away like any other content.
 *
 * @param {number} [threshold] Distance in pixels, e.g. 40 for a 40px offset.
 */
export function useScrolledPast(threshold = 40) {
  const passed = ref(false)

  let sentinel = null
  let observer = null

  onMounted(() => {
    // Without an observer the header simply keeps its resting treatment, which
    // is a cosmetic degradation rather than a broken one.
    if (typeof IntersectionObserver === 'undefined') return

    sentinel = document.createElement('div')
    sentinel.setAttribute('aria-hidden', 'true')
    Object.assign(sentinel.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '1px',
      height: `${threshold}px`,
      pointerEvents: 'none',
      visibility: 'hidden',
    })
    document.body.prepend(sentinel)

    observer = new IntersectionObserver(
      ([entry]) => {
        // The sentinel occupies 0–`threshold`. Once it has left the viewport
        // entirely we are past the threshold.
        passed.value = !entry.isIntersecting
      },
      { threshold: 0 },
    )
    observer.observe(sentinel)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
    sentinel?.remove()
    sentinel = null
  })

  return passed
}
