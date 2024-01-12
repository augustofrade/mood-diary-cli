import chalk from 'chalk';
import fs from 'fs';
import inquirer from 'inquirer';
import { configPath } from '../util/directories';
import { IConfig } from '../types/IConfig';
import { JsonFS } from '../util/JsonFS';

export function runDiarySetup() {
    console.log(chalk.yellow("No diary configuration file found, running diary setup..."));
    console.log(chalk.gray("Let's setup your new CLI Mood Diary!"));
    console.log(chalk.gray("I only need optional presentation informations and\nyour preferred text editor for writing your diary entries."));
    console.log(chalk.gray("For the text editor executable, type its command followed by"), chalk.green("%file%\n"));

    inquirer
    .prompt([
        {
            name: "diaryName",
            "message": "Diary Name",
            default: "My Diary"
        },
        {
            name: "author",
            message: "Your name:",
            default: "User"
        },
        {
            name: "textEditor",
            message: "Preferred text editor executable command:",
            default: "nano %file%"
        }
        
    ])
    .then((res: IConfig) => {
        try {
            const jsonfs = new JsonFS();
            res.creationDate = new Date();
            res.lastAccess = new Date();
            jsonfs.write(configPath, res)
            console.log(chalk.green("Diary created and configured successfully!"));
        } catch (e) {
            console.log(chalk.bgRed("Error while trying to create your diary."));
            console.log(e);
        }
    });
}