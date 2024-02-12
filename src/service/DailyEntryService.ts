import { IAverageDetails } from '../types/IAverageDetails';
import { IDailyEntry } from '../types/IDailyEntry';
import { IEntryFilter } from '../types/IEntryFilter';
import { IEntryListItem } from '../types/IEntryListItem';
import { IRepository } from '../types/IRepository';
import { MoodEnum } from '../types/enum';

/**
 * Singleton class
 */
export class DailyEntryService implements IRepository {
    private static _instance: DailyEntryService;
    private repository!: IRepository;
    private constructor() {}

    /**
     * Creates a new entry under:\
     * **JSON**: *{basePath}/entries*\
     * **SQL**: *{basePath}/diary.db*
     */
    public addEntry (entry: IDailyEntry): boolean {
        const todayDate = new Date();
        return this.repository.addEntry({
            dateID: entry.dateID,
            title: entry.title,
            description: entry.description,
            categories: entry.categories,
            mood: entry.mood,
            wordCount: entry.description.split(" ").length,
            creationDate: todayDate,
            modificationDate: todayDate
        });
    };
    
    /**
     * Overwrites an entry by the dateID in the "entry" object
     */
    public editEntry (entry: IDailyEntry): boolean {
        entry.modificationDate = new Date();
        entry.wordCount = entry.description.split(" ").length;
        return this.repository.editEntry(entry);
    };

    /**
     * Deletes any entry the date ID
     */
    public deleteEntry (dateID: string): boolean {
        return this.repository.deleteEntry(dateID);
    };

    /**
     * Returns an entry if found by date ID or null if not
     */
    public readEntry (dateID: string): IDailyEntry | null {
        return this.repository.readEntry(dateID);
    };

    /**
     * List all entries
     */
    public listEntries (filter?: IEntryFilter): Array<IEntryListItem> {
        return this.repository.listEntries(filter);
    };

    /**
     * Exports/backups all entries under a single JSON file to the given export path
     */
    public exportEntries (exportPath: string): void {
        this.repository.exportEntries(exportPath);
    };

    /**
     * Imports all entries from a JSON backup file
     */
    public importEntries (importPath: string): void {
        this.repository.importEntries(importPath);
    }

    /**
     * Checks if entry exists
     */
    public entryExists (dateID: string): boolean {
        return this.repository.entryExists(dateID);
    };
    
    /**
     * Returns summarized details about the entries saved
     */
    public entriesAverageDetails (): IAverageDetails {
        return this.repository.entriesAverageDetails();
    };

    /**
     * Singleton instantiation method
     */
    public static instance() {
        if(!DailyEntryService._instance) {
            DailyEntryService._instance = new DailyEntryService();
        }

        return DailyEntryService._instance;
    }

    /**
     * Sets storage repository to whether JSON or SQL when initializing the program
     */
    public setRepository(repository: IRepository) {
        this.repository = repository;
    }
}
