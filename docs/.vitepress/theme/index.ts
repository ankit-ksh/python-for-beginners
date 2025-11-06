import DefaultTheme from 'vitepress/theme'
import Questions from '../components/Questions.vue'
import PyPlayground from '../components/PyPlayground.vue'
import PlaygroundPortal from '../components/PlaygroundPortal.vue'
import { createApp, h } from 'vue'
import type { Theme } from 'vitepress'

const theme: Theme = {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // register global components
    app.component('Questions', Questions)
    app.component('PyPlayground', PyPlayground)

    // Mount a global portal so clicking a nav link to #playground opens the overlay
    if (typeof window !== 'undefined') {
      const id = 'pg-portal-root'
      let el = document.getElementById(id)
      if (!el) {
        el = document.createElement('div')
        el.id = id
        document.body.appendChild(el)
      }
      const portal = createApp({ render: () => h(PlaygroundPortal) })
      portal.mount(el)
    }
  }
}

export default theme
