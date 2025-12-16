import { defineStore } from "pinia"
import { fetchUser, fetchItems, fetchIdsByType } from "../api"

export interface Item {
  id: number
  title: string
  by: string
  time: number
  score: number
  type: string
  url: string
  text: string
  kids: number[]
  descendants: number
  __lastUpdated: number
}

export interface State {
  activeType: string | null
  itemsPerPage: number
  items: Record<number, Item>
  users: Record<string, any>
  lists: Record<string, number[]>
}

export const useMainStore = defineStore("main", {
  state: (): State => ({
    activeType: null,
    itemsPerPage: 20,
    items: {},
    users: {},
    lists: {
      top: [],
      new: [],
      show: [],
      ask: [],
      job: []
    }
  }),

  getters: {
    activeIds: (state) => {
      return (page: number) => {
        if (!state.activeType) return []
        const start = (page - 1) * state.itemsPerPage
        const end = page * state.itemsPerPage
        return state.lists[state.activeType].slice(start, end)
      }
    },

    activeItems(state) {
      return (page: number) =>
        this.activeIds(page)
          .map(id => {
            const item = state.items[id]
            if (!item) return null
            return {
              id: item.id,
              title: item.title || "No title",
              by: item.by || "Unknown",
              time: item.time,
              score: item.score ?? 0,
              type: item.type || "",
              url: item.url || "",
              text: item.text || "",
              kids: item.kids || [],
              descendants: item.descendants ?? 0,
              __lastUpdated: item.__lastUpdated || Date.now()
            }
          })
          .filter(Boolean) as Item[]
    }
  },

  actions: {
    async FETCH_LIST_DATA(type: string) {
      this.activeType = type
      const ids = await fetchIdsByType(type)
      this.lists[type] = ids
    },

    async ENSURE_ACTIVE_ITEMS(ids: number[]) {
      await this.FETCH_ITEMS(ids)
    },

    async FETCH_ITEMS(ids: number[]) {
      const now = Date.now()
      const needFetch = ids.filter(id => {
        const item = this.items[id]
        if (!item) return true
        return now - item.__lastUpdated > 1000 * 60 * 3
      })

      if (!needFetch.length) return

      const items = await fetchItems(needFetch)
      items.forEach(item => {
        if (item) {
          this.items[item.id] = {
            id: item.id,
            title: item.title || "No title",
            by: item.by || "Unknown",
            time: item.time,
            score: item.score ?? 0,
            type: item.type || "",
            url: item.url || "",
            text: item.text || "",
            kids: item.kids || [],
            descendants: item.descendants ?? 0,
            __lastUpdated: item.__lastUpdated || Date.now()
          }
        }
      })
    },

    async FETCH_USER(id: string) {
      if (this.users[id]) return this.users[id]
      const user = await fetchUser(id)
      this.users[id] = user || false
      return user
    }
  }
})
