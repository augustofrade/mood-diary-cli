import { Validator } from 'jsonschema';

import { configSchema } from '../schema/configSchema';
import { IConfig } from '../types/IConfig';

export function validateConfigFile(content: any): IConfig {
    const v = new Validator();
    const validation = v.validate(content, configSchema);
    return validation.valid ? validation.instance : null;
}