import { IEntryListItem } from "./IEntryListItem";

export interface IJsonList {
    [dateID: string]: Omit<IEntryListItem, "dateID"> | undefined;
}
