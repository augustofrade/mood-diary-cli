import { getDatabase } from "../db";

export function insertCategories(dateID: string, categories: string[]) {
    const db = getDatabase();
    
    const insertCategory = db.prepare(`INSERT INTO entriesCategories 
            (dateID, categoryName) VALUES (@dateID, @categoryName)`);
                
    const insertMany = db.transaction((categories: string[]) => {
        for (const category of categories) {
            insertCategory.run({ dateID, categoryName: category });
        }
    })

    insertMany(categories);
}