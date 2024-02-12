import chalk from 'chalk';
import dayjs from 'dayjs';
import inquirer from 'inquirer';

import { DailyEntryService } from '../service/DailyEntryService';
import { MoodEnum } from '../types/enum';
import { IConfirmation } from '../types/IConfirmation';
import { IDailyEntry } from '../types/IDailyEntry';
import { CategoryHandler } from '../util/CategoryHandler';
import { trimInput, validateEmptyInput } from '../util/inputValidations';
import { mainMenu } from './mainMenu';


interface IEntryMenuParams {
    dateID: string;
    isToday: boolean;
    isEditing: boolean;
    previousData: Partial<IDailyEntry>
}


export function entrySetup(dateID?: string) {
    const todayDateID = dayjs().format("YYYY-MM-DD");
    if(dateID) {
        const entry = DailyEntryService.instance().readEntry(dateID);
        if(entry) {
            return entryCreationMenu({
                dateID: dateID,
                isToday: todayDateID == dateID,
                isEditing: true,
                previousData: entry
            });
        }
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
            validate: (chosenDate: string) => isChosenDateAvailable(chosenDate, todayDateID)
        }
    ])
    .then((answer: { dateToAdd: string }) => {
        const dateToAdd = dayjs(answer.dateToAdd).format("YYYY-MM-DD");
        entryCreationMenu({
            dateID: dateToAdd,
            isToday: todayDateID == dateToAdd,
            isEditing: false,
            previousData: {
                title: dateToAdd
            }
        });
    })
}


function entryCreationMenu(params: IEntryMenuParams) {
    console.clear();
    const { dateID, isToday, isEditing, previousData } = params;

    console.log(chalk.gray(`${isEditing ? "Editing" : "Creating"} entry for ${chalk.green(isToday ? "today" : dateID)}`));
    const categoriesList = new CategoryHandler().categories;

    inquirer
    .prompt([
        {
            type: "checkbox",
            name: "categories",
            pageSize: 20,
            message: "Choose categories:",
            choices: categoriesList,
            default: previousData.categories
        },
        {
            name: "title",
            message: "Title:",
            filter: trimInput,
            validate: validateEmptyInput,
            default: previousData.title
        },
        {
            type: "list",
            name: "mood",
            message: isToday ? "How are you feeling today?" : "How were you feeling that day?",
            choices: Object.values(MoodEnum).filter(x => typeof x !== "number"),
            default: previousData.mood
        },
        {
            type: "editor",
            name: "description",
            message: "Description:",
            filter: trimInput,
            default: previousData.description
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
                    value: "cancel"
                }
            ]
        }
    ])
    .then((answers: IDailyEntry & IConfirmation) => {
        if(isEditing)
            answers.creationDate = previousData.creationDate!;

        if(answers.confirmation == "cancel") {
            return mainMenu();
        } else if(answers.confirmation == "no") {
            return entryCreationMenu({
                dateID: dateID,
                isToday: isToday,
                isEditing: isEditing,
                previousData: answers
            });
        }

        answers.confirmation = undefined as any;
        answers.dateID = dateID;
        // string -> number
        answers.mood = MoodEnum[answers.mood] as unknown as MoodEnum;
        saveEntry(answers, isEditing);
    });
}


function saveEntry(answers: IDailyEntry, isEditing: boolean) {
    const entryService = DailyEntryService.instance();
    console.log(chalk.gray("\nSaving..."));
    const success = isEditing ? entryService.editEntry(answers) : entryService.addEntry(answers);
    if(!success) {
        console.log(chalk.red("Failed to save entry"))
    }

    console.log(chalk.green("Entry saved successfully!"));
    console.log(chalk.gray("Returning to the main menu..."));
    setTimeout(mainMenu, 1000);
}

function isChosenDateAvailable(chosenDate: string, todayDateID: string): boolean {
    if(!dayjs(chosenDate).isValid()) {
        console.log(chalk.red("\nType a valid date!"));
        return false;
    }
    if(dayjs(chosenDate).isAfter(todayDateID)) {
        console.log(chalk.red("\nYou cannot create a entry for a future date!"));
        return false;
    }
    
    const entryExists = DailyEntryService.instance().entryExists(chosenDate);    
    if(entryExists) {
        console.log(chalk.red("\nAn entry for this date already exists!"));
        return false;
    }
    
    return true;
}