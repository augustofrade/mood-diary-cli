import Database from 'better-sqlite3';
import path from "path";
import { basePath } from './util/directories';

export function getDatabase() {   
    const dbLocation = path.join(basePath, "diary.db");
    return new Database(dbLocation);
}