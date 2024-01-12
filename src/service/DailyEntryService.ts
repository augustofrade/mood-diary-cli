import { IDailyEntry } from '../types/IDailyEntry';
import { IRepository } from '../types/IRepository';

export class DailyEntryService implements IRepository {
    private static _instance: DailyEntryService;
    private repository!: IRepository;
    private constructor() {}

    public addEntry (entry: IDailyEntry): boolean {
        entry.wordCount = entry.description.split(" ").length;
        entry.creationDate = new Date();
        entry.modificationDate = entry.creationDate;
        return this.repository.addEntry(entry);
    };
    
    public editEntry (entry: IDailyEntry): boolean {
        return null as any;
    };

    public deleteEntry (dateID: string): boolean {
        return null as any;
    };

    public readEntry (dateID: string): IDailyEntry {
        return null as any;
    };

    public listEntries (): IDailyEntry[] {
        return null as any;
    };

    public exportEntires (): boolean {
        return null as any;
    };

    public static instance() {
        if(!DailyEntryService._instance) {
            DailyEntryService._instance = new DailyEntryService();
        }

        return DailyEntryService._instance;
    }

    public setRepository(repository: IRepository) {
        this.repository = repository;
    }
}
