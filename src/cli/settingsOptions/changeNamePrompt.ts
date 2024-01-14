import inquirer from 'inquirer';

import { IConfirmation } from '../../types/IConfirmation';
import { ConfigManager } from '../../util/ConfigManager';
import { filterInput, validateInput } from '../../util/inputValidations';
import { settingsMenu } from '../settingsMenu';

export function changeNamePrompt(oldName: string) {
    inquirer.prompt([
        {
            name: "name",
            message: "New name:",
            default: oldName,
            filter: filterInput,
            validate: validateInput
        },
        {
            type: "list",
            name: "confirmation",
            message: "Save?",
            choices: [
                {
                    name: "Yes, save",
                    value: "yes"
                },
                {
                    name: "No, cancel",
                    value: "no"
                }
            ]
        }
    ])
    .then((answers: { name: string } & IConfirmation) => {
        const { name, confirmation } = answers;
        if(confirmation == "yes") {
            const cm = ConfigManager.instance();
            cm.configs!.author = name;
            try {
                cm.updateConfigs();
                settingsMenu({ msg: "Name changed successfully!", success: true });
            } catch (e) {
                settingsMenu({ msg: "An error occurred while trying to change your name", success: false });
            }
        } else {
            settingsMenu();
        }
    })
}