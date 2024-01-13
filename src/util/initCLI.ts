import dayjs from 'dayjs';
import { DailyEntryService } from '../service/DailyEntryService';
import { IRepository } from '../types/IRepository';
import { ConfigManager } from './ConfigManager';

export function initCLI() {
    return new Promise((resolve, reject) => {
        const cm = ConfigManager.instance();
        const repository = cm.readConfigs().getRepository();
        
        if(repository) {
            addRepositories(repository);
            resolve(null);
        } else {
            reject();
        }    
    })
}

function addRepositories(r: IRepository) {
    DailyEntryService.instance().setRepository(r);
}