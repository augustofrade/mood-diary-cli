export const configSchema = {
    "id": "/ConfigSchema",
    "type": "object",
    "properties": {
        "creationDate": {
            "type": "string"
        },
        "diaryName": {
            "type": "string"
        },
        "author": {
            "type": "string"
        },
        "lastAccess": {
            "type": "string"
        },
        "storage": {
            "type": "string"
        }
    },
    "required": [
        "creationDate", "diaryName", "author,",
        "lastAccess", "storage"
    ]
}