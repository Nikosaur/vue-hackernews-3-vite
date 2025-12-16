// src/api/index.d.ts
import type { Unsubscribe } from "firebase/database"

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

// Ambil list ID berdasarkan tipe (top, new, show, ask, jobs)
export function fetchIdsByType(type: string): Promise<number[]>

// Ambil data item per ID
export function fetchItem(id: number): Promise<Item | null>

// Ambil banyak item sekaligus
export function fetchItems(ids: number[]): Promise<(Item | null)[]>

// Ambil data user per ID
export function fetchUser(id: string): Promise<User | null>

// Watch list untuk update realtime
export function watchList(
    type: string,
    callback: (ids: number[]) => void
): Unsubscribe
