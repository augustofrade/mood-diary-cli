import inquirer from 'inquirer';

import { IConfirmation } from '../../types/IConfirmation';
import { ConfigManager } from '../../util/ConfigManager';
import { trimInput, validateEmptyInput } from '../../util/inputValidations';
import { settingsMenu } from '../settingsMenu';

export function changeNamePrompt(oldName: string) {
    inquirer.prompt([
        {
            name: "name",
            message: "New name:",
            default: oldName,
            filter: trimInput,
            validate: validateEmptyInput
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
            changeName(name);
        } else {
            return settingsMenu();
        }
    })
}

function changeName(name: string) {
    const cm = ConfigManager.instance();
    cm.configs!.author = name;
    try {
        cm.updateConfigs();
        settingsMenu({ text: "Name changed successfully!", isError: false });
    } catch (e) {
        settingsMenu({ text: "An error occurred while trying to change your name", isError: true });
    }
}