import { initializeApp, getApps } from "firebase/app"
import { getDatabase, ref, onValue, DatabaseReference } from "firebase/database"
import { LRUCache } from "lru-cache"

export type ApiWithCache = DatabaseReference & {
  onServer?: boolean
  cachedItems?: LRUCache<string, any>
  cachedIds?: Record<string, number[]>
}

interface CreateAPIOptions {
  config: object
  version: string
}

export function createAPI({ config, version }: CreateAPIOptions): ApiWithCache {
  const g = globalThis as any

  if (g.__API__) {
    return g.__API__
  }

  if (!getApps().length) {
    initializeApp(config)
  }

  const database = getDatabase()
  const api = ref(database, version) as ApiWithCache

  api.onServer = true

  api.cachedItems = new LRUCache({
    max: 1000,
    ttl: 1000 * 60 * 15
  })

  api.cachedIds = {}

    ;["top", "new", "show", "ask", "job"].forEach(type => {
      const listRef = ref(database, `${version}/${type}stories`)
      onValue(listRef, snapshot => {
        api.cachedIds![type] = snapshot.val() || []
      })
    })

  g.__API__ = api
  return api
}
