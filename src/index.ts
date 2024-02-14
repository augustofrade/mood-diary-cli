#! /usr/bin/env node
import chalk from 'chalk';

import { diarySetup } from './cli/diarySetup';
import { mainMenu } from './cli/mainMenu';
import { ConfigManager } from './util/ConfigManager';
import { initCLI } from './util/initCLI';
import { DailyEntryService } from './service/DailyEntryService';
import { IDailyEntry } from './types/IDailyEntry';

const cm = ConfigManager.instance();

if(!cm.hasConfigFile()) {
    diarySetup();
} else {
    initCLI()
    .then(() => {
        // mainMenu();
        const e: IDailyEntry = {
            dateID: "2024-02-14",
            title: "teste sql",
            description: "descricao",
            mood: 2,
            wordCount: 1,
            creationDate: new Date(),
            modificationDate: new Date(),
            categories: []
        }
        const res = DailyEntryService.instance().addEntry(e);
        console.log(res);
    })
    .catch((e) => {
        console.log(e)
        console.log(chalk.red("Failed to fetch configuration data and set storage method"))
    });
}