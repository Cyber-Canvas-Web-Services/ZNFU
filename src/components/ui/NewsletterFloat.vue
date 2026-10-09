<script setup>
/**
 * Floating newsletter card — “Keep ahead of the season”.
 *
 * This used to be a block in the footer’s right-hand column. It was moved out
 * at the client’s request, for a reason the measurements back up: at 166px it
 * was the **tallest thing in the footer grid**, so it alone set the grid’s
 * height to 397px. Everything under it — the divider line and the bottom bar —
 * was pushed down by a newsletter box that had nothing to do with the footer’s
 * job. Pulling it out lets the footer be as short as its actual content.
 *
 * It is `position: fixed` rather than `sticky`: sticky would keep it inside the
 * footer’s flow and it would still be dismissed by scrolling past, which is the
 * behaviour this is meant to avoid. Fixed also keeps it out of the footer’s
 * `clip-safe` (`overflow: clip`) ancestor and out of the sticky panel stack,
 * where it would become another composited layer in the scroll path.
 *
 * WHEN IT SHOWS — three independent conditions, all of which must hold:
 *   1. the visitor has scrolled about three-quarters of a screen, so the card
 *      never competes with the hero for attention;
 *   2. the footer is NOT on screen — see below;
 *   3. it has not been dismissed.
 *
 * (2) matters more than it looks. The card is fixed to the bottom-right, and
 * the footer’s bottom bar puts the legal links and “Back to top” in exactly
 * that corner on a wide screen. Left visible, the card would sit on top of
 * them at the precise moment the visitor is looking for them. Hiding on the
 * footer also means the card never covers the contact details it is asking
 * people to trust.
 *
 * The dismissal is remembered in `localStorage`, so a visitor who closes it
 * does not have to close it again on every page — the footer (and therefore
 * this card) is on all nine routes.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Send, X } from '@lucide/vue'

import { useIsMobile } from '@/composables/useMediaQuery'
import { useScrolledPast } from '@/composables/useScrolledPast'
import { footer } from '@/data/home'

const STORAGE_KEY = 'znfu:newsletter-dismissed'

/**
 * Three-quarters of a screen. Read once at setup: the threshold only decides
 * when the sentinel stops being visible, and re-deriving it on resize would
 * mean rebuilding the observer for a purely cosmetic boundary.
 */
const scrolledEnough = useScrolledPast(
  Math.round((window.innerHeight || 800) * 0.75),
)

const dismissed = ref(readDismissed())
const footerOnScreen = ref(false)

let footerObserver = null

/**
 * `localStorage` throws rather than returning null in some privacy modes, so
 * this can never be allowed to break setup — a card that fails to remember a
 * dismissal is a nuisance, but a card that throws takes the page down with it.
 */
function readDismissed() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function dismiss() {
  dismissed.value = true
  try {
    window.localStorage.setItem(STORAGE_KEY, '1')
  } catch {
    /* Not fatal — it just means the choice does not survive a reload. */
  }
}

const email = ref('')
const subscribed = ref(false)

function subscribe() {
  if (!email.value) return
  subscribed.value = true
  email.value = ''
  // The card has done its job; leaving it up to report success is enough, and
  // moving the visitor's focus out of a form they have finished is worse than
  // leaving it where it is.
}

const visible = computed(
  () => scrolledEnough.value && !footerOnScreen.value && !dismissed.value,
)

/* ---------------------------------------------------------------- */
/*  Mobile: a button until it is asked for                           */
/* ---------------------------------------------------------------- */
/**
 * On a phone the full card is 304×142 of permanently occupied screen — on a
 * 390px-wide display that is a fifth of the height, held for the whole visit
 * by a signup nobody asked for. Below `md` it is therefore just a 52px send
 * button, and tapping it opens the real card.
 *
 * Desktop keeps the card as it was. There is room for it there, and a floating
 * button that has to be opened is a worse trade when the space is free.
 */
const isMobile = useIsMobile()
const expanded = ref(false)
const cardEl = ref(null)
const fabEl = ref(null)

/** True only while the mobile button is the resting state. */
const collapsed = computed(() => isMobile.value && !expanded.value)

async function openCard() {
  expanded.value = true
  await nextTick()
  // Move focus into the card rather than to the input. Focusing the input
  // would raise the on-screen keyboard the instant the button is tapped, and
  // that keyboard covers the card it was opened from. Focusing the container
  // keeps focus off `<body>` (which is where it lands when the button that
  // had it is removed) without assuming the visitor wants to type yet.
  cardEl.value?.focus()
}

function collapse({ restoreFocus = true } = {}) {
  if (!expanded.value) return
  expanded.value = false
  if (restoreFocus) nextTick(() => fabEl.value?.focus())
}

/**
 * A tap anywhere outside the card puts it back to the button. Without this the
 * only ways out of the expanded card would be dismissing it for good or
 * scrolling away, neither of which is what someone who just wants it out of
 * the way is looking for.
 */
function onDocumentPointerDown(event) {
  if (!expanded.value) return
  if (cardEl.value?.contains(event.target)) return
  if (fabEl.value?.contains(event.target)) return
  collapse()
}

function onDocumentKeydown(event) {
  if (event.key === 'Escape') collapse()
}

/**
 * Resting state is the button. If the card hides — the footer came into view,
 * or the visitor scrolled back to the top — it should not reappear open the
 * next time it is seen.
 */
