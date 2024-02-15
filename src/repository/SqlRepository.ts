import { getDatabase } from '../db';
import { IAverageDetails } from '../types/IAverageDetails';
import { IDailyEntry } from '../types/IDailyEntry';
import { IEntryFilter } from '../types/IEntryFilter';
import { IEntryListItem } from '../types/IEntryListItem';
import { IRepository } from '../types/IRepository';
import { ISqlCategory } from '../types/ISqlCategory';
import path from "path";
import fs from "fs";
import { JsonFS } from '../util/JsonFS';
import { validateBackupFile } from '../validations/validateBackupFile';
import Database from 'better-sqlite3';

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
            .run({... entry, creationDate, modificationDate });

        if(entry.categories.length == 0) {
            return res1.changes == 1;
        }
        
        const insertCategory = this.db.prepare(`INSERT INTO entriesCategories 
            (dateID, categoryName) VALUES (@dateID, @categoryName)`);
                
        const insertMany = this.db.transaction((categories) => {
            for (const category of categories) {
                insertCategory.run(category);
            }
        })
        const categoryMap = entry.categories.map(c => ({
            dateID: entry.dateID, categoryName: c
        }));

        insertMany(categoryMap);
        
        return res1.changes == 1;
    };

    public editEntry (details: IDailyEntry): boolean {
        return null as any;
    };

    public deleteEntry (dateID: string): boolean {
        this.db.prepare("DELETE FROM entriesCategories where dateID = ?").run(dateID);
        const res = this.db.prepare("DELETE FROM entries WHERE dateID = ?").run(dateID);
        return res.changes == 1;
    };

    public readEntry (dateID: string): IDailyEntry | null {
        const entries = this.db.prepare("SELECT * FROM entries e INNER JOIN entriesCategories c ON e.dateID = c.dateID WHERE e.dateID = ?").all(dateID) as Array<IDailyEntry>;
        if(entries.length == 0)
            return null;

        const entry: IDailyEntry = entries[0];
        entry.categories = [ ...entries.map((e: any) => e.categoryName) ];
        delete (entry as any).categoryName;
        return entry;
    };

    // TODO: refactor
    // TODO: redo and remove inner join -> categories with no entries are not being listed
    // TODO: remove IEntryFilter from everything -> pointless
    public listEntries (filter?: IEntryFilter): Array<IEntryListItem> {
        const createQuery = (filter?: IEntryFilter) => {
            const filterArray: string[] = [];
            if(filter?.category)
                filterArray.push(`c.categoryName = '${filter.category}'`);
            let query = "SELECT * FROM entries e RIGHT JOIN entriesCategories c ON e.dateID = c.dateID ";
            if(filterArray.length > 0) {
                query = query.concat(`WHERE ${filterArray.join(" AND ")}`)
            }
            return query;
        }

        const entries = this.db.prepare(createQuery(filter)).all() as Array<IDailyEntry>;
        const mappedEntries: Record<string, IEntryListItem> = {};
        for(const entry of entries) {
            if(mappedEntries[entry.dateID] == undefined) {
                mappedEntries[entry.dateID] = {
                    dateID: entry.dateID,
                    title: entry.title,
                    mood: entry.mood,
                    wordCount: entry.wordCount,
                    categories: []
                }
            }
            mappedEntries[entry.dateID].categories.push((entry as any).categoryName);
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
            if(!this.entryExists(e.dateID))
                this.addEntry(e);
            //else
            //    this.editEntry(e);
            // TODO: uncomment
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
