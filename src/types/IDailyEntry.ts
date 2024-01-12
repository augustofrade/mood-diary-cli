import { MoodEnum } from "./enum";

export interface IDailyEntry {
    creationDate: Date;
    modificationDate: Date;
    mood: MoodEnum;
    wordCount: number;
    title: string;
    description: string;
}