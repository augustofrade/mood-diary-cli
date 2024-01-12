import chalk from "chalk";

export function filterInput(input: string) {
    return input.trim();
}

export function validateInput(input: string) {
    if(input == "") {
        console.log(chalk.red("\nRequired field!"));
        return false;
    } else {
        return true;
    }
}