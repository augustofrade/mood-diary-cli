import chalk from "chalk";

/**
 * Object with keys being the mood and its values its the corresponding color
 */
export const moodColors: Record<number, Function> = Object.freeze({
    0: chalk.red,
    1: chalk.yellow,
    2: chalk.gray,
    3: chalk.blue,
    4: chalk.green
});