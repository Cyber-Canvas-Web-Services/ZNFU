import { createApp } from 'vue'

// Self-hosted variable fonts — weight axis only (smallest useful payload).
// Fontsource declares unicode-ranges, so unused subsets are never downloaded.
import '@fontsource-variable/inter/wght.css'
import '@fontsource-variable/plus-jakarta-sans/wght.css'

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
