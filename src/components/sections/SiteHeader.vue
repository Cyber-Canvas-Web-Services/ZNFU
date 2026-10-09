<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { ArrowUpRight, Menu, X } from "@lucide/vue";

import BrandMark from "@/components/BrandMark.vue";
import { useScrolledPast } from "@/composables/useScrolledPast";
import { brand, navLinks } from "@/data/home";

/**
 * Force the solid header treatment — used on pages without the dark hero
 * behind it, where the transparent header would sit on a light background.
 */
const props = defineProps({
  solid: { type: Boolean, default: false },
});

/**
 * Was a `scroll` listener reading `window.scrollY`. Lenis writes the scroll
 * position every animation frame, so that read landed immediately after a
 * write and forced style/layout to flush on every frame of every scroll. The
 * observer answers the same question without touching layout.
 */
const scrolled = useScrolledPast(40);
const menuOpen = ref(false);

/**
 * True whenever the header is sitting on a light surface: scrolled down, menu
 * open, or on a page with no dark hero behind it.
 *
 * Both the background and every text colour key off this one value, so the
 * off-white bar and its green text can never end up out of step with each
 * other — which is exactly what happens when the same condition is repeated
 * across a dozen bindings.
 */
const onLight = computed(() => scrolled.value || menuOpen.value || props.solid);

function closeMenu() {
  menuOpen.value = false;
}

onBeforeUnmount(() => {
  document.body.style.overflow = "";
});

/* Lock the page behind the mobile panel. */
watch(menuOpen, (open) => {
  document.body.style.overflow = open ? "hidden" : "";
});

/* Close when the viewport grows to the desktop nav. */
const desktopQuery = window.matchMedia("(min-width: 1024px)");
const onDesktopChange = (event) => {
  if (event.matches) closeMenu();
};
onMounted(() => desktopQuery.addEventListener("change", onDesktopChange));
onBeforeUnmount(() =>
  desktopQuery.removeEventListener("change", onDesktopChange),
);
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,padding] duration-300"
    :class="
      onLight
        ? 'bg-cream-50 py-2.5 shadow-[0_8px_30px_-16px_rgba(10,30,19,0.4)]'
        : 'bg-gradient-to-b from-forest-950/80 via-forest-950/35 to-transparent py-4'
    "
  >
    <div
      class="shell relative z-20 flex items-center justify-between gap-6"
    >
      <a href="#hero" class="shrink-0" :aria-label="`${brand.fullName} — home`">
        <BrandMark :tone="onLight ? 'dark' : 'light'" />
      </a>

      <!-- Desktop navigation -->
      <nav
        class="hidden items-center gap-0.5 lg:flex"
        aria-label="Main navigation"
      >
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          class="rounded-full px-3.5 py-2 text-sm font-medium transition-colors"
          :class="
            onLight
              ? 'text-forest-800 hover:bg-forest-950/8 hover:text-forest-950'
              : 'text-white/75 hover:bg-white/10 hover:text-white'
          "
        >
          {{ link.label }}
        </a>
      </nav>

      <div class="hidden lg:block">
        <a href="/apply-membership" class="btn btn--maize">
          Join ZNFU
          <ArrowUpRight class="h-4 w-4" aria-hidden="true" />
        </a>
      </div>

      <!-- Mobile toggle -->
      <button
        type="button"
        class="grid h-11 w-11 place-items-center rounded-full border transition lg:hidden"
        :class="
          onLight
            ? 'border-forest-900/25 text-forest-900 hover:bg-forest-950/8'
            : 'border-white/25 text-white hover:bg-white/10'
        "
        :aria-expanded="menuOpen"
        aria-controls="mobile-menu"
        :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
        @click="menuOpen = !menuOpen"
      >
        <X v-if="menuOpen" class="h-5 w-5" aria-hidden="true" />
        <Menu v-else class="h-5 w-5" aria-hidden="true" />
      </button>
    </div>

    <!-- Mobile panel -->
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-to-class="opacity-0"
    >
      <div v-if="menuOpen" class="lg:hidden">
        <!-- Scrim: dims the page behind the panel and closes the menu on tap.
             No backdrop blur — an opaque tint over a page that may still have
             video playing is one of the more expensive things to composite,
             for an effect nobody sees with the menu open. -->
        <div
          class="fixed inset-0 bg-forest-950/70"
          aria-hidden="true"
          @click="closeMenu"
        />

        <nav
          id="mobile-menu"
          class="shell relative mt-3"
          aria-label="Mobile navigation"
        >
          <ul
            class="clip-safe rounded-2xl border"
            :class="onLight ? 'border-forest-900/10 bg-cream-50' : 'border-white/10 bg-forest-950/95'"
          >
            <li v-for="(link, index) in navLinks" :key="link.href">
              <a
                :href="link.href"
                class="flex items-center justify-between px-5 py-4 text-base font-medium transition"
                :class="[
                  onLight
                    ? 'text-forest-800 hover:bg-forest-950/5 hover:text-forest-950'
                    : 'text-white/85 hover:bg-white/5 hover:text-white',
                  index !== navLinks.length - 1
                    ? onLight
                      ? 'border-b border-forest-900/8'
                      : 'border-b border-white/5'
                    : '',
                ]"
                @click="closeMenu"
              >
                {{ link.label }}
                <ArrowUpRight
                  class="h-4 w-4 text-maize-400"
                  aria-hidden="true"
                />
              </a>
            </li>
            <li class="p-4">
              <a
                href="/apply-membership"
                class="btn btn--maize w-full"
                @click="closeMenu"
              >
                Join ZNFU
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </Transition>
  </header>
</template>
