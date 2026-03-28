
/**
 * Database Migration Script
 *
 * This script applies Drizzle migrations to your Neon PostgreSQL database.
 * Run it with: npm run db:migrate
 */

import * as dotenv from "dotenv"
import { migrate } from "drizzle-orm/neon-http/migrator" 
import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"

dotenv.config({ path: ".env.local" })

/**
 * Validation
 * 
 * We're checking here DATABASE_URL provided or not
 * If not provided then we stop the next process throw error
 */

const DATABASE_URL = process.env.DATABASE_URL as string
if (!DATABASE_URL) throw new Error("Database connection not provided")

async function runMigrations() {
    console.log("🔄 Starting database migration...");

    try {
        const sql = neon(DATABASE_URL) // Neon connection
        const db  = drizzle(sql)       // Drizzle connectuin via neon

        await migrate(db, { migrationsFolder: "./drizzle" })
        console.log("✅ Database migration completed successfully!");
    } catch (error: unknown) {
        console.log("Migration Error", error)
        process.exit(1)
    }
}

runMigrations()
