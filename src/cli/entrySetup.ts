import chalk from 'chalk';
import dayjs from 'dayjs';
import inquirer from 'inquirer';

import { DailyEntryService } from '../service/DailyEntryService';
import { MoodEnum } from '../types/enum';
import { IConfirmation } from '../types/IConfirmation';
import { IDailyEntry } from '../types/IDailyEntry';
import { filterInput, validateInput } from '../util/inputValidations';
import { mainMenu } from './mainMenu';


export function entrySetup(dateID?: string) {
    const todayDateID = dayjs().format("YYYY-MM-DD");
    if(dateID) {
        const entry = DailyEntryService.instance().readEntry(dateID);
        if(entry)
            return entryCreationMenu(dateID, todayDateID == dateID, true, entry);
    }

    console.log(chalk.yellow("Press enter or leave blank for today's date or\nchoose another one by typing it on yyyy-mm-dd format."));

    inquirer
    .prompt([
        {
            name: "dateToAdd",
            message: "Choose a date:",
            default: todayDateID,
            filter: (answer) => {
                answer = answer.trim();
                return answer == "" ? todayDateID : answer;
            },
            validate: (answer) => {
                if(!dayjs(answer).isValid()) {
                    console.log(chalk.red("\nType a valid date!"));
                    return false;
                } else if(dayjs(answer).isAfter(todayDateID)) {
                    console.log(chalk.red("\nYou cannot create a entry for a future date!"));
                    return false;
                } else {
                    const entryExists = DailyEntryService.instance().entryExists(answer);
                    
                    if(entryExists) {
                        console.log(chalk.red("\nAn entry for this date already exists!"));
                        return false;
                    }
                }
                return true;
            } 
        }
    ])
    .then((answer: { dateToAdd: string }) => {
        const dateToAdd = dayjs(answer.dateToAdd).format("YYYY-MM-DD");
        entryCreationMenu(dateToAdd, todayDateID == dateToAdd, false);
    })
}


function entryCreationMenu(dateID: string, isToday: boolean, isEditing: boolean, previousInput?: Partial<IDailyEntry>) {
    console.clear();
    console.log(chalk.gray(`${isEditing ? "Editing" : "Creating"} entry for ${chalk.green(isToday ? "today" : dateID)}`));
    if(previousInput == undefined) {
        previousInput = {};
        previousInput.title = dateID;
    }

    inquirer
    .prompt([
       {
        name: "title",
        message: "Title:",
        filter: filterInput,
        validate: validateInput,
        default: previousInput.title
       },
       {
        type: "list",
        name: "mood",
        message: isToday ? "How are you feeling today?" : "How were you feeling that day?",
        choices: Object.values(MoodEnum).filter(x => typeof x !== "number"),
        default: previousInput.mood
       },
       {
        type: "editor",
        name: "description",
        message: "Description:",
        filter: filterInput,
        default: previousInput.description
       },
       {
        type: "list",
        name: "confirmation",
        message: "Save?",
        choices: [
            {
                name:"Yes, save",
                value: "yes"
            },
            {

                name: "No, review",
                value: "no"
            },
            new inquirer.Separator(),
            {
                name: "Cancel and exit",
                value: "exit"
            }
        ]
       }
    ])
    .then((answers: IDailyEntry & IConfirmation) => {
        if(answers.confirmation == "yes") {
            answers.dateID = dateID;
            (answers as any).confirmation = undefined;
            saveEntry(answers);
        } else if(answers.confirmation == "exit") {
            mainMenu();
        } else {
            entryCreationMenu(dateID, isToday, isEditing, answers);
        }
    });
}


function saveEntry(answers: IDailyEntry) {
    console.log(chalk.gray("\nSaving..."));
    const entryService = DailyEntryService.instance();
    const success = entryService.addEntry(answers);
    if(success) {
        console.log(chalk.green("Entry saved successfully!"));
        console.log(chalk.gray("Returning to the main menu..."));
        setTimeout(mainMenu, 1000);

    } else {
        console.log(chalk.red("Failed to create entry"))
        // TODO: create tmp file -> diary/tmp to save save written content
    }
}