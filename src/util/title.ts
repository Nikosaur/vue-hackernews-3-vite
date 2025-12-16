import { getCurrentInstance, onMounted, onServerPrefetch } from "vue"

type TitleOption = string | (() => string)

function resolveTitle(): string | null {
  const instance = getCurrentInstance()
  if (!instance) return null

  const options = instance.type as any
  const title = options.title as TitleOption | undefined
  if (!title) return null

  return typeof title === "function" ? title() : title
}

function useTitle(): void {
  if (import.meta.env.SSR) {
    onServerPrefetch(() => {
      const title = resolveTitle()
      if (title) {
        ; (globalThis as any).__VUE_SSR_CONTEXT__.title =
          `Vue HN 2.0 | ${title}`
      }
    })
  } else {
    onMounted(() => {
      const title = resolveTitle()
      if (title) {
        document.title = `Vue HN 2.0 | ${title}`
      }
    })
  }
}

export { useTitle }

export default {
  setup() {
    useTitle()
  }
}
