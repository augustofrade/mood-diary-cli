import inquirer from 'inquirer';

import { IConfirmation } from '../../types/IConfirmation';
import { ConfigManager } from '../../util/ConfigManager';
import { filterInput, validateInput } from '../../util/inputValidations';
import { settingsMenu } from '../settingsMenu';

export function changeDiaryNamePrompt(oldDiaryName: string) {
    inquirer.prompt([
        {
            name: "name",
            message: "New diary name:",
            default: oldDiaryName,
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
        settingsMenu({ msg: "Diary name changed successfully!", success: true });
    } catch (e) {
        settingsMenu({ msg: "An error occurred while trying to change the diary's name", success: false });
    }
}