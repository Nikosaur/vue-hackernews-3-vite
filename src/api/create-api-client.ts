import { initializeApp, getApps } from "firebase/app"
import { getDatabase, ref, DatabaseReference } from "firebase/database"

interface CreateAPIOptions {
  config: object
  version: string
}

export function createAPI(
  { config, version }: CreateAPIOptions
): DatabaseReference {
  if (!getApps().length) {
    initializeApp(config)
  }

  const db = getDatabase(undefined, (config as any).databaseURL)
  return ref(db, version)
}