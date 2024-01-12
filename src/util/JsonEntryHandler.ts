import fs from 'fs';
import path from 'path';

import { MoodEnum } from '../types/enum';
import { IDailyEntry } from '../types/IDailyEntry';
import { IJsonList } from '../types/IJsonList';
import { basePath } from './directories';
import { JsonFS } from './JsonFS';
import { IEntryListItem } from '../types/IEntryListItem';

/**
 * Class for CRUD operations regarding entry listing
 * while using the JSON storage method for a faster listing and mood tracking.
 * Appends, deletes, reads and updates "diary/json_entry_details.json"
 */
export class JsonEntryHandler {
    private readonly listPath: string = path.join(basePath, "json_entry_details.json");
    private readonly jsonfs: JsonFS;
    public constructor() {
        this.jsonfs = new JsonFS();
    }

    private verifyFile() {
        // TODO: add schema validation
        if(!fs.existsSync(this.listPath))
            this.jsonfs.writeSync(this.listPath, {});
    }

    public set(entry: IDailyEntry): void {
        this.verifyFile();
        const savedEntries: IJsonList = this.jsonfs.read(this.listPath)!;
        savedEntries[entry.dateID] = {
            title: entry.title,
            mood: MoodEnum[entry.mood] as unknown as number,
            wordCount: entry.wordCount
        }
        this.jsonfs.writeSync(this.listPath, savedEntries);
    }

    public remove(dateID: string): void {
        this.verifyFile();
        const entries: IJsonList = this.jsonfs.read(this.listPath)!;
        entries[dateID] = undefined;
        this.jsonfs.write(this.listPath, entries);
    }

    public list(): Array<IEntryListItem> {
        this.verifyFile();
        const entries: IJsonList = this.jsonfs.read<IJsonList>(this.listPath)!;
        const list: Array<IEntryListItem> = Object.entries(entries).map(([key, details]) => {
            const d = details as unknown as IEntryListItem;
            return {
                dateID: key,
                title: d.title,
                mood: d.mood,
                wordCount: d.wordCount
            }
        });
        return list;
    }
}