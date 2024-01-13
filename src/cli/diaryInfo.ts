import chalk from 'chalk';
import dayjs from 'dayjs';
import inquirer from 'inquirer';

import { DailyEntryService } from '../service/DailyEntryService';
import { MoodEnum } from '../types/enum';
import { ConfigManager } from '../util/ConfigManager';
import { printHeaderLine } from '../util/printHeaderLine';
import { randomArrayItem } from '../util/randomArrayItem';
import { mainMenu } from './mainMenu';

export function diaryDetails() {
    const { author, diaryName } = ConfigManager.instance().configs!;
    const { wordCount, mood } = DailyEntryService.instance().entriesAverageDetails();
    const countAdjetive = randomArrayItem(["Amazing", "Incredible", "Marvellous", "Impressive"]);

    console.clear();
    console.log(chalk.green(`\nHello, ${author}! Today is ${dayjs().format("YYYY-MM-DD")}. Here are some details about your "${diaryName}":\n`));
    console.log(chalk.gray("-".repeat(process.stdout.columns)));

    printHeaderLine("\nAverage Mood", MoodEnum[mood.average.toFixed(0) as unknown as number]);
    if(mood.mostCommon !== null)
        printHeaderLine("Most Commom Mood", MoodEnum[mood.mostCommon]);

    printHeaderLine(`${countAdjetive} total of Words Written`, wordCount);
    console.log("\n");
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "Choose:",
            choices: ["Go back"]
        }
    ])
    .then(answer => {
        mainMenu();
    });
}