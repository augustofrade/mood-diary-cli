import fs from 'fs';

import { IConfig } from '../types/IConfig';
import { configPath } from './directories';
import { JsonFS } from './JsonFS';
import { IRepository } from '../types/IRepository';
import { JsonRepository } from '../repository/JsonRepository';

export class ConfigManager {
    private static _instance: ConfigManager;
    private _configs: IConfig | null = null;

    private constructor() {}

    public get configs() {
        return this._configs;
    }

    public hasConfigFile(): boolean {
        return fs.existsSync(configPath);
    }

    public readConfigs(): this {
        const jsonfs = new JsonFS();
        this._configs = jsonfs.read<IConfig>(configPath)!;
        return this;
    }

    public updateConfigs(configs: IConfig): void {
        const jsonfs = new JsonFS();
        this._configs = configs;
        jsonfs.writeSync(configPath, configs);
    }

    public getRepository(): IRepository | null {
        const repName = this._configs?.storage;
        if(repName == "JSON")
            return JsonRepository.instance();
        else if(repName == "SQL")
            throw { error: "Not implemented" }
        else
            return null
    }

    public static instance(): ConfigManager {
        if(!ConfigManager._instance) {
            ConfigManager._instance = new ConfigManager();
        }
        
        return ConfigManager._instance;
    }
}