import chalk from 'chalk';
import fs from 'fs';
import inquirer from 'inquirer';
import os from 'os';
import path from 'path';

import { DailyEntryService } from '../../service/DailyEntryService';
import { IConfirmation } from '../../types/IConfirmation';
import { filterInput } from '../../util/inputValidations';
import { settingsMenu } from '../settingsMenu';

export function importJsonPrompt() {
    console.log(chalk.gray("This proccess will overwrite any entries found in the diary storage that are on the backup file\n"));

    inquirer.prompt([
        {
            name: "importPath",
            message: "Provide the full JSON file path:",
            filter: filterInput,
            validate: validateInputFile,
            default: path.join(os.homedir(), "Downloads")
        },
        {
            type: "list",
            name: "confirmation",
            message: chalk.bold("Are you sure? This proccess may take a few seconds depending on the number of entries you've written"),
            choices: [
                {
                    name: "Yes, import",
                    value: "yes"
                },
                {
                    name: "No, cancel",
                    value: "no"
                }
            ]
        }
    ])
    .then((answers: { importPath: string } & IConfirmation) => {
        if(answers.confirmation == "yes") {            
            importJSON(answers.importPath);
        } else {
            settingsMenu();
        }
    })
}

function importJSON(importPath: string) {
    try {
        DailyEntryService.instance().importEntries(importPath);
        settingsMenu({ text: "Entries imported from backup successfully", isError: false });
    } catch (e) {
        settingsMenu({ text: "An error occurred while trying to import from the file", isError: true });
    }
}

function validateInputFile(input: string): boolean {
    if(input == "") {
        console.log(chalk.red("\nRequired field!"));
        return false;
    }

    if(!fs.existsSync(input)) {
        console.log(chalk.red("\nInvalid file path!\n"));
        return false;
    }

    const stringParts = input.split(".");
    const fileExtension = stringParts[stringParts.length - 1];
    if(fileExtension != "json") {
        console.log(chalk.red("\nInvalid file type!\n"));
        return false;
    }
    return true;
}