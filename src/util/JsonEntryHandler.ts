import fs from 'fs';
import path from 'path';

import { MoodEnum } from '../types/enum';
import { IAverageDetails } from '../types/IAverageDetails';
import { IDailyEntry } from '../types/IDailyEntry';
import { IEntryFilter } from '../types/IEntryFilter';
import { IEntryListItem } from '../types/IEntryListItem';
import { IJsonList } from '../types/IJsonList';
import { basePath } from './directories';
import { JsonFS } from './JsonFS';

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
        const savedEntries: IJsonList = this.jsonfs.read<IJsonList>(this.listPath);
        savedEntries[entry.dateID] = {
            title: entry.title,
            mood: entry.mood,
            wordCount: entry.wordCount,
            categories: entry.categories
        }
        this.jsonfs.writeSync(this.listPath, savedEntries);
    }

    public remove(dateID: string): void {
        this.verifyFile();
        const entries: IJsonList = this.jsonfs.read(this.listPath);
        entries[dateID] = undefined;
        this.jsonfs.write(this.listPath, entries);
    }

    public list(filter?: IEntryFilter): Array<IEntryListItem> {
        this.verifyFile();
        const entries: IJsonList = this.jsonfs.read<IJsonList>(this.listPath);
        let list: Array<IEntryListItem> = Object.entries(entries).map(([key, details]) => {
            const d = details as unknown as IEntryListItem;
            return {
                dateID: key,
                title: d.title,
                mood: d.mood,
                wordCount: d.wordCount,
                categories: d.categories
            }
        });
        if(filter) {
            list = this.filterList(list, filter);
        }
        return list;
    }

    private filterList(list: Array<IEntryListItem>, filter: IEntryFilter): Array<IEntryListItem> {
        return list.filter(i => {
            if(filter.category && i.categories && i.categories.includes(filter.category))
                return true;
            else
                return false;
        })
    }

    public entriesAverageDetails(): IAverageDetails {
        const entries = this.list();
        let wordCount = 0;
        let moodSum = 0;
        // amount
        let maxCount = 0;
        let maxMoodID = 0;
        const moodCountMap: Record<number, number> = {};

        entries.map(e => {
            wordCount += e.wordCount;
            moodSum += e.mood;
            // count every mood occurrence
            if(moodCountMap[e.mood] == undefined)
                moodCountMap[e.mood] = 0;
            moodCountMap[e.mood]++;
            // set most frequent mood
            if(moodCountMap[e.mood] > maxCount) {
                maxCount = moodCountMap[e.mood];
                maxMoodID = e.mood;
            }
        })
        return {
            mood: {
                average: moodSum / entries.length,
                mostCommon: entries.length && moodCountMap[maxMoodID] > 1 ? maxMoodID : null
            },
            wordCount
        }
    }

    // TODO: create method to read again each JSON entry
    // and recreate json_entry_details.json
}