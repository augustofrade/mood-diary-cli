import chalk from 'chalk';
import fs from 'fs';
import inquirer from 'inquirer';
import { basePath, configPath } from '../util/directories';
import { IConfig } from '../types/IConfig';
import { JsonFS } from '../util/JsonFS';
import { filterInput, validateInput } from '../util/inputValidations';

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
            jsonfs.write(configPath, answers)
            console.log(chalk.green("\nDiary created and configured successfully!"));        
        } catch (e) {
            console.log(chalk.bgRed("\nError while trying to create your diary.\n"));
            console.log(e);
        }
    });
}