import chalk from 'chalk';
import dayjs from 'dayjs';
import inquirer from 'inquirer';

import { DailyEntryService } from '../service/DailyEntryService';
import { MoodEnum } from '../types/enum';
import { IEntryListItem } from '../types/IEntryListItem';
import { moodColors } from '../util/moodColors';
import { mainMenu } from './mainMenu';
import { viewEntry } from './viewEntry';

export function listEntries() {
    showPrompt(true, true, true);
}

let defaultChoice: string = "toggle-dates";

function showPrompt(visibleDates: boolean, visibleTitles: boolean, visibleMoods: boolean) {
    console.clear();
    console.log(chalk.gray("Select an entry to read, edit and delete it."));
    const service = DailyEntryService.instance();
    const entries = service.listEntries();

    inquirer
    .prompt([
        {
            type: "list",
            name: "choice",
            message: "Choose:",
            default: defaultChoice,
            pageSize: 20,
            choices: [
                new inquirer.Separator("Options:"),
                {
                    name: "Go back",
                    value: "back"
                },
                {
                    name: "Toggle dates",
                    value: "toggle-dates"
                },
                {
                    name: "Toggle titles",
                    value: "toggle-titles"
                },
                {
                    name: "Toggle moods",
                    value: "toggle-moods"
                },
                new inquirer.Separator(),
                new inquirer.Separator("Entries:"),
                ...generateList(entries)
            ]
        }
    ])
    .then((answer: { choice: string }) => {
        defaultChoice = answer.choice;
        switch(answer.choice) {
            case "back":
                mainMenu();
                break;
            case "toggle-dates":
                showPrompt(!visibleDates, visibleTitles, visibleMoods);
                break;
            case "toggle-titles":
                showPrompt(visibleDates, !visibleTitles, visibleMoods);
                break;
            case "toggle-moods":
                showPrompt(visibleDates, visibleTitles, !visibleMoods);
                break;
            default:
                viewEntry(answer.choice);
                break;
        }
    })

    function generateList(entries: Array<IEntryListItem>) {
        if(entries.length == 0) {
            return [
                new inquirer.Separator("\nNothing here... :p\nStart by writing a new entry!")
            ];
        } else {
            return entries
            .sort((a, b) => Date.parse(a.dateID) - Date.parse(b.dateID))
            .reverse()
            .map(e => {
                const title = [];
                if(visibleDates) title.push(`${dayjs(e.dateID).format("YYYY-MM-DD")}`);
                if(visibleMoods) {
                    const color = moodColors[e.mood];
                    title.push(`${color(MoodEnum[e.mood])}`);
                }
                if(visibleTitles) title.push(`${e.title}`);
                return {
                    name: title.join(" | "),
                    value: e.dateID
                }
            });
        }
    }
}