import { createApp } from "./app"
import type { RouteRecordNormalized } from "vue-router"
import { setActivePinia } from "pinia"
import { useMainStore } from "./store"

interface RenderContext {
  url: string
  state?: any
}

export async function render(context: RenderContext) {
  const { app, router, pinia } = createApp()

  router.push(context.url)
  await router.isReady()

  setActivePinia(pinia)
  const store = useMainStore()

  const route = router.currentRoute.value
  const matched = route.matched

  if (!matched.length) {
    throw { code: 404 }
  }

  const asyncDataHooks = matched
    .map((record: RouteRecordNormalized) => {
      const comp = record.components?.default as any
      return comp?.asyncData
    })
    .filter(Boolean)

  await Promise.all(
    asyncDataHooks.map((hook: any) =>
      hook({
        store,
        route
      })
    )
  )

  context.state = pinia.state.value

  return app
}
