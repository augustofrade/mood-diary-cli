import chalk from 'chalk';
import inquirer from 'inquirer';

import { IConfirmation } from '../../types/IConfirmation';
import { QuoteManager } from '../../util/QuoteManager';
import { settingsMenu } from '../settingsMenu';

export function resetQuotesPrompt() {
    console.log(chalk.bold(chalk.red("This will delete every quote added by you and replace with the default ones")));

    inquirer.prompt([
        {
            type: "list",
            name: "confirmation",
            message: "Are you sure?",
            choices: [
                {
                    name: "Yes",
                    value: "yes"
                },
                {
                    name: "No, cancel",
                    value: "no"
                }
            ]
        }
    ])
    .then(({ confirmation }: IConfirmation) => {
        if(confirmation == "yes") {
            resetQuotes();
        } else {
            settingsMenu();
        }
    })
}

function resetQuotes() {
    try {
        new QuoteManager().generateFile();
        settingsMenu({ text: "Quote list reset successfully", isError: false });
    } catch (e) {
        settingsMenu({ text: "Could not reset quote list", isError: true });
    }
}