import { MoodEnum } from "./enum";

export interface IDailyEntry {
    creationDate: Date;
    modificationDate: Date;
    mood: MoodEnum;
    totalWords: number;
    title: string;
    description: string;
}