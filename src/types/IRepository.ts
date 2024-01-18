import { IAverageDetails } from './IAverageDetails';
import { IDailyEntry } from './IDailyEntry';
import { IEntryFilter } from './IEntryFilter';
import { IEntryListItem } from './IEntryListItem';

export interface IRepository {
    addEntry: (entry: IDailyEntry) => boolean;
    editEntry: (entry: IDailyEntry) => boolean;
    deleteEntry: (dateID: string) => boolean;
    readEntry: (dateID: string) => IDailyEntry | null;
    listEntries: (filter?: IEntryFilter) => Array<IEntryListItem>;
    entryExists: (dateID: string) => boolean;
    exportEntries: (exportPath: string) => void;
    importEntries: (importPath: string) => void;
    entriesAverageDetails: () => IAverageDetails;
}