import fs from 'fs';
import path from 'path';

import { IDailyEntry } from '../types/IDailyEntry';
import { IEntryListItem } from '../types/IEntryListItem';
import { IRepository } from '../types/IRepository';
import { jsonPath } from '../util/directories';
import { JsonEntryHandler } from '../util/JsonEntryHandler';
import { JsonFS } from '../util/JsonFS';

export class JsonRepository implements IRepository {
    private static _instance: JsonRepository;
    private jsonfs: JsonFS;
    private constructor() {
        this.jsonfs = new JsonFS();
        fs.mkdirSync(jsonPath, { recursive: true });
    }

    public addEntry (entry: IDailyEntry): boolean {
        try {
            const entryPath = path.join(jsonPath, `${entry.dateID}.json`);
            this.jsonfs.writeSync(entryPath, entry);
            const jsonHandler = new JsonEntryHandler();
            jsonHandler.set(entry);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    };

    public editEntry (entry: IDailyEntry): boolean {
        return this.addEntry(entry);
    };

    public deleteEntry (dateID: string): boolean {
        try {
            const entryPath = path.join(jsonPath, `${dateID}.json`);
            fs.rmSync(entryPath);
            const jsonHandler = new JsonEntryHandler();
            jsonHandler.remove(dateID);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    };

    public readEntry (dateID: string): IDailyEntry | null {
        const filepath = path.join(jsonPath, `${dateID}.json`);
        const entry = this.jsonfs.read<IDailyEntry>(filepath);
        return entry;
    };

    public listEntries (): Array<IEntryListItem> {
        const jsonHandler = new JsonEntryHandler();
        return jsonHandler.list();
    };

    public exportEntries (): boolean {
        return null as any;
    };

    public entryExists (dateID: string): boolean {
        return fs.existsSync(path.join(jsonPath, `${dateID}.json`));
    };

    public static instance() {
        if(!JsonRepository._instance) {
            JsonRepository._instance = new JsonRepository();
        }

        return JsonRepository._instance;
    }
}
