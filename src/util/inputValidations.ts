import chalk from "chalk";

export function trimInput(input: string) {
    return input.trim();
}

export function validateEmptyInput(input: string) {
    if(input == "") {
        console.log(chalk.red("\nRequired field!"));
        return false;
    }

    return true;
}