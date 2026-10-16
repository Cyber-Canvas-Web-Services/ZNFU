<script setup>
import { onBeforeUnmount, ref, watch } from "vue";
import { ArrowUpRight, Menu, X } from "@lucide/vue";

import BrandMark from "@/components/BrandMark.vue";
import { brand, navLinks } from "@/data/home";

/** Current route path, so the matching link can be marked. */
defineProps({ path: { type: String, default: "/" } });

const open = ref(false);

watch(open, (isOpen) => {
  document.body.style.overflow = isOpen ? "hidden" : "";
});
onBeforeUnmount(() => (document.body.style.overflow = ""));
</script>

<template>
  <header class="v2-header">
    <div class="v2-header__bar">
      <a href="/" class="v2-header__brand" :aria-label="`${brand.fullName} — home`" @click="open = false">
        <BrandMark tone="dark" compact />
        <span>ZNFU</span>
      </a>

      <nav class="v2-header__nav" aria-label="Main navigation">
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          :aria-current="path === link.href ? 'page' : undefined"
          >{{ link.label }}</a
        >
      </nav>

      <a href="/apply-membership" class="v2-btn v2-btn--maize v2-header__cta">
        Join ZNFU
        <ArrowUpRight class="h-4 w-4" aria-hidden="true" />
      </a>

      <button
        type="button"
        class="v2-header__toggle"
        :aria-expanded="open"
        aria-controls="v2-menu"
        :aria-label="open ? 'Close menu' : 'Open menu'"
        @click="open = !open"
      >
        <X v-if="open" class="h-5 w-5" aria-hidden="true" />
        <Menu v-else class="h-5 w-5" aria-hidden="true" />
      </button>
    </div>

    <nav v-if="open" id="v2-menu" class="v2-menu" aria-label="Mobile navigation">
      <a
        v-for="link in navLinks"
        :key="link.href"
        :href="link.href"
        @click="open = false"
        >{{ link.label }}</a
      >
      <a href="/apply-membership" class="v2-btn v2-btn--maize" @click="open = false">Join ZNFU</a>
    </nav>
  </header>
</template>

<style scoped>
.v2-header {
  position: fixed;
  z-index: 50;
  top: 0.75rem;
  right: 0;
  left: 0;
  padding-inline: var(--v2-gutter, 1rem);
  pointer-events: none;
}

.v2-header__bar {
  display: flex;
  max-width: 84rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-inline: auto;
  padding: 0.5rem 0.55rem 0.5rem 0.6rem;
  border-radius: 9999px;
  background: #fff;
  box-shadow: 0 10px 30px -14px rgb(6 37 26 / 0.35);
  pointer-events: auto;
}

.v2-header__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  color: #0c3720;
  font-weight: 700;
  letter-spacing: -0.02em;
  text-decoration: none;
}

.v2-header__brand :deep(img) {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
}

.v2-header__nav {
  display: none;
  gap: 0.15rem;
}

.v2-header__nav a {
  padding: 0.55rem 0.95rem;
  border-radius: 9999px;
  color: #10241a;
  font-size: 0.92rem;
  font-weight: 560;
  text-decoration: none;
  transition: background-color 160ms ease;
}

.v2-header__nav a:hover {
  background: #eaf0e4;
}

.v2-header__nav a[aria-current="page"] {
  background: #0c3720;
  color: #fff;
}

.v2-header__cta {
  display: none;
  min-height: 2.6rem;
}

.v2-header__toggle {
  display: grid;
  width: 2.6rem;
  height: 2.6rem;
  place-items: center;
  border-radius: 9999px;
  background: #0c3720;
  color: #fff;
  cursor: pointer;
}

.v2-menu {
  position: fixed;
  z-index: -1;
  inset: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 6rem 1.5rem 2rem;
  background: #0c3720;
  pointer-events: auto;
}

.v2-menu a:not(.v2-btn) {
  padding-block: 0.5rem;
  color: #fff;
  font-size: clamp(2rem, 9vw, 3rem);
  font-weight: 650;
  letter-spacing: -0.04em;
  text-decoration: none;
}

.v2-menu .v2-btn {
  align-self: flex-start;
  margin-top: 1rem;
}

@media (min-width: 64rem) {
  .v2-header__nav,
  .v2-header__cta {
    display: flex;
  }
  .v2-header__toggle,
  .v2-menu {
    display: none;
  }
}
</style>
