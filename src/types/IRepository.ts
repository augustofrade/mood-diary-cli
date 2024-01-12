import { IDailyEntry } from './IDailyEntry';
import { IEntryListItem } from './IEntryListItem';

export interface IRepository {
    addEntry: (entry: IDailyEntry) => boolean;
    editEntry: (entry: IDailyEntry) => boolean;
    deleteEntry: (dateID: string) => boolean;
    readEntry: (dateID: string) => IDailyEntry;
    listEntries: () => Array<IEntryListItem>;
    exportEntries: () => boolean;
}