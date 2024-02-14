import { db } from '../db';
import { IAverageDetails } from '../types/IAverageDetails';
import { IDailyEntry } from '../types/IDailyEntry';
import { IEntryFilter } from '../types/IEntryFilter';
import { IEntryListItem } from '../types/IEntryListItem';
import { IRepository } from '../types/IRepository';

/**
 * Singleton class
 */
export class SqlRepository implements IRepository {
    private static _instance: SqlRepository;
    private constructor() {}

    public addEntry (entry: IDailyEntry): boolean {
        const creationDate = entry.creationDate.toString();
        const modificationDate = entry.modificationDate.toString();
        entry.categories = undefined as any;
        const xaa = db.prepare(`INSERT INTO entries (dateID, title, description,
            mood, wordCount, creationDate, modificationDate) VALUES 
            (@dateID, @title, @description,
                @mood, @wordCount, @creationDate, @modificationDate)`)
            .run({... entry, creationDate, modificationDate });
        return xaa.changes == 1;
    };

    public editEntry (details: IDailyEntry): boolean {
        return null as any;
    };

    public deleteEntry (dateID: string): boolean {
        return null as any;
    };

    public readEntry (dateID: string): IDailyEntry | null {
        return null as any;
    };

    public listEntries (filter?: IEntryFilter): Array<IEntryListItem> {
        const entries = db.prepare("SELECT * FROM entries").run();
        console.log(entries);
        return null as any;
    }

    public exportEntries (exportPath: string): void {
        return null as any;
    };

    public importEntries (importPath: string): void {
        return null as any;
    }

    public entryExists (dateID: string): boolean {
        return null as any;
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
