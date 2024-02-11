export const configSchema = {
    id: "/ConfigSchema",
    type: "object",
    properties: {
        diaryName: {
            type: "string"
        },
        author: {
            type: "string"
        },
        storage: {
            type: "string"
        },
        showQuotes: {
            type: "boolean"
        },
        dateFormat: {
            type: "string"
        },
        creationDate: {
            id: "creationDate",
            type: "string"
        },
        lastAccess: {
            id: "creationDate",
            type: "string"
        },
        categories: {
            type: "array",
            items: {
                type: "string"
            }
        }
    },
    "required": [
        "creationDate", "diaryName", "author",
        "lastAccess", "storage", "categories",
        "dateFormat", "showQuotes"
    ]
}