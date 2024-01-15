import chalk from 'chalk';
import inquirer from 'inquirer';

import { CategoryHandler } from '../../util/CategoryHandler';
import { categoryMenu } from '../categoryMenu';

export function listCategoriesPrompt() {
    const categoryHandler = new CategoryHandler();

    if(categoryHandler.categories.length == 0) {
        console.log("No categories found! Create one by choosing the \"New category\" option.");
        return;
    } else {

        console.clear();
        console.log(chalk.gray("Categories list"));
        console.log("-".repeat(process.stdout.columns));
        console.log(chalk.bold("\nAvailable categories:"));

        categoryHandler.categories.forEach(c => console.log(chalk.gray(c)));
    }

    console.log("\n");

    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "Action:", 
            choices: [ { name: "Go back", value: "back" } ]
        }
    ])
    .then(answer => {
        categoryMenu();
    })
}