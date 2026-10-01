<script setup>
/**
 * App shell — the fixed header and footer wrap whichever top-level page is
 * showing.
 *
 * The site ships without a routing dependency; this small switcher covers the
 * two pages it needs:
 *
 *   /                  the stacked home page (src/pages/HomePage.vue)
 *   /apply-membership  the standalone “Apply for Membership” guide
 *
 * Links between the pages use plain `<a href="/…">` markup. A document-level
 * click handler turns those into seamless in-app transitions, sends the home
 * page’s `#anchor` links home when they are clicked from another page, and
 * lands everything through Lenis so the movement matches the rest of the site.
 */
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";

import ApplyMembershipPage from "@/pages/ApplyMembershipPage.vue";
import HomePage from "@/pages/HomePage.vue";
import SiteFooter from "@/components/sections/SiteFooter.vue";
import SiteHeader from "@/components/sections/SiteHeader.vue";
import { useSmoothScroll } from "@/composables/useSmoothScroll";

const PAGE_TITLES = {
  "/": "ZNFU — Zambia National Farmers’ Union",
  "/apply-membership": "Apply for Membership — Zambia National Farmers’ Union",
};

/** Current page, read from the URL and kept in sync with the history API. */
function readPath() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  return path in PAGE_TITLES ? path : "/";
}

const currentPath = ref(readPath());

/** How far the fixed header reaches into the viewport; anchors land below it. */
const HEADER_OFFSET = -84;

/**
 * Smooth scrolling for the whole page. Lenis keeps native document scrolling
 * (so `position: sticky` and `window.scrollY` still behave), it just eases the
 * scroll position. The anchor offset clears the fixed header. The instance
 * lives in this shell so it survives page switches.
 */
const { lenis, scrollTo, isEnabled } = useSmoothScroll({
  offset: HEADER_OFFSET,
});

function scrollToTop() {
  if (isEnabled()) scrollTo(0, { offset: 0, immediate: true });
  else window.scrollTo(0, 0);
}

/**
 * Land a `#section` link. The home page keeps settling for a moment after it
 * mounts (media and JS-measured sections), which shifts the target, so the
 * scroll is re-issued until the section sits where it should — unless the
 * visitor starts scrolling first, in which case their scrolling wins.
 */
function scrollToHash(hash) {
  const id = hash.slice(1);
  // Where the section settles: the stylesheet’s `scroll-padding-top` clears
  // the header, and Lenis adds its own anchor offset on top of that.
  const scrollPadding =
    Number.parseFloat(
      getComputedStyle(document.documentElement).scrollPaddingTop,
    ) || 0;
  const expectedTop = isEnabled()
    ? scrollPadding - HEADER_OFFSET
    : scrollPadding;
  const abort = new AbortController();

  // Any wheel or touch means the visitor has taken over; stop correcting.
  window.addEventListener("wheel", () => abort.abort(), {
    passive: true,
    signal: abort.signal,
  });
  window.addEventListener("touchstart", () => abort.abort(), {
    passive: true,
    signal: abort.signal,
  });

  const apply = () => {
    if (isEnabled()) {
      // The page has just changed; re-measure so the target is not clamped
      // to the previous page’s scroll limit.
      lenis.value?.resize();
      scrollTo(hash);
    } else {
      document.getElementById(id)?.scrollIntoView({ block: "start" });
    }
  };

  const verify = (remaining) => {
    const el = document.getElementById(id);
    if (abort.signal.aborted || !el || remaining <= 0) return;
    if (Math.abs(el.getBoundingClientRect().top - expectedTop) < 32) return;
    apply();
    window.setTimeout(() => verify(remaining - 1), 400);
  };

  apply();
  // Keep checking for a few seconds: media finishing loads can still nudge
  // the layout after the first animation.
  window.setTimeout(() => verify(15), 380);
}

function go(path, hash = "") {
  const switched = path !== currentPath.value;
  if (switched) {
    window.history.pushState({}, "", hash ? `${path}#${hash}` : path);
    currentPath.value = path;
    // Reset while the old page is still mounted, so the new page paints at top.
    scrollToTop();
  }
  nextTick(() => {
    document.title = PAGE_TITLES[path];
    if (switched) lenis.value?.resize();
    if (hash) scrollToHash(`#${hash}`);
    else if (!switched) scrollToTop();
  });
}

function onDocumentClick(event) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  const anchor = event.target.closest?.("a[href]");
  if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download"))
    return;

  const href = anchor.getAttribute("href");
  if (!href) return;

  if (href.startsWith("#")) {
    // In-page anchors on the home page are Lenis’s job; leave them alone.
    if (document.getElementById(href.slice(1)) || currentPath.value === "/")
      return;
    // An anchor that only exists on the home page, clicked from elsewhere.
    event.preventDefault();
    event.stopPropagation();
    go("/", href.slice(1));
    return;
  }

  if (href.startsWith("/") && !href.startsWith("//")) {
    const [path, hash = ""] = href.split("#");
    if (!(path in PAGE_TITLES)) return;
    event.preventDefault();
    event.stopPropagation();
    go(path, hash);
  }
}

function onPopState() {
  const path = readPath();
  if (path === currentPath.value) return;
  currentPath.value = path;
  scrollToTop();
  nextTick(() => {
    lenis.value?.resize();
    document.title = PAGE_TITLES[path];
    if (window.location.hash) scrollToHash(window.location.hash);
  });
}

onMounted(() => {
  document.title = PAGE_TITLES[currentPath.value];
  document.addEventListener("click", onDocumentClick);
  window.addEventListener("popstate", onPopState);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", onDocumentClick);
  window.removeEventListener("popstate", onPopState);
});
</script>

<template>
  <a
    :href="currentPath === '/' ? '#about' : '#apply-membership'"
    class="sr-only focus:not-sr-only focus:absolute focus:left-5 focus:top-5 focus:z-[60] focus:rounded-full focus:bg-maize-400 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-forest-950"
  >
    Skip to content
  </a>

  <SiteHeader :solid="currentPath !== '/'" />

  <main>
    <HomePage v-if="currentPath === '/'" />
    <ApplyMembershipPage v-else />
  </main>

  <SiteFooter />
</template>
