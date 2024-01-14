import chalk from 'chalk';
import inquirer from 'inquirer';

import { DateFormatsEnum } from '../types/enum';
import { IConfig } from '../types/IConfig';
import { IConfirmation } from '../types/IConfirmation';
import { ConfigManager } from '../util/ConfigManager';
import { filterInput, validateInput } from '../util/inputValidations';
import { mainMenu } from './mainMenu';
import { QuoteManager } from '../util/QuoteManager';

interface IConfirmationHandlerOptions {
    confirmation: "yes" | "no" | "exit",
    onAccept: (configs: IConfig) => void,
    onReject: () => void,
    msgSucess: string,
    msgError: string,
}

export function settingsMenu(headerWarning?: { msg: string, success: boolean }) {
    const configs = ConfigManager.instance().readConfigs().configs!;

    const menuOptions = {
        "change-author": {
            label: "Change my name",
            callback: () => changeNamePrompt(configs.author)
        },
        "change-diary": {
            label: "Change diary's name",
            callback: () => changeDiaryNamePrompt(configs.diaryName)
        },
        "set-format": {
            label: "Change date formatting",
            callback: () => changeDateFormatPrompt(configs.dateFormat)
        },
        "toggle-quotes": {
            label: `${configs.showQuotes ? "Hide" : "Show"} quotes on main menu`,
            callback: toggleQuotes
        },
        "reset-quotes": {
            label: "Reset quote list",
            callback: resetQuotesPrompt
        },
        "back": {
            label: "Back to main menu",
            callback: mainMenu
        }
    }

    console.clear();
    console.log(chalk.green(`${configs.diaryName}'s settings`));
    if(headerWarning) {
        const color = headerWarning.success ? chalk.green : chalk.red;
        console.log(chalk.bold(color("\n" + headerWarning.msg)));
    }
    console.log("-".repeat(process.stdout.columns));
    console.log(chalk.gray(`Hello, ${configs.author}! What would you like to do?\n`));

    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "Choose:",
            choices: [
                ...Object.entries(menuOptions).map(([key, value]) => ({
                    name: value.label,
                    value: key
                }))
            ]
        }
    ])
    .then(({ choice }: { choice: keyof typeof menuOptions }) => {
        menuOptions[choice].callback();
    })

}

function toggleQuotes() {
    try {
        const cm = ConfigManager.instance();
        const configs = cm.configs!;
        if(typeof configs["showQuotes"] != "boolean") {
            configs["showQuotes"] = true;
        } else {
            configs["showQuotes"] = !configs["showQuotes"];
        }
        cm.updateConfigs(configs);
        settingsMenu({
            msg: `Quotes ${configs["showQuotes"] ? "now will be shown in the main menu" : "are now hidden"}`,
            success: true
        });
    } catch (e) {
        settingsMenu({ msg: "Could not toggle main menu quotes visibility", success: false });
    }
}

function resetQuotesPrompt() {
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

function changeDateFormatPrompt(oldDateFormat: string) {
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
            cm.updateConfigs(configs);
            settingsMenu({ msg: "Date format altered successfully", success: true });
        } catch (e) {
            settingsMenu({ msg: "Date format altered successfully", success: true });
        }
    })
}

function changeNamePrompt(oldName: string) {
    const { confirmationHandler, confirmationSelection } = confirmationPrompt("Save?");

    inquirer.prompt([
        {
            name: "name",
            message: "New name:",
            default: oldName,
            filter: filterInput,
            validate: validateInput
        },
        confirmationSelection
    ])
    .then((answers: { name: string } & IConfirmation) => {
        const { name, confirmation } = answers;
        confirmationHandler({
            confirmation,
            onAccept: (configs: IConfig) => configs.author = name,
            onReject: () => changeNamePrompt(name),
            msgSucess: "Name changed successfully!",
            msgError: "An error occurred while trying to change your name"
        })
    })
}


function changeDiaryNamePrompt(oldDiaryName: string) {
    const { confirmationHandler, confirmationSelection } = confirmationPrompt("Save?");

    inquirer.prompt([
        {
            name: "diaryName",
            message: "New diary name:",
            default: oldDiaryName,
            filter: filterInput,
            validate: validateInput
        },
        confirmationSelection
    ])
    .then((answers: { diaryName: string } & IConfirmation) => {
        const { diaryName, confirmation } = answers;
        confirmationHandler({
            confirmation,
            onAccept: (configs: IConfig) => configs.diaryName = diaryName,
            onReject: () => changeDiaryNamePrompt(diaryName),
            msgSucess: "Diary name changed successfully!",
            msgError: "An error occurred while trying to change the diary name"
        })
    })
}

/**
 * Helper class to padronize and reduce repetitive code 
 * when asking for user confirmation and saving the configs
 */
function confirmationPrompt(confrimationMessage: string) {
    const confirmationHandler = (options: IConfirmationHandlerOptions) => {
        if(options.confirmation == "yes") {
            const cm = ConfigManager.instance();
            options.onAccept(cm.configs!);
            try {
                cm.updateConfigs(cm.configs!);
                settingsMenu({ msg: options.msgSucess, success: true });
            } catch (e) {
                settingsMenu({ msg: options.msgError, success: false });
            }
        } else if(options.confirmation == "no") {
            options.onReject();
        } else {
            settingsMenu();
        }
    }

    const confirmationSelection = {
        type: "list",
        name: "confirmation",
        message: confrimationMessage,
        choices: [
            {
                name: "Yes, save",
                value: "yes"
            },
            {
                name: "No, review",
                value: "no"
            },
            {
                name: "Cancel and exit",
                value: "cancel"
            }
        ]
    }

    return { confirmationHandler, confirmationSelection };
}