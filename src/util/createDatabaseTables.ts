import { getDatabase } from "../db";

export function createDatabaseTables() {
    const db = getDatabase();

    db.prepare(`CREATE TABLE IF NOT EXISTS entries (
        dateID              TEXT UNIQUE PRIMARY KEY NOT NULL,
        title               TEXT NOT NULL,
        description         TEXT,
        mood                INTEGER NOT NULL,
        wordCount           INTEGER NOT NULL,
        creationDate        TEXT NOT NULL,
        modificationDate    TEXT NOT NULL
    )`).run();

    db.prepare(`CREATE TABLE IF NOT EXISTS entriesCategories (
        categoryName        TEXT NOT NULL,
        dateID              TEXT NOT NULL,
        FOREIGN KEY(dateID) REFERENCES entries(dateID)
    )`).run();
}