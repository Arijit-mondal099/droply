
/**
 * Drizzle Configuration
 *
 * This file configures Drizzle ORM to work with our Neon PostgreSQL database.
 * It's used by the Drizzle CLI for schema migrations and generating SQL.
 */

import * as dotenv from "dotenv"
import { defineConfig } from "drizzle-kit"

dotenv.config({ path: ".env.local" })


/**
 * Validation
 * 
 * We're checking here DATABASE_URL provided or not
 * If not provided then we stop the next process throw error
 */

const DATABASE_URL = process.env.DATABASE_URL as string
if (!DATABASE_URL) throw new Error("Database connection not provided")

export default defineConfig({
    schema       : './lib/db/schema.ts',
    out          : './drizzle',
    dialect      : 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
    migrations   : {
        table : "__drizzle_migration",
        schema: "public"
    },
    verbose      : true,
    strict       : true
})
