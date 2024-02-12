import chalk from 'chalk';
import dayjs from 'dayjs';
import inquirer from 'inquirer';
import { homedir } from 'os';
import path from 'path';

import { DailyEntryService } from '../../service/DailyEntryService';
import { IConfirmation } from '../../types/IConfirmation';
import { trimInput, validateEmptyInput } from '../../util/inputValidations';
import { settingsMenu } from '../settingsMenu';

export function exportJsonPrompt() {
    inquirer.prompt([
        {
            name: "exportPath",
            message: "Directory to export:",
            filter: trimInput,
            validate: validateEmptyInput,
            default: path.join(homedir(), "Downloads")
        },
        {
            type: "list",
            name: "confirmation",
            message: chalk.bold("Are you sure? This proccess may take more than a second depending on the number of entries you've written"),
            choices: [
                {
                    name: "Yes, export",
                    value: "yes"
                },
                {
                    name: "No, cancel",
                    value: "no"
                }
            ]
        }
    ])
    .then((answers: { exportPath: string } & IConfirmation) => {
        if(answers.confirmation == "yes") {
            exportJSON(answers.exportPath);
        } else {   
            settingsMenu();
        }
    })
}

function exportJSON(exportPath: string) {
    try {
        const fullpath = path.join(exportPath, "diary_export_" + dayjs().format("YYYYMMDDHHmm") + ".json");
        DailyEntryService.instance().exportEntries(fullpath);
        settingsMenu({ text: "Entries exported and backed up successfully", isError: false });
    } catch (e) {
        settingsMenu({ text: "An error occurred while trying to export your entries", isError: true });
    }

}