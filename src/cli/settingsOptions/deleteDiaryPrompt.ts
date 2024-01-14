import chalk from "chalk";

export function deleteDiaryPrompt() {
    console.log(chalk.red("\nAre you sure you want to delete your diary?"));
    console.log(chalk.bold(chalk.red("This action will wipe out EVERYTHING in its folder, such as:")));
    console.log(chalk.yellow("- Entries\n- Categories\n- Quotes\n- Settings\n"));

    // TODO: create deletion routine and method
}