import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Reactive `matchMedia`. Reads synchronously on first call so the very first
 * render already uses the correct layout (no mobile/desktop flash).
 *
 * @param {string} query
 */
export function useMediaQuery(query) {
  const supported = typeof window !== 'undefined' && 'matchMedia' in window
  const matches = ref(supported ? window.matchMedia(query).matches : false)

  let mql = null

  function update(event) {
    matches.value = event.matches
  }

  onMounted(() => {
    if (!supported) return
    mql = window.matchMedia(query)
    matches.value = mql.matches
    mql.addEventListener('change', update)
  })

  onBeforeUnmount(() => {
    mql?.removeEventListener('change', update)
  })

  return matches
}

/** True when the visitor has asked the OS to reduce motion. */
export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

/** True below the `md` breakpoint (768px) — matches Tailwind's `md`. */
export function useIsMobile() {
  return useMediaQuery('(max-width: 767px)')
}
