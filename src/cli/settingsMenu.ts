import chalk from 'chalk';
import inquirer from 'inquirer';

import { ConfigManager } from '../util/ConfigManager';
import { categoryMenu } from './categoryMenu';
import { mainMenu } from './mainMenu';
import { changeDateFormatPrompt } from './settingsOptions/changeDateFormatPrompt';
import { changeDiaryNamePrompt } from './settingsOptions/changeDiaryNamePrompt';
import { changeNamePrompt } from './settingsOptions/changeNamePrompt';
import { deleteDiaryPrompt } from './settingsOptions/deleteDiaryPrompt';
import { resetQuotesPrompt } from './settingsOptions/resetQuotesPrompt';
import { runDiarySetupPrompt } from './settingsOptions/runDiarySetupPrompt';
import { exportJsonPrompt } from './settingsOptions/exportJsonPrompt';
import { importJsonPrompt } from './settingsOptions/importJsonPrompt';

export function settingsMenu(headerWarning?: { msg: string, success: boolean }) {
    const configs = ConfigManager.instance().readConfigs().configs!;

    const menuOptions = {
        "change-author": () => changeNamePrompt(configs.author),
        "change-diary": () => changeDiaryNamePrompt(configs.diaryName),
        "set-format": () => changeDateFormatPrompt(configs.dateFormat),
        "toggle-quotes": toggleQuotes,
        "categories-settings": categoryMenu,
        "export-json": exportJsonPrompt,
        "import-json": importJsonPrompt,
        "reset-quotes": resetQuotesPrompt,
        "run-setup": runDiarySetupPrompt,
        "delete-diary": deleteDiaryPrompt,
        "back": mainMenu
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
            pageSize: 20,
            name: "choice",
            message: "Choose:",
            choices: [
                {
                    name: "Change my name",
                    value: "change-author"
                },
                {
                    name: "Change diary's name",
                    value: "change-diary"
                },
                {
                    name: "Change date formatting",
                    value: "set-format"
                },
                {
                    name: `${configs.showQuotes ? "Hide" : "Show"} quotes on main menu`,
                    value: "toggle-quotes"
                },
                {
                    name: "Categories settings",
                    value: "categories-settings"
                },
                {
                    name: "Import from backup",
                    value: "import-json"
                },
                
                new inquirer.Separator(" "),
                {
                    name: "Export and backup entries to JSON file",
                    value: "export-json"
                },
                new inquirer.Separator(" "),
                {
                    name: chalk.red("Reset quote list"),
                    value: "reset-quotes"
                },
                {
                    name: chalk.red("Reset diary's settings"),
                    value: "run-setup"
                },
                {
                    name: chalk.red("Delete diary and everything written"),
                    value: "delete-diary"
                },
                new inquirer.Separator(" "),
                {
                    name: "Back to main menu",
                    value: "back"
                }
            ]
        }
    ])
    .then(({ choice }: { choice: keyof typeof menuOptions }) => {
        menuOptions[choice]();
    })

}

function toggleQuotes() {
    try {
        const cm = ConfigManager.instance();
        const configs = cm.configs!;
        if(typeof configs.showQuotes != "boolean") {
            configs.showQuotes = true;
        } else {
            configs.showQuotes = !configs.showQuotes;
        }
        cm.updateConfigs();
        settingsMenu({
            msg: `Quotes ${configs.showQuotes ? "now will be shown in the main menu" : "are now hidden"}`,
            success: true
        });
    } catch (e) {
        settingsMenu({ msg: "Could not toggle main menu quotes visibility", success: false });
    }
}