import { createApp } from 'vue'

// Self-hosted variable fonts. Fontsource declares unicode-ranges, so unused
// subsets are never downloaded. Outfit is weight-only (smallest useful
// payload); Fraunces additionally carries the optical-size (`opsz`) axis via
// `opsz.css`, so the same file reads crisp at heading sizes and richer at the
// hero's larger display size — `font-optical-sizing: auto` is the browser
// default, no extra CSS needed.
import '@fontsource-variable/outfit/wght.css'
import '@fontsource-variable/fraunces/opsz.css'

import './style.css'
import App from './App.vue'
import { logo } from './data/home'
import { reveal } from './directives/reveal'

// Favicon comes from the real logo asset, so it is versioned by the bundler.
const favicon = document.createElement('link')
favicon.rel = 'icon'
favicon.type = 'image/jpeg'
favicon.href = logo
document.head.appendChild(favicon)

createApp(App).directive('reveal', reveal).mount('#app')
