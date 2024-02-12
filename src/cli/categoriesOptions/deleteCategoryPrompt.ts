import chalk from 'chalk';
import inquirer from 'inquirer';

import { IConfirmation } from '../../types/IConfirmation';
import { CategoryHandler } from '../../util/CategoryHandler';
import { categoryMenu } from '../categoryMenu';

export function deleteCategoryPrompt() {
    const categoryHandler = new CategoryHandler();
    if(categoryHandler.categories.length == 0)
        return categoryMenu({ text: "No categories found to be deleted!", isError: true });

    console.clear();
    console.log(chalk.gray("List of categories that can be deleted"));
    console.log("-".repeat(process.stdout.columns));
    console.log("\n");

    inquirer.prompt([
        {
            type: "list",
            pageSize: 20,
            name: "categoryName",
            message: "Choose:",
            choices: categoryHandler.categories.map(c => ({ name: c, value: c }))
        },
        {
            type: "list",
            name: "confirmation",
            message: "Delete?",
            choices: [
                {
                    name: "Yes, delete",
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
        if(confirmation != "yes") {
            return categoryMenu();
        }
        try {
            categoryHandler.deleteCategory(categoryName);
            categoryMenu({ text: `Category "${categoryName}" deleted successfully!`, isError: false });
        } catch (e) {
            categoryMenu({ text: "Could not delete the category", isError: true });
        }
    })
}