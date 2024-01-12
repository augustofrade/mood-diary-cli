import inquirer from "inquirer";
import { IDailyEntry } from "../types/IDailyEntry";
import dayjs from "dayjs";
import { filterInput, validateInput } from "../util/inputValidations";
import { MoodEnum } from "../types/enum";

export function newEntry() {
    const todayDate = dayjs().format("YYYY-MM-DD");
    inquirer
    .prompt([
       {
        name: "title",
        message: "Title:",
        default: todayDate,
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

    });
}