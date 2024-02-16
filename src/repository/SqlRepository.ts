import { getDatabase } from '../db';
import { IAverageDetails } from '../types/IAverageDetails';
import { IDailyEntry } from '../types/IDailyEntry';
import { IEntryListItem } from '../types/IEntryListItem';
import { IRepository } from '../types/IRepository';
import path from "path";
import fs from "fs";
import { JsonFS } from '../util/JsonFS';
import { validateBackupFile } from '../validations/validateBackupFile';
import Database from 'better-sqlite3';
import { insertCategories } from '../util/insertCategories';

/**
 * Singleton class
 */
export class SqlRepository implements IRepository {
    private static _instance: SqlRepository;
    private readonly db: Database.Database;
    private constructor() {
        this.db = getDatabase();
    }

    // TODO: refactor
    public addEntry (entry: IDailyEntry): boolean {
        const creationDate = entry.creationDate.toString();
        const modificationDate = entry.modificationDate.toString();
        const res1 = this.db.prepare(`INSERT INTO entries (dateID, title, description,
            mood, wordCount, creationDate, modificationDate) VALUES 
            (@dateID, @title, @description,
                @mood, @wordCount, @creationDate, @modificationDate)`)
            .run({ ...entry, creationDate, modificationDate });
        
        if(res1.changes == 0) {
            return false;
        }
        if(entry.categories.length == 0) {
            return res1.changes == 1;
        }

        insertCategories(entry.dateID, entry.categories);
        
        return true;
    };

    public editEntry (entry: IDailyEntry): boolean {
        const creationDate = entry.creationDate.toString();
        const modificationDate = entry.modificationDate.toString();
        const res1 = this.db.prepare(`UPDATE entries SET title=@title, description=@description,
            mood=@mood, wordCount=@wordCount, modificationDate=@modificationDate WHERE dateID = @dateID`)
            .run({ ...entry, creationDate, modificationDate });

        if(res1.changes == 0) {
            return false;
        }
        this.db.prepare("DELETE FROM entriesCategories where dateID = ?").run(entry.dateID);
        if(entry.categories.length == 0) {
            return res1.changes == 1;
        }
        insertCategories(entry.dateID, entry.categories);
        
        return true;
    };

    public deleteEntry (dateID: string): boolean {
        this.db.prepare("DELETE FROM entriesCategories where dateID = ?").run(dateID);
        const res = this.db.prepare("DELETE FROM entries WHERE dateID = ?").run(dateID);
        return res.changes == 1;
    };

    public readEntry (dateID: string): IDailyEntry | null {
        const entry = this.db.prepare("SELECT * FROM entries WHERE dateID = ?").get(dateID) as IDailyEntry;
        const categories = this.db.prepare("SELECT * FROM entriesCategories WHERE dateID = ?").all(dateID);

        entry.categories = [ ...categories.map((c: any) => c.categoryName) ];
        return entry;
    };

    public listEntries (filterCategory?: string): Array<IEntryListItem> {
        const entries = this.db.prepare("SELECT * FROM entries").all() as Array<IDailyEntry>;
        const mappedEntries: Array<IEntryListItem> = []
        for(const entry of entries) {
                const categories = this.db.prepare("SELECT * FROM entriesCategories WHERE dateID = ?")
                    .all(entry.dateID)
                    .map((c: any) => c.categoryName.toLowerCase());
                
                if(filterCategory && !categories.includes(filterCategory.toLowerCase()))
                    continue;

                mappedEntries.push({
                    dateID: entry.dateID,
                    title: entry.title,
                    mood: entry.mood,
                    wordCount: entry.wordCount,
                    categories: categories.map(c => c.categoryName)
                });
            }
        
        return Object.values(mappedEntries);
    }

    public exportEntries (exportPath: string): void {
        const dirname = path.dirname(exportPath);
        if(!fs.existsSync(dirname))
            fs.mkdirSync(dirname);

        const entriesIDs = this.db.prepare("SELECT dateID FROM entries").all() as Pick<IDailyEntry, "dateID">[];
        const entries: IDailyEntry[] = [];
        entriesIDs.map(({ dateID }) => {
            const entry = this.readEntry(dateID);
            if(entry)
                entries.push(entry);
        });
        const jsonfs = new JsonFS();
        jsonfs.writeSync(exportPath, entries);
    };

    public importEntries (importPath: string): void {
        const jsonfs = new JsonFS();
        const entries = jsonfs.read(importPath, validateBackupFile);
        entries.forEach(e => {
            if(this.entryExists(e.dateID))
                this.editEntry(e);
            else
                this.addEntry(e);
        });
    }

    public entryExists (dateID: string): boolean {
        const result = this.db.prepare("SELECT dateID from entries WHERE dateID = ?").get(dateID);
        return result != undefined;
    };
    
    public entriesAverageDetails (): IAverageDetails {
        return null as any;
    };

    public static instance() {
        if(!SqlRepository._instance) {
            SqlRepository._instance = new SqlRepository();
        }

        return SqlRepository._instance;
    }
}
