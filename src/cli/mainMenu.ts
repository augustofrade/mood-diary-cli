import chalk from 'chalk';
import inquirer from 'inquirer';

import { ConfigManager } from '../util/ConfigManager';
import { QuoteManager } from '../util/QuoteManager';
import { diaryDetails } from './diaryInfo';
import { entrySetup } from './entrySetup';
import { listEntries } from './listEntries';

const choices = {
    "new": entrySetup,
    "list": listEntries,
    "details": diaryDetails,
    "settings": () => { throw new Error },
    "exit": process.exit
}
    

export function mainMenu() {
    const { author, diaryName, showQuotes } = ConfigManager.instance().configs!;
    
    console.clear();
    console.log(chalk.green(`\nHello, ${author}! Welcome to "${diaryName}"!`));
    console.log(chalk.green("What would you like to do today?"));
    if(showQuotes) {
        const randomQuote = new QuoteManager().getQuotes().random();
        const label = randomQuote != undefined ? randomQuote : "Nothing here! Add quotes in the settings";
            console.log(chalk.gray("\n" + label));
    }
    console.log(chalk.gray("-".repeat(process.stdout.columns)));
    

    inquirer
    .prompt([
        {
            type: "list",
            name: "choice",
            message: "Choose one:",
            pageSize: 20,
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
                },
                new inquirer.Separator(),
                {
                    name: "Exit",
                    value: "exit"
                }
            ]
        }
    ])
    .then((answer: { choice: keyof typeof choices }) => {
        choices[answer.choice]();
    })
}