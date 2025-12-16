import { child, get, onValue, Unsubscribe } from "firebase/database"
import { createAPI } from "./create-api"
import type { ApiWithCache } from "./create-api-server"

const logRequests = !!import.meta.env.VITE_DEBUG_API

export interface Item {
  id: number
  title?: string
  score?: number
  by?: string
  time: number
  type?: string
  url?: string
  text?: string
  kids?: number[]
  descendants?: number
  __lastUpdated?: number
}

export interface User {
  id: string
}

const api = createAPI({
  version: "/v0",
  config: {
    databaseURL: "https://hacker-news.firebaseio.com"
  }
})

const serverApi = api as ApiWithCache

if (serverApi.onServer) {
  warmCache()
}

function warmCache(): void {
  fetchItems((serverApi.cachedIds?.top || []).slice(0, 30))
  setTimeout(warmCache, 1000 * 60 * 15)
}

async function fetch<T>(path: string): Promise<T | null> {
  logRequests && console.log(`fetching ${path}...`)

  const cache = serverApi.cachedItems
  if (cache && cache.has(path)) {
    logRequests && console.log(`cache hit for ${path}.`)
    return cache.get(path) ?? null
  }

  const snapshot = await get(child(api, path))
  const val = snapshot.val() as T | null

  if (val && typeof val === "object") {
    ; (val as any).__lastUpdated = Date.now()
  }

  cache?.set(path, val)
  return val
}

export function fetchIdsByType(type: string): Promise<number[]> {
  if (serverApi.cachedIds?.[type]) {
    return Promise.resolve(serverApi.cachedIds[type])
  }
  return fetch<number[]>(`${type}stories`).then(r => r ?? [])
}

export function fetchItem(id: number): Promise<Item | null> {
  return fetch<Item>(`item/${id}`)
}

export function fetchItems(ids: number[]): Promise<(Item | null)[]> {
  return Promise.all(ids.map(fetchItem))
}

export function fetchUser(id: string): Promise<User | null> {
  return fetch<User>(`user/${id}`)
}

export function watchList(
  type: string,
  cb: (ids: number[]) => void
): Unsubscribe {
  let first = true
  const listRef = child(api, `${type}stories`)

  return onValue(listRef, snapshot => {
    if (first) {
      first = false
      return
    }
    cb(snapshot.val() || [])
  })
}
