import chalk from 'chalk';
import inquirer from 'inquirer';

import { SetupConfigs } from '../types/SetupConfigs';
import { ConfigManager } from '../util/ConfigManager';
import { initCLI } from '../util/initCLI';
import { filterInput, validateInput } from '../util/inputValidations';
import { QuoteManager } from '../util/QuoteManager';
import { mainMenu } from './mainMenu';

export function diarySetup() {
    console.log(chalk.yellow("No diary configuration file found, running diary setup..."));
    console.log(chalk.gray("Let's setup your new CLI Mood Diary!"));
    console.log(chalk.gray("I only need a few optional presentation informations."));

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
            type: "list",
            name: "storage",
            message: "Preferred data storage",
            choices: ["JSON", "SQL"]
        }
    ])
    .then((answers: SetupConfigs) => {
        try {
            ConfigManager.instance().generateFile(answers);
            new QuoteManager().generateFile();

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