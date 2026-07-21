import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"

import * as schema from "./schema"

// Koder DB-native: DATABASE_URL (+ DATABASE_AUTH_TOKEN) are injected
// automatically for cloud projects that use a database — but only a few
// seconds AFTER the first schema lands (lazy provisioning). Guard that
// window: without the guard, importing { db } while DATABASE_URL is still
// missing crashed the whole dev server with URL_INVALID 'undefined', taking
// down pages that never touch the database. Now the app renders normally and
// only a route that actually USES db throws, with an actionable message.
function makeDb() {
  const url = process.env.DATABASE_URL
  if (!url) {
    return new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
      get() {
        throw new Error(
          "Database not provisioned yet: DATABASE_URL is missing. It is injected automatically shortly after the first schema is created — reload the preview in a few seconds."
        )
      },
    })
  }
  return drizzle(
    createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN }),
    { schema }
  )
}

export const db = makeDb()
