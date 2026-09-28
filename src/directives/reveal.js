/**
 * `v-reveal` — fades and lifts an element into view the first time it is
 * scrolled into the viewport.
 *
 *   <div v-reveal>…</div>
 *   <div v-reveal="{ delay: 120 }">…</div>
 *
 * Honours `prefers-reduced-motion` by showing the element immediately.
 */
export const reveal = {
  mounted(el, binding) {
    const delay = Number(binding.value?.delay ?? 0)
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced || typeof IntersectionObserver === 'undefined') {
      el.classList.add('reveal', 'is-revealed')
      return
    }

    el.classList.add('reveal')
    if (delay) el.style.transitionDelay = `${delay}ms`

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.classList.add('is-revealed')
        observer.disconnect()
        el._revealObserver = null
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(el)
    el._revealObserver = observer
  },

  unmounted(el) {
    el._revealObserver?.disconnect()
    el._revealObserver = null
  },
}
