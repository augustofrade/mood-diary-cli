import Database from 'better-sqlite3';
import path from "path";
import { basePath } from './util/directories';

const dbLocation = path.join(basePath, "diary.db");
export const db = new Database(dbLocation);