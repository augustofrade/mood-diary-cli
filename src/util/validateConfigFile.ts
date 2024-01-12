import { Validator } from "jsonschema";
import { configSchema } from "../schema/configSchema";

export function validateConfigFile(p: object) {
    const v = new Validator();
    v.validate(p, configSchema);
}