import { IDailyEntry } from './IDailyEntry';
import { IEntryListItem } from './IEntryListItem';

export interface IRepository {
    addEntry: (entry: IDailyEntry) => boolean;
    editEntry: (entry: IDailyEntry) => boolean;
    deleteEntry: (dateID: string) => boolean;
    readEntry: (dateID: string) => IDailyEntry | null;
    listEntries: () => Array<IEntryListItem>;
    entryExists: (dateID: string) => boolean;
    exportEntries: () => boolean;
}