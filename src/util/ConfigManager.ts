import { IConfig } from "../types/IConfig";
import { JsonFS } from "./JsonFS";
import { configPath } from "./directories";

export class ConfigManager {
    private static _instance: ConfigManager;
    private _configs: IConfig;

    private constructor() {
        const jsonfs = new JsonFS();
        this._configs = jsonfs.read<IConfig>(configPath)!;
    }

    public get configs() {
        return this._configs;
    }

    public updateConfigs(configs: IConfig) {
        const jsonfs = new JsonFS();
        this._configs = configs;
        jsonfs.write(configPath, configs);
    }

    public instance() {
        if(!ConfigManager._instance) {
            ConfigManager._instance = new ConfigManager();
        }
        
        return ConfigManager._instance;
    }
}