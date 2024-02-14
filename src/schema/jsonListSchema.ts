export const jsonListSchema = {
    id: "/",
    type: "object",
    patternProperties: {
      "^((?!\\d{4}-\\d{2}-\\d{2}).)*$": {
        type: "object",
        properties: {
            title: {
                type: "string",
            },
            mood: {
                type: "number"
            },
            wordCount: {
                type: "number"
            },
            categories: {
                type: "array",
                items: {
                    type: "string"
                }
            }
        }
      },
    }
}