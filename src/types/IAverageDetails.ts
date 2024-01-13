export interface IAverageDetails {
    mood: {
        average: number;
        mostCommon: number | null;
    },
    wordCount: number;
}