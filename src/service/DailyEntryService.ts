import { IAverageDetails } from '../types/IAverageDetails';
import { IDailyEntry } from '../types/IDailyEntry';
import { IEntryListItem } from '../types/IEntryListItem';
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
        entry.wordCount = entry.description.split(" ").length;
        entry.modificationDate = entry.creationDate;
        return this.repository.editEntry(entry);
    };

    public deleteEntry (dateID: string): boolean {
        return this.repository.deleteEntry(dateID);
    };

    public readEntry (dateID: string): IDailyEntry | null {
        return this.repository.readEntry(dateID);
    };

    public listEntries (): Array<IEntryListItem> {
        return this.repository.listEntries();
    };

    public exportEntries (): boolean {
        return null as any;
    };

    public entryExists (dateID: string): boolean {
        return this.repository.entryExists(dateID);
    };
    
    public entriesAverageDetails (): IAverageDetails {
        return this.repository.entriesAverageDetails();
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
