import { createSSRApp } from "vue"
import { createPinia } from "pinia"
import { createRouter, createMemoryHistory } from "vue-router"
import App from "./App.vue"
import router from "./router"
import titleMixin from "./util/title.ts"
import * as filters from "./util/filters.ts"

export function createApp() {
  const app = createSSRApp(App)

  const pinia = createPinia()
  // Create a new router instance for SSR with memory history
  const ssrRouter = createRouter({
    history: createMemoryHistory(),
    routes: router.options.routes
  })

  app.use(pinia)
  app.use(ssrRouter)

  app.mixin(titleMixin)

  Object.keys(filters).forEach(key => {
    app.config.globalProperties[`$${key}`] = filters[key as keyof typeof filters]
  })

  return {
    app,
    router: ssrRouter,
    pinia
  }
}
