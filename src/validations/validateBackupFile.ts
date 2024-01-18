import { Schema, Validator } from "jsonschema";
import { dailyEntrySchema, diaryBackupSchema } from "../schema/entrySchema";
import { IDailyEntry } from "../types/IDailyEntry";

export function validateBackupFile(content: any): IDailyEntry[] | null {
    
    const v = new Validator();
    v.addSchema(dailyEntrySchema, "/DailyEntry");
    const validation = v.validate(content, diaryBackupSchema, { rewrite: unmarshallDate });
    if(validation.valid)
        return validation.instance;
    else
        return null;
}

function unmarshallDate (instance: any, schema: Schema) {
    if(schema.id == "modificationDate" || schema.id == "creationDate")
        return new Date(instance);
    else
        return instance;
}