<script setup>
/**
 * Resolves an icon by name from the data layer, so `src/data/home.js` can
 * describe sections declaratively without importing components.
 */
import { Newspaper, Scale, Store, TrendingUp, Truck, Users } from '@lucide/vue'

const registry = { Scale, Users, Newspaper, TrendingUp, Truck, Store }

defineProps({
  name: { type: String, required: true },
})
</script>

<template>
  <component :is="registry[name]" aria-hidden="true" />
</template>
