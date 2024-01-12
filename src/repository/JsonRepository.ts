import { IDailyEntry } from "../types/IDailyEntry";
import { IRepository } from "../types/IRepository";
import { JsonFS } from "../util/JsonFS";
import fs from "fs";
import { jsonPath } from "../util/directories";
import path from "path";

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
            this.jsonfs.write(entryPath, entry);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    };

    public editEntry (entry: IDailyEntry): boolean {
        return null as any;
    };

    public deleteEntry (dateID: string): boolean {
        return null as any;
    };

    public readEntry (dateID: string): IDailyEntry {
        return null as any;
    };

    public listEntries (): IDailyEntry[] {
        return null as any;
    };

    public exportEntires (): boolean {
        return null as any;
    };

    public static instance() {
        if(!JsonRepository._instance) {
            JsonRepository._instance = new JsonRepository();
        }

        return JsonRepository._instance;
    }
}