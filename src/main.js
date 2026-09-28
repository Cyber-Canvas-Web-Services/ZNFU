import { createApp } from 'vue'

// Self-hosted variable fonts — weight axis only (smallest useful payload).
// Fontsource declares unicode-ranges, so unused subsets are never downloaded.
import '@fontsource-variable/inter/wght.css'
import '@fontsource-variable/fraunces/wght.css'

import './style.css'
import App from './App.vue'
import { reveal } from './directives/reveal'

createApp(App).directive('reveal', reveal).mount('#app')
