import { IDailyEntry } from "./IDailyEntry";

export interface IRepository {
    addEntry: (entry: IDailyEntry) => boolean;
    editEntry: (entry: IDailyEntry) => boolean;
    deleteEntry: (dateID: string) => boolean;
    readEntry: (dateID: string) => IDailyEntry;
    listEntries: () => Array<IDailyEntry>;
    exportEntires: () => boolean;
}