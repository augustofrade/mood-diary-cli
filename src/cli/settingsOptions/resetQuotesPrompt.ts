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
            try {
                new QuoteManager().generateFile();
                settingsMenu({ msg: "Quote list reset successfully", success: true });
            } catch (e) {
                settingsMenu({ msg: "Could not reset quote list", success: false });
            }
        } else {
            settingsMenu();
        }
    })
}