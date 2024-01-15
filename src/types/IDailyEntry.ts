import { MoodEnum } from "./enum";

export interface IDailyEntry {
    creationDate: Date;
    modificationDate: Date;
    dateID: string;
    mood: MoodEnum;
    wordCount: number;
    title: string;
    description: string;
    categories: string[];
}