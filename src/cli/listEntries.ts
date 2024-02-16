import chalk from 'chalk';
import dayjs from 'dayjs';
import inquirer from 'inquirer';

import { DailyEntryService } from '../service/DailyEntryService';
import { MoodEnum } from '../types/enum';
import { IEntryListItem } from '../types/IEntryListItem';
import { moodColors } from '../util/moodColors';
import { mainMenu } from './mainMenu';
import { viewEntry } from './viewEntry';
import { ConfigManager } from '../util/ConfigManager';
import { CategoryHandler } from '../util/CategoryHandler';


interface IPromptOptions {
    visibleDates: boolean;
    visibleTitles: boolean;
    visibleMoods: boolean;
    filterCategory?: string;
}

/**
 * Default entry listing format
 */
export function listEntries() {
    showPrompt({
        visibleDates: true,
        visibleTitles: true,
        visibleMoods: true
    });
}

let defaultChoice: string = "filter-category";

/**
 * Actual menu
 */
function showPrompt(options: IPromptOptions) {
    const { visibleDates, visibleTitles, visibleMoods, filterCategory } = options;

    console.clear();
    console.log(chalk.gray("Select an entry to read, edit or delete it.\n"));
    const service = DailyEntryService.instance();
    const entries = service.listEntries(filterCategory);
    let label = "Entries:";
    if(filterCategory) {
        label = `Entries that are in the ${filterCategory} category:`;
    }
    label = `[${entries.length}] ${label}`;

    inquirer
    .prompt([
        {
            type: "list",
            name: "choice",
            message: "Choose:",
            default: defaultChoice,
            pageSize: 25,
            choices: [
                new inquirer.Separator("Options:"),
                {
                    name: "Go back",
                    value: "back"
                },
                {
                    name: "Filter by category",
                    value: "filter-category"
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
                new inquirer.Separator(label),
                ...generateList(entries, filterCategory == undefined)
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
                showPrompt({ visibleDates: !visibleDates, visibleTitles, visibleMoods, filterCategory });
                break;
            case "toggle-titles":
                showPrompt({ visibleDates, visibleTitles: !visibleTitles, visibleMoods, filterCategory });
                break;
            case "toggle-moods":
                showPrompt({ visibleDates, visibleTitles, visibleMoods: !visibleMoods, filterCategory });
                break;
            case "filter-category":
                filterByCategory(visibleDates, visibleTitles, visibleMoods);
                break;
            default:
                viewEntry(answer.choice);
                break;
        }
    })

    /**
     * Generates an Inquirer list with choices based on the daily entries
     * @param entries List of entries to generate the list from
     * @param isFiltering if the array is a filtered list to hide the helper advice to the user
     * @returns 
     */
    function generateList(entries: Array<IEntryListItem>, isFiltering: boolean) {
        if(entries.length == 0 && !isFiltering) {
            return [
                new inquirer.Separator("\nNothing here... :p\nStart by writing a new entry!")
            ];
        }
        const { dateFormat } = ConfigManager.instance().configs!;
        return entries
            .sort((a, b) => Date.parse(a.dateID) - Date.parse(b.dateID))
            .reverse()
            .map(e => {
                const title = [];
                if(visibleDates) {
                    title.push(`${dayjs(e.dateID).format(dateFormat)}`);
                }
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

function filterByCategory(visibleDates: boolean, visibleTitles: boolean, visibleMoods: boolean) {
    console.clear();
    console.log(chalk.gray("Select a category name to filter entries\n"));
    const categories = new CategoryHandler().categories;

    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            pageSize: 20,
            message: "Choose:",
            choices: [
                ...categories,
                new inquirer.Separator(" "),
                {
                    name: "Go back & reset",
                    value: "go-back-reset"
                }
            ]
        }
    ])
    .then(({ choice }: { choice: string }) => {
        let chosenCategory: string | undefined;
        if(choice != "go-back-reset")
            chosenCategory = choice;
        showPrompt({
            visibleDates,
            visibleTitles,
            visibleMoods,
            filterCategory: chosenCategory
        });
    })
}