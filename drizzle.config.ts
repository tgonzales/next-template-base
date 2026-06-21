import { defineConfig } from "drizzle-kit"

// Koder DB-native: the daemon provisions the database, injects DATABASE_URL /
// DATABASE_AUTH_TOKEN, and runs `drizzle-kit push` automatically (no migrations).
export default defineConfig({
  dialect: "turso",
  schema: "./db/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  },
})
