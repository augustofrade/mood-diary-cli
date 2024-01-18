export const dailyEntrySchema = {
    id: "/DailyEntry",
    type: "object",
    properties: {
        categories: {
            type: "array",
            items: { type: "string" }
        },
        title: { type: "string" },
        mood: { type: "string" },
        description: { type: "string" },
        dateID: { type: "string" },
        wordCount: { type: "number" },
        creationDate: {
            id: "creationDate",
            type: "string"
        },
        modificationDate: {
            id: "modificationDate",
            type: "string"
        }
    },
    required: [
        "categories", "title", "mood", "description",
        "dateID", "wordCount", "creationDate", "modificationDate"
    ]
}

export const diaryBackupSchema = {
    id: "/JsonBackUpSchema",
    type: "array",
    items: {
        "$ref": "/DailyEntry"
    }
}