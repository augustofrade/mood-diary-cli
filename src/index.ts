#! /usr/bin/env node
import chalk from 'chalk';

import { diarySetup } from './cli/diarySetup';
import { mainMenu } from './cli/mainMenu';
import { ConfigManager } from './util/ConfigManager';
import { initCLI } from './util/initCLI';

const cm = ConfigManager.instance();

if(!cm.hasConfigFile()) {
    diarySetup();
} else {
    initCLI()
    .then(() => {
        mainMenu()
    })
    .catch(() => {
        console.log(chalk.red("Failed to fetch configuration data and set storage method"))
    });
}