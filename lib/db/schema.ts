/**
 * Database Schema for Droply
 *
 * This file defines the database structure for our Droply application.
 * We're using Drizzle ORM with PostgreSQL (via Neon) for our database.
 */


import { integer, pgTable, text, uuid, boolean, timestamp } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"


/**
 * Files Table
 *
 * This table stores all files and folders in our Droply.
 * - Both files and folders are stored in the same table
 * - Folders are identified by the isFolder flag
 * - Files/folders can be nested using the parentId (creating a tree structure)
 */

export const files = pgTable("files", {
    id           : uuid("id").defaultRandom().primaryKey(),
    name         : text("name").notNull(),
    path         : text("path").notNull(),                        // Full path to the file/folder
    size         : integer("size").notNull(),
    type         : text("type").notNull(),                        // Type for folder and file
    fileUrl      : text("file_url").notNull(),                    // Url to access file
    thumbnailUrl : text("thumbnail_url"),
    userId       : text("user_id").notNull(),                     // Owner of the file/folder
    parentId     : uuid("parent_id"),                             // Parent folder ID (null for root)
    isFolder     : boolean("is_folder").default(false).notNull(),
    isStarrted   : boolean("is_starred").default(false).notNull(),
    isTrash      : boolean("is_trash").default(false).notNull(),
    createdAt    : timestamp("created_at").defaultNow().notNull(),
    updatedAt    : timestamp("updated_at").defaultNow().notNull(),
})


/**
 * File Relations
 *
 * This defines the relationships between records in our files table:
 * 1. parent - Each file/folder can have one parent folder
 * 2. children - Each folder can have many child files/folders
 *
 * This creates a hierarchical file structure similar to a real filesystem.
 */

export const fileRelations = relations(files, ({ one, many }) => ({
    parent  : one(files, {
        fields    : [files.userId], // Foreign key
        references: [files.id]      // Primary key
    }),
    children: many(files)
}))


/**
 * Type Definitions
 *
 * These types help with TypeScript integration:
 * - File: Type for retrieving file data from the database
 * - NewFile: Type for inserting new file data into the database
 */

export type File = typeof files.$inferSelect;
export type NewFile = typeof files.$inferInsert;
