import inquirer from 'inquirer';

import { IConfirmation } from '../../types/IConfirmation';
import { ConfigManager } from '../../util/ConfigManager';
import { trimInput, validateEmptyInput } from '../../util/inputValidations';
import { settingsMenu } from '../settingsMenu';

export function changeDiaryNamePrompt(oldDiaryName: string) {
    inquirer.prompt([
        {
            name: "name",
            message: "New diary name:",
            default: oldDiaryName,
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
            changeDiaryName(name);
        } else {
            settingsMenu();
        }
    })
}

function changeDiaryName(name: string) {
    const cm = ConfigManager.instance();
    cm.configs!.diaryName = name;
    try {
        cm.updateConfigs();
        settingsMenu({ text: "Diary name changed successfully!", isError: false });
    } catch (e) {
        settingsMenu({ text: "An error occurred while trying to change the diary's name", isError: true });
    }
}