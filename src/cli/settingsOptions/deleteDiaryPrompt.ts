import chalk from "chalk";
import inquirer from "inquirer";
import { IConfirmation } from "../../types/IConfirmation";
import { settingsMenu } from "../settingsMenu";
import { ConfigManager } from "../../util/ConfigManager";

export function deleteDiaryPrompt() {
    console.log(chalk.red("\nAre you sure you want to delete your diary?"));
    console.log(chalk.bold(chalk.red("This action will wipe out EVERYTHING in its folder, such as:")));
    console.log(chalk.yellow("- Entries\n- Categories\n- Quotes\n- Settings\n"));

    inquirer.prompt([
        {
            type: "list",
            name: "confirmation",
            message: "Are you really sure?",
            choices: [
                {
                    name: "Yes, delete the diary",
                    value: "yes"
                },
                {
                    name: "Cancel and exit",
                    value: "cancel"
                },
                
            ]
        }
    ])
    .then(({ confirmation }: IConfirmation) => {
        if(confirmation == "yes") {
            try {
                ConfigManager.instance().deleteDiary();
                console.clear();
                console.log(chalk.green("Diary deleted successfully!"));
                process.exit();
            } catch (e) {
                settingsMenu({ msg: "There was an error while trying to delete your diary", success: false });
            }
        } else {
            settingsMenu();
        }
    })
}