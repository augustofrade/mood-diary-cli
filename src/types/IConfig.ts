export interface IConfig {
    creationDate: Date;
    lastAccess: Date;
    diaryName: string;
    author: string;
    storage: "JSON" | "SQL";
    dateFormat: string;
    showQuotes: boolean;
    categories: string[];
}