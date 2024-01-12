import chalk from 'chalk';
import inquirer from 'inquirer';

import { ConfigManager } from '../util/ConfigManager';
import { newEntry } from './newEntry';

const choices = {
    "new": newEntry,
    "list": () => { throw new Error },
    "details": () => { throw new Error },
    "settings": () => { throw new Error }
}
    

export function mainMenu() {
    const { author, diaryName } = ConfigManager.instance().configs!;
    console.clear();
    console.log(chalk.green(`\nHello, ${author}! Welcome to "${diaryName}"!`));
    console.log(chalk.green("What would you like to do today?"));
    console.log(chalk.gray("-".repeat(process.stdout.columns)));
    

    inquirer
    .prompt([
        {
            type: "list",
            name: "choice",
            message: "Choose one:",
            choices: [
                new inquirer.Separator("Entries:"),
                {
                    name: "New Entry",
                    value: "new",
                },
                {
                    name: "List Entries",
                    value: "list",
                },
                new inquirer.Separator(),
                new inquirer.Separator("Misc:"),
                {
                    name: "View Diary details",
                    value: "details",
                },
                {
                    name: "Settings",
                    value: "settings",
                }
            ]
        }
    ])
    .then((answer: { choice: keyof typeof choices }) => {
        choices[answer.choice]();
    })
}