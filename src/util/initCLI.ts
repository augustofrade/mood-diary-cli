import { DailyEntryService } from '../service/DailyEntryService';
import { IRepository } from '../types/IRepository';
import { ConfigManager } from './ConfigManager';
import { createDatabaseTables } from './createDatabaseTables';

/**
 * Inits the CLI loading the diary configurations and the correct storage repository
 * 
 */
export function initCLI() {
    return new Promise((resolve, reject) => {
        const cm = ConfigManager.instance();
        const repository = cm.readConfigs().getRepository();
        
        if(!repository) {
            return reject();
        }

        if(cm.configs!.storage == "SQL") {
            createDatabaseTables();
        }
        
        addRepositories(repository);
        cm.updateAccessDate();
        resolve(null);
    })
}

function addRepositories(r: IRepository) {
    DailyEntryService.instance().setRepository(r);
}