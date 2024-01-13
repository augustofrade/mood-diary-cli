import chalk from 'chalk';
import dayjs from 'dayjs';
import inquirer from 'inquirer';

import { DailyEntryService } from '../service/DailyEntryService';
import { MoodEnum } from '../types/enum';
import { IConfirmation } from '../types/IConfirmation';
import { moodColors } from '../util/moodColors';
import { entrySetup } from './entrySetup';
import { listEntries } from './listEntries';
import { mainMenu } from './mainMenu';

export function viewEntry(dateID: string) {
    const entry = DailyEntryService.instance().readEntry(dateID);
    if(!entry)
        return mainMenu();

    const moodIndex = MoodEnum[entry.mood] as unknown as number;
    const moodColor = moodColors[moodIndex];
    const creationDate = dayjs(entry.creationDate).format("hh:mm, YYYY/MM/DD");
    const modificationDate = dayjs(entry.modificationDate).format("hh:mm, YYYY/MM/DD");
    
    console.clear();
    console.log("-".repeat(process.stdout.columns));
    console.log(chalk.bold(chalk.gray(dateID.replace(/-/g, "/"))));
    console.log("-".repeat(process.stdout.columns));
    printHeaderLine("Title", chalk.bold(chalk.green(entry.title)));
    printHeaderLine("Mood", moodColor(entry.mood));
    printHeaderLine("Word Count", entry.wordCount.toString());
    printHeaderLine("Creation Date", chalk.italic(chalk.gray(creationDate)));
    printHeaderLine("Modification Date", chalk.italic(chalk.gray(modificationDate)));
    console.log("-".repeat(process.stdout.columns));
    console.log(entry.description);
    console.log("-".repeat(process.stdout.columns));

    console.log(chalk.gray("\n\nWhat would you like to do?"));

    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "Choose:",
            choices: [
                {
                    name: "Go back",
                    value: "back"
                },
                {
                    name: "Edit Entry",
                    value: "edit"
                },
                new inquirer.Separator(" "),
                {
                    name: chalk.redBright("Delete entry"),
                    value: "delete"
                },
                
            ]
        }
    ])
    .then(({ choice }: { choice: string }) => {
        if(choice == "back") {
            listEntries();
        } else if(choice == "edit") {
            entrySetup(dateID);
        } else {
            deleteEntryPrompt(dateID);
        }
    });
}

function printHeaderLine(name: string, value: any) {
    console.log(chalk.bold(`${name}:`), value);
}

function deleteEntryPrompt(dateID: string) {
    const formattedDate = dateID.replace(/-/g, "/");
    console.log(chalk.bold(chalk.red(`\nAre you sure you want to delete ${formattedDate}'s entry?`)));
    console.log(chalk.italic(chalk.bold(chalk.red("This action cannot be undone!!"))));

    inquirer.prompt([
        {
            type: "list",
            name: "confirmation",
            message: "Delete?",
            default: "no",
            choices: [
                {
                    name: chalk.red("Yes, delete it"),
                    value: "yes"
                },
                {
                    name: "Nevermid",
                    value: "no"
                }
            ]
        }
    ])
    .then(({ confirmation }: IConfirmation) => {
        if(confirmation == "yes") {
            console.log(chalk.italic(chalk.yellow("\nDeleting...")));
            const service = DailyEntryService.instance();
            const success = service.deleteEntry(dateID);
            if(success) {
                console.log(chalk.green("Entry deleted successfuly!"));
                console.log(chalk.gray("Returning to previous page..."));
                setTimeout(listEntries, 1000);
            } else {
                console.log(chalk.red("Failed to delete entry"));;
            }
        } else {
            viewEntry(dateID);
        }
    });
}