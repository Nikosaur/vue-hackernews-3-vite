import { createApp as createVueApp, type Component } from "vue"
import type { RouteLocationNormalized } from "vue-router"
import { createApp } from "./app"
import ProgressBar from "./components/ProgressBar.vue"
import { setActivePinia } from "pinia"
import { useMainStore } from "./store"

const { app, router, pinia } = createApp()

const barRoot = document.createElement("div")
document.body.appendChild(barRoot)
const bar = createVueApp(ProgressBar).mount(barRoot) as any
app.config.globalProperties.$bar = bar

setActivePinia(pinia)
const store = useMainStore()

if ((window as any).__INITIAL_STATE__) {
  store.$state = (window as any).__INITIAL_STATE__
}

router.isReady().then(() => {
  router.beforeResolve(async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    const matched = to.matched
    const prevMatched = from.matched

    let diffed = false
    const activated = matched.filter((record, i) => {
      return diffed || (diffed = prevMatched[i] !== record)
    })

    const asyncDataHooks = activated
      .map(record => (record.components?.default as Component & any)?.asyncData)
      .filter(Boolean)

    if (!asyncDataHooks.length) return

    bar.start()
    try {
      await Promise.all(
        asyncDataHooks.map(hook => hook({ store, route: to }))
      )
      bar.finish()
    } catch (err) {
      bar.finish()
      throw err
    }
  })

  app.mount("#app")
})
