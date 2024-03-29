import chalk from 'chalk';
import inquirer from 'inquirer';

import { IConfirmation } from '../../types/IConfirmation';
import { CategoryHandler } from '../../util/CategoryHandler';
import { trimInput } from '../../util/inputValidations';
import { categoryMenu } from '../categoryMenu';

export function newCategoryPrompt() {
    const categoryHandler = new CategoryHandler();

    inquirer.prompt([
        {
            name: "categoryName",
            message: "New Category name:",
            filter: trimInput,
            validate: validateCategoryName
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
    .then(({ categoryName, confirmation }: { categoryName: string } & IConfirmation) => {
        if(confirmation == "yes") {
            try {
                categoryHandler.addCategory(categoryName);
                categoryMenu({ text: `Category "${categoryName}" created successfully!`, isError: false });
            } catch (e) {
                categoryMenu({ text: "Could not create the category", isError: true });
            }
        } else {
            categoryMenu();
        }
    })
}

function validateCategoryName(name: string): boolean {
    const categoryHandler = new CategoryHandler();

    if(name == "") {
        console.log(chalk.red("\nRequired field!"));
        return false;
    }
    if(categoryHandler.categoryExists(name)) {
        console.log(chalk.red("\nThis category already exists!"));
        return false;
    }
    return true;
}