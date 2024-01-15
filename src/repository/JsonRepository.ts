import fs from 'fs';
import path from 'path';

import { IAverageDetails } from '../types/IAverageDetails';
import { IDailyEntry } from '../types/IDailyEntry';
import { IEntryFilter } from '../types/IEntryFilter';
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

    public listEntries (filter?: IEntryFilter): Array<IEntryListItem> {
        const jsonHandler = new JsonEntryHandler();
        return jsonHandler.list(filter);
    };

    public exportEntries (exportPath: string): void {
        const dirname = path.dirname(exportPath);
        if(!fs.existsSync(dirname))
            fs.mkdirSync(dirname);
        
        const exported: IDailyEntry[] = [];
        this.listEntries().forEach(({ dateID }) => {
            if(fs.existsSync(`${jsonPath}/${dateID}.json`)) {
                const entry = this.readEntry(dateID);
                if(entry) {
                    exported.push(entry);
                }
            }
        });
        this.jsonfs.writeSync(exportPath, exported);
    };

    public entryExists (dateID: string): boolean {
        return fs.existsSync(path.join(jsonPath, `${dateID}.json`));
    };
    
    public entriesAverageDetails (): IAverageDetails {
        const jsonHandler = new JsonEntryHandler();
        return jsonHandler.entriesAverageDetails();
    };

    public static instance() {
        if(!JsonRepository._instance) {
            JsonRepository._instance = new JsonRepository();
        }

        return JsonRepository._instance;
    }
}
