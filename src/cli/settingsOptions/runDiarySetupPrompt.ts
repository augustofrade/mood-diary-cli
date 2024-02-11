import chalk from 'chalk';
import inquirer from 'inquirer';

import { IConfirmation } from '../../types/IConfirmation';
import { diarySetup } from '../diarySetup';
import { settingsMenu } from '../settingsMenu';

export function runDiarySetupPrompt() {
    console.log(chalk.red("\nThis will run the diary setup dialog and overwrite every settings in your configuration file upon completion, including:"));
    console.log(chalk.bold(chalk.red("- Name\n- Creation date\n- Categories\n- Preferred storage method.\n")));

    inquirer.prompt([
        {
            type: "list",
            name: "confirmation",
            message: "Are you sure?",
            choices: [
                {
                    name: "Yes, run setup",
                    value: "yes"
                },
                {
                    name: "No, I've changed my mind",
                    value: "no"
                }
            ]
        }
    ])
    .then(({ confirmation }: IConfirmation) => {
        if(confirmation == "yes") {
            diarySetup(false);
        } else {
            settingsMenu();
        }
    })
}