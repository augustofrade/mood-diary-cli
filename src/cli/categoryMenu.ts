import chalk from 'chalk';
import inquirer from 'inquirer';

import { IHeaderMessage } from '../types/IHeaderMessage';
import { handleHeaderMessage } from '../util/handleHeaderMessage';
import { deleteCategoryPrompt } from './categoriesOptions/deleteCategoryPrompt';
import { listCategoriesPrompt } from './categoriesOptions/listCategoriesPrompt';
import { newCategoryPrompt } from './categoriesOptions/newCategoryPrompt';
import { settingsMenu } from './settingsMenu';

export function categoryMenu(headerMessage?: IHeaderMessage) {
    console.clear();
    console.log(chalk.gray("Categories menu"));
    handleHeaderMessage(headerMessage);
    console.log("-".repeat(process.stdout.columns));
    console.log("\n");

    const choicesList = {
        "list": listCategoriesPrompt,
        "new":  newCategoryPrompt,
        "delete": deleteCategoryPrompt,
        "back": settingsMenu
    }

    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "Choose an action:",
            choices: [
                {
                    name: "List Categories",
                    value: "list"
                },
                {
                    name: "New category",
                    value: "new"
                },
                {
                    name: "Delete category",
                    value: "delete"
                },
                new inquirer.Separator(" "),
                {
                    name: "Go back",
                    value: "back"
                }
            ]
        }
    ])
    .then(({ choice }: { choice: keyof typeof choicesList }) => {
        choicesList[choice]();
    });
}