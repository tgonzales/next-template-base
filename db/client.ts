import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"

import * as schema from "./schema"

// Koder DB-native: DATABASE_URL (+ DATABASE_AUTH_TOKEN) are injected automatically
// for cloud projects that use a database. Import { db } here and query with Drizzle.
export const db = drizzle(
  createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  }),
  { schema }
)
