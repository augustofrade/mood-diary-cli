import inquirer from 'inquirer';

import { DateFormatsEnum } from '../../types/enum';
import { ConfigManager } from '../../util/ConfigManager';
import { settingsMenu } from '../settingsMenu';

export function changeDateFormatPrompt(oldDateFormat: string) {
    const cm = ConfigManager.instance();
    const configs = cm.configs!;

    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "Choose a date format:",
            default: oldDateFormat,
            choices: Object.values(DateFormatsEnum).map(f => ({
                name: f,
                value: f
            }))
        }
    ])
    .then(({ choice }: { choice: DateFormatsEnum }) => {
        try {
            configs["dateFormat"] = choice;
            cm.updateConfigs();
            settingsMenu({ msg: "Date format altered successfully", success: true });
        } catch (e) {
            settingsMenu({ msg: "Date format altered successfully", success: true });
        }
    })
}
