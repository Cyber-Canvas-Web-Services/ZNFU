<script setup>
/**
 * App shell — the fixed header and footer wrap whichever top-level page is
 * showing.
 *
 * The site ships without a routing dependency; the PAGES record below is the
 * single source of truth for what exists:
 *
 *   /                     the stacked home page (src/pages/HomePage.vue)
 *   /about                purpose and vision
 *   /what-we-do           the mission, the member kinds and the closing banner
 *   /systems              e-Farm Prices, e-Transport and ZNFU Market
 *   /news                 the newsroom
 *   /membership           who can join, and the categories at a glance
 *   /contact              how to reach the Secretariat
 *   /apply-membership     the standalone “Apply for Membership” guide
 *   /types-of-membership  the membership categories and subscription bands
 *
 * Each entry carries its own document title and skip-link target, so adding a
 * page means adding one line here and nothing else.
 *
 * Links between the pages use plain `<a href="/…">` markup. A document-level
 * click handler turns those into seamless in-app transitions, sends the home
 * page’s `#anchor` links home when they are clicked from another page, and
 * lands everything through Lenis so the movement matches the rest of the site.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";

import AboutPage from "@/pages/AboutPage.vue";
import ApplyMembershipPage from "@/pages/ApplyMembershipPage.vue";
import ContactPage from "@/pages/ContactPage.vue";
import HomePage from "@/pages/HomePage.vue";
import MembershipPage from "@/pages/MembershipPage.vue";
import NewsPage from "@/pages/NewsPage.vue";
import SystemsPage from "@/pages/SystemsPage.vue";
import TypesOfMembershipPage from "@/pages/TypesOfMembershipPage.vue";
import WhatWeDoPage from "@/pages/WhatWeDoPage.vue";
import SiteFooter from "@/components/sections/SiteFooter.vue";
import SiteHeader from "@/components/sections/SiteHeader.vue";
import NewsletterFloat from "@/components/ui/NewsletterFloat.vue";
import { useSmoothScroll } from "@/composables/useSmoothScroll";

const SITE_NAME = "Zambia National Farmers’ Union";

/** Every route: its component, its document title and its skip target. */
const PAGES = {
  "/": {
    component: HomePage,
    title: `ZNFU — ${SITE_NAME}`,
    skip: "#about",
  },
  "/about": {
    component: AboutPage,
    title: `About — ${SITE_NAME}`,
    skip: "#about",
  },
  "/what-we-do": {
    component: WhatWeDoPage,
    title: `What We Do — ${SITE_NAME}`,
    skip: "#what-we-do",
  },
  "/systems": {
    component: SystemsPage,
    title: `Member Systems — ${SITE_NAME}`,
    skip: "#systems",
  },
  "/news": {
    component: NewsPage,
    title: `Newsroom — ${SITE_NAME}`,
    skip: "#news",
  },
  "/membership": {
    component: MembershipPage,
    title: `Membership — ${SITE_NAME}`,
    skip: "#membership",
  },
  "/contact": {
    component: ContactPage,
    title: `Contact — ${SITE_NAME}`,
    skip: "#contact-page",
  },
  "/apply-membership": {
    component: ApplyMembershipPage,
    title: `Apply for Membership — ${SITE_NAME}`,
    skip: "#apply-membership",
  },
  "/types-of-membership": {
    component: TypesOfMembershipPage,
    title: `Types of Membership — ${SITE_NAME}`,
    skip: "#types-of-membership",
  },
};

/** Current page, read from the URL and kept in sync with the history API. */
function readPath() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  return path in PAGES ? path : "/";
}

const currentPath = ref(readPath());

const currentPage = computed(() => PAGES[currentPath.value]);

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
    document.title = PAGES[path].title;
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
    if (!(path in PAGES)) return;
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
    document.title = PAGES[path].title;
    if (window.location.hash) scrollToHash(window.location.hash);
  });
}

onMounted(() => {
  document.title = currentPage.value.title;
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
    :href="currentPage.skip"
    class="sr-only focus:not-sr-only focus:absolute focus:left-5 focus:top-5 focus:z-[60] focus:rounded-full focus:bg-maize-400 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-forest-950"
  >
    Skip to content
  </a>

  <SiteHeader :solid="currentPath !== '/'" />

  <main>
    <component :is="currentPage.component" />
  </main>

  <SiteFooter />

  <!-- Sits outside the footer on purpose. It used to be a block in the
       footer's right-hand column, where it was the tallest thing in the grid
       and therefore set the height of the whole footer. See the component. -->
  <NewsletterFloat />
</template>
