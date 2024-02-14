import { Validator } from 'jsonschema';

import { jsonListSchema } from '../schema/jsonListSchema';
import { IJsonList } from '../types/IJsonList';

export function validateJsonListFile(content: any): IJsonList {
    const v = new Validator();
    const validation = v.validate(content, jsonListSchema);
    return validation.valid ? validation.instance : null;
}