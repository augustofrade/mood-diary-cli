import chalk from 'chalk';
import inquirer from 'inquirer';

import { DailyEntryService } from '../service/DailyEntryService';
import { MoodEnum } from '../types/enum';
import { moodColors } from '../util/moodColors';
import { mainMenu } from './mainMenu';

export function listEntries() {
    showPrompt(true, true, true);
}

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
                ...entries.map(e => {
                    const title = [];
                    if(visibleDates) title.push(`${e.dateID}`);
                    if(visibleMoods) {
                        const color = moodColors[e.mood];
                        title.push(`${color(MoodEnum[e.mood])}`);
                    }
                    if(visibleTitles) title.push(`${e.title}`);
                    return {
                        name: title.join(" | "),
                        value: e.dateID
                    }
                })
            ]
        }
    ])
    .then((answer: { choice: string }) => {
        switch(answer.choice) {
            case "back":
                // TODO: make wrapper object with navigation methods
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
                console.log("selected day: ", answer.choice);
                break;
        }
    })
}