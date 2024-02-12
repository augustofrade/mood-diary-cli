import chalk from 'chalk';
import fs from 'fs';

import { JsonRepository } from '../repository/JsonRepository';
import { DateFormatsEnum } from '../types/enum';
import { IConfig } from '../types/IConfig';
import { IRepository } from '../types/IRepository';
import { SetupConfigs } from '../types/SetupConfigs';
import { validateConfigFile } from '../validations/validateConfigFile';
import { basePath, configPath } from './directories';
import { JsonFS } from './JsonFS';

/**
 * Singleton class
 */
export class ConfigManager {
    private static _instance: ConfigManager;
    private _configs: IConfig | null = null;
    private debug = {
        timesReaden: 0,
        timesAccessed: 0
    };

    private constructor() {}

    public updateAccessDate() {
        this.readConfigs();
        this._configs!.lastAccess = new Date();
        this.updateConfigs();
    }

    public get configs() {
        this.debug.timesAccessed++;
        return this._configs;
    }

    public hasConfigFile(): boolean {
        console.log(fs.existsSync(configPath));
        return fs.existsSync(configPath);
    }

    public readConfigs(): this {
        const jsonfs = new JsonFS();
        this._configs = jsonfs.read<IConfig>(configPath, validateConfigFile);
        this.debug.timesReaden++;
        return this;
    }

    /**
     * Updates the configurations value by **object reference** of private property "_configs".
     */
    public updateConfigs(): void {
        const jsonfs = new JsonFS();
        jsonfs.writeSync(configPath, this._configs!);
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

    /**
     * Creates a new configurations json file with default values
     * @param userConfig object with user-defined values
     */
    public generateFile(userConfig: SetupConfigs): void {
        fs.mkdirSync(basePath, { recursive: true });
        const jsonfs = new JsonFS();
        const configs: IConfig = {
            author: userConfig.author,
            diaryName: userConfig.diaryName,
            storage: userConfig.storage,
            creationDate: new Date(),
            lastAccess: new Date(),
            dateFormat: DateFormatsEnum["YYYY/MM/DD"],
            showQuotes: true,
            categories: [
                "Exercises", "Vacations", "Work", "Day Off",
                "School", "Studying", "Health", "Family", "Friends"
            ]
        };
        jsonfs.writeSync(configPath, configs);
    }

    /**
     * Deletes whole diary directory
     */
    public deleteDiary(): void {
        fs.rmSync(basePath, { recursive: true });
        console.log(chalk.yellow("Diary deleted successfully!"));
        process.exit(0);
    }

    public logDebugValues(): void {
        console.log(this.debug);
    }

    public static instance(): ConfigManager {
        if(!ConfigManager._instance) {
            ConfigManager._instance = new ConfigManager();
        }
        
        return ConfigManager._instance;
    }
}