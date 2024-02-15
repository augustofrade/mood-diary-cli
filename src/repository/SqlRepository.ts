import { db } from '../db';
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

/**
 * Singleton class
 */
export class SqlRepository implements IRepository {
    private static _instance: SqlRepository;
    private constructor() {}

    // TODO: refactor
    public addEntry (entry: IDailyEntry): boolean {
        const creationDate = entry.creationDate.toString();
        const modificationDate = entry.modificationDate.toString();
        const res1 = db.prepare(`INSERT INTO entries (dateID, title, description,
            mood, wordCount, creationDate, modificationDate) VALUES 
            (@dateID, @title, @description,
                @mood, @wordCount, @creationDate, @modificationDate)`)
            .run({... entry, creationDate, modificationDate });

        if(entry.categories.length == 0) {
            return res1.changes == 1;
        }
        
        const insertCategory = db.prepare(`INSERT INTO entriesCategories 
            (dateID, categoryName) VALUES (@dateID, @categoryName)`);
                
        const insertMany = db.transaction((categories) => {
            for (const category of categories) {
                console.log(category);
                insertCategory.run(category);
            }
        })
        const categoryMap = entry.categories.map(c => ({
            dateID: entry.dateID, categoryName: c
        }));

        const res2 = insertMany(categoryMap);
        
        return res1.changes == 1;
    };

    public editEntry (details: IDailyEntry): boolean {
        return null as any;
    };

    public deleteEntry (dateID: string): boolean {
        return null as any;
    };

    public readEntry (dateID: string): IDailyEntry | null {
        const entries = db.prepare("SELECT * FROM entries e INNER JOIN entriesCategories c ON e.dateID = c.dateID WHERE e.dateID = ?").all(dateID) as Array<IDailyEntry>;
        if(entries.length == 0)
            return null;

        const entry: IDailyEntry = entries[0];
        entry.categories = [ ...entries.map((e: any) => e.categoryName) ];
        delete (entry as any).categoryName;
        return entry;
    };

    // TODO: refactor
    // TODO: remove IEntryFilter from everything -> pointless
    public listEntries (filter?: IEntryFilter): Array<IEntryListItem> {
        const createQuery = (filter?: IEntryFilter) => {
            const filterArray: string[] = [];
            if(filter?.category)
                filterArray.push(`c.categoryName = '${filter.category}'`);
            let query = "SELECT * FROM entries e INNER JOIN entriesCategories c ON e.dateID = c.dateID ";
            if(filterArray.length > 0) {

                query = query.concat(`WHERE ${filterArray.join(" AND ")}`)
                console.log(query)
            }
            return query;
        }

        const entries = db.prepare(createQuery(filter)).all() as Array<IDailyEntry>;
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

        const entries = this.listEntries();
        const jsonfs = new JsonFS();
        jsonfs.writeSync(exportPath, entries);
    };

    public importEntries (importPath: string): void {
        const jsonfs = new JsonFS();
        const entries = jsonfs.read(importPath, validateBackupFile);
        entries.forEach(e => this.addEntry(e));
    }

    public entryExists (dateID: string): boolean {
        const result = db.prepare("SELECT dateID from entries WHERE dateID = ?").get(dateID);
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
