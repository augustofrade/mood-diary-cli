import chalk from 'chalk';
import fs from 'fs';
import inquirer from 'inquirer';

import { IConfig } from '../types/IConfig';
import { ConfigManager } from '../util/ConfigManager';
import { basePath, configPath } from '../util/directories';
import { initCLI } from '../util/initCLI';
import { filterInput, validateInput } from '../util/inputValidations';
import { JsonFS } from '../util/JsonFS';
import { mainMenu } from './mainMenu';

export function diarySetup() {
    console.log(chalk.yellow("No diary configuration file found, running diary setup..."));
    console.log(chalk.gray("Let's setup your new CLI Mood Diary!"));
    console.log(chalk.gray("I only need optional presentation informations and\nyour preferred text editor for writing your diary entries."));
    console.log(chalk.gray("For the text editor executable, type its command followed by"), chalk.green("%file%\n"));

    inquirer
    .prompt([
        {
            name: "diaryName",
            message: "Diary Name",
            default: "My Diary",
            filter: filterInput,
            validate: validateInput
        },
        {
            name: "author",
            message: "Your name:",
            default: "User",
            filter: filterInput,
            validate: validateInput
        },
        {
            // TODO: remove
            name: "textEditor",
            message: "Preferred text editor executable command:",
            default: "nano %file%",
            filter: filterInput,
            validate: validateInput
        },
        {
            type: "list",
            name: "storage",
            message: "Preferred",
            choices: ["JSON", "SQL"]
        }
    ])
    .then((answers: IConfig) => {
        try {
            fs.mkdirSync(basePath, { recursive: true });
            const jsonfs = new JsonFS();
            answers.creationDate = new Date();
            answers.lastAccess = new Date();
            jsonfs.writeSync(configPath, answers)
            console.log(chalk.green("\nDiary created and configured successfully!"));
            initialize();
        } catch (e) {
            console.log(chalk.bgRed("\nError while trying to create your diary.\n"));
            console.log(e);
        }
    });
}

/**
 * Loads configurations directly from the file after creating it
 */
function initialize() {
    setTimeout(() => {
        if(!ConfigManager.instance().hasConfigFile()) {
            initialize();
            console.log(chalk.gray("File not created yet, trying to load settings again..."));
        } else {
            initCLI()
            .then(() => {
                mainMenu()
            })
            .catch(() => {
                console.log(chalk.red("Failed to fetch configuration data and set storage method"))
            });
        }
    }, 1000);
}