watch(visible, (isVisible) => {
  if (!isVisible) collapse({ restoreFocus: false })
})

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown)
  document.addEventListener('keydown', onDocumentKeydown)

  const footerEl = document.querySelector('footer')
  if (!footerEl || typeof IntersectionObserver === 'undefined') return

  footerObserver = new IntersectionObserver(
    ([entry]) => {
      footerOnScreen.value = entry.isIntersecting
    },
    // Any part of the footer counts. A taller margin would keep the card up
    // while the footer is filling the screen.
    { threshold: 0 },
  )
  footerObserver.observe(footerEl)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown)
  document.removeEventListener('keydown', onDocumentKeydown)
  footerObserver?.disconnect()
  footerObserver = null
})
</script>

<template>
  <Transition name="float">
    <!-- `grid` with both children in the same cell, rather than a flow layout:
         the button and the card have to occupy the same corner, and during a
         swap they are briefly both mounted. In normal flow the button would
         sit above the card instead of on top of it.

         `pointer-events-none` on the container and `auto` on the children
         matters for the same reason — the container is sized by the card, so
         while only the button is showing it would otherwise be a 304×149
         invisible sheet swallowing taps meant for the page. -->
    <aside
      v-if="visible"
      aria-label="Newsletter signup"
      class="pointer-events-none fixed bottom-5 right-5 z-40 grid sm:bottom-6 sm:right-6"
    >
      <!-- Mobile resting state: the send button. -->
      <Transition name="pop">
        <button
          v-if="collapsed"
          ref="fabEl"
          type="button"
          class="pointer-events-auto col-start-1 row-start-1 h-[52px] w-[52px] justify-self-end self-end grid place-items-center rounded-full bg-maize-400 text-forest-950 shadow-card transition-colors hover:bg-maize-300"
          aria-label="Open newsletter signup"
          @click="openCard"
        >
          <Send class="h-5 w-5" aria-hidden="true" />
        </button>
      </Transition>

      <!-- The card. On desktop this is the resting state; on mobile it is what
           the button opens. -->
      <Transition name="expand">
        <div
          v-if="!collapsed"
          ref="cardEl"
          tabindex="-1"
          class="pointer-events-auto relative col-start-1 row-start-1 w-[min(19rem,calc(100vw-2.5rem))] origin-bottom-right self-end justify-self-end rounded-card border border-white/12 bg-forest-950/97 p-4 shadow-card outline-none"
        >
          <!-- Near-opaque rather than translucent-with-blur. A `backdrop-filter`
               here would have to re-sample the region behind the card on every
               frame of every scroll — the same cost that was removed from the
               hero's ghost button — for an effect nobody would notice at 96%
               opacity. -->

          <!-- 32px hit area around a 14px glyph. The glyph is what reads as the
               button; the padding is what a thumb actually has to hit, and 24px
               (the WCAG minimum) is uncomfortably small on a phone. -->
          <button
            type="button"
            class="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full text-cream-200/50 transition hover:bg-white/10 hover:text-cream-50"
            aria-label="Dismiss newsletter signup"
            @click="dismiss"
          >
            <X class="h-3.5 w-3.5" aria-hidden="true" />
          </button>

          <p
            class="pr-9 font-display text-sm font-semibold tracking-[-0.01em] text-cream-50"
          >
            {{ footer.newsletter.title }}
          </p>
          <p class="mt-1.5 pr-9 text-xs leading-relaxed text-cream-200/60">
            {{ footer.newsletter.body }}
          </p>

          <form
            v-if="!subscribed"
            class="mt-3 flex gap-2"
            @submit.prevent="subscribe"
          >
            <label class="sr-only" for="float-email">Email address</label>
            <input
              id="float-email"
              v-model="email"
              type="email"
              required
              :placeholder="footer.newsletter.placeholder"
              class="field field--on-dark min-w-0 flex-1"
            />
            <button
              type="submit"
              class="btn btn--maize btn--icon shrink-0"
              aria-label="Subscribe"
            >
              <Send class="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
          <p v-else class="mt-3 text-xs text-maize-200">
            {{ footer.newsletter.success }}
          </p>
        </div>
      </Transition>
    </aside>
  </Transition>
</template>

<style scoped>
/**
 * Slide + fade, both of which the compositor can do without touching layout.
 * The reduced-motion rule in `style.css` collapses the duration globally, so
 * anyone who has asked for less motion gets the card appearing instantly
 * rather than sliding.
 */
.float-enter-active,
.float-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.float-enter-from,
.float-leave-to {
  opacity: 0;
  transform: translate3d(0, 12px, 0);
}

/**
 * Mobile open/close. Transform and opacity only, so the swap costs the
 * compositor and never triggers layout — a width/height animation here would
 * reflow the docked corner on every frame.
 *
 * `scale` from the bottom-right origin (set on the card) makes the card read as
 * growing out of the button it came from, which is what makes the relationship
 * between the two states obvious.
 */
.expand-enter-active,
.expand-leave-active {
  transition:
    opacity 0.28s ease,
    transform 0.28s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: scale(0.92) translate3d(0, 8px, 0);
}

/**
 * While either element is on its way out it must not take taps. The button and
 * the card sit in the same corner, so for the ~200ms the button spends leaving
 * it overlaps the card's own submit button — and an opaque, still-interactive
 * circle sitting on top of it would swallow a fast second tap.
 */
.expand-leave-active,
.pop-leave-active {
  pointer-events: none;
}

.pop-enter-active,
.pop-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.7);
}
</style>
