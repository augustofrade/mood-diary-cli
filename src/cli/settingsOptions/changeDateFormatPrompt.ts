import inquirer from 'inquirer';

import { DateFormatsEnum } from '../../types/enum';
import { ConfigManager } from '../../util/ConfigManager';
import { settingsMenu } from '../settingsMenu';

export function changeDateFormatPrompt(oldDateFormat: string) {
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "Choose a date format:",
            default: oldDateFormat,
            choices: Object.values(DateFormatsEnum).map(format => ({
                name: format,
                value: format
            }))
        }
    ])
    .then(({ choice }: { choice: DateFormatsEnum }) => {
        changeDateFormat(choice);
    })
}

function changeDateFormat(format: DateFormatsEnum) {
    const cm = ConfigManager.instance();
    const configs = cm.configs!;
    try {
        configs["dateFormat"] = format;
        cm.updateConfigs();
        settingsMenu({ msg: "Date format altered successfully", success: true });
    } catch (e) {
        settingsMenu({ msg: "There was an error while trying to change the date's format", success: false });
    }
}
