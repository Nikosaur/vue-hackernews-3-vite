import { DatabaseReference } from "firebase/database"
import { LRUCache } from "lru-cache"
import { createAPI as createClientAPI } from "./create-api-client"
import { createAPI as createServerAPI } from "./create-api-server"

interface CreateAPIOptions {
    config: object
    version: string
}

export type FirebaseAPI = DatabaseReference & {
    onServer?: boolean
    cachedItems?: LRUCache<string, any>
    cachedIds?: Record<string, number[]>
}

export function createAPI(options: CreateAPIOptions): FirebaseAPI {
    if (import.meta.env.SSR) {
        return createServerAPI(options) as FirebaseAPI
    }
    return createClientAPI(options) as FirebaseAPI
}