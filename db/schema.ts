// Koder DB-native — Drizzle schema (libSQL/SQLite).
//
// Define your tables here ONLY when the app needs to persist data (to-do lists,
// CRUDs, dashboards, saved forms, auth…). Adding a `sqliteTable(...)` is what
// triggers the daemon to provision the database and apply this schema
// automatically via `drizzle-kit push` — there are NO migrations to write.
//
// Static apps (landing pages, marketing, calculators) need no database — leave
// this file without tables and no DB is provisioned.
//
// Example:
//   import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
//   export const todos = sqliteTable("todos", {
//     id: integer("id").primaryKey({ autoIncrement: true }),
//     title: text("title").notNull(),
//     done: integer("done", { mode: "boolean" }).notNull().default(false),
//     createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
//   })

export {}
