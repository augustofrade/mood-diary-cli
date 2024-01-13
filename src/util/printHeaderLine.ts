import chalk from "chalk";

export function printHeaderLine(name: string, value: any) {
    console.log(chalk.bold(`${name}:`), value);
}