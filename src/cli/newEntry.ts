import chalk from 'chalk';
import dayjs from 'dayjs';
import inquirer from 'inquirer';

import { DailyEntryService } from '../service/DailyEntryService';
import { MoodEnum } from '../types/enum';
import { IDailyEntry } from '../types/IDailyEntry';
import { filterInput, validateInput } from '../util/inputValidations';

export function newEntry() {
    const todayDateID = dayjs().format("YYYY-MM-DD");
    console.log(chalk.yellow("Press enter or leave blank for today's date or\nchose another one by typing it on yyyy-mm-dd format."));

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
                }
                return true;
            } 
        }
    ])
    .then((answer: { dateToAdd: string }) => {
        const dateToAdd = dayjs(answer.dateToAdd).format("YYYY-MM-DD");
        entryMenu(dateToAdd, todayDateID == dateToAdd);
    })
}


function entryMenu(dateID: string, isToday: boolean) {
    console.clear();
    console.log(chalk.gray("Creating entry for %s"), chalk.green(isToday ? "today" : dateID))

    inquirer
    .prompt([
       {
        name: "title",
        message: "Title:",
        default: dateID,
        filter: filterInput,
        validate: validateInput,
       },
       {
        type: "list",
        name: "mood",
        message: "Mood:",
        choices: Object.values(MoodEnum).filter(x => typeof x !== "number")
       },
       {
        type: "editor",
        name: "description",
        message: "Description:",
        filter: filterInput
       }
    ])
    .then((answers: IDailyEntry) => {
        const entryService = DailyEntryService.instance();
        entryService.addEntry(answers);
    });
}