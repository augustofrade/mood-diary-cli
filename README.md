# CLI Mood Diary

A full-featured CLI mood diary aimed to provide a user-friendly interface for journaling one's mood and activities through the terminal.

You can pick a name for your diary and yourself, be greeted with motivational quotes, keep track of your daily mood and much more!

This was made for learning purposes, using the service/repository pattern with polymorphism, singleton classes and dependency injection.

## Features

- [X] CLI with menus to choose between different actions
- [X] Write, edit, delete and read entries from any given date
- [X] Name the diary and choose how you would like to be called
- [X] Word counting features
- [X] Average and most common mood tracking
- [X] Edit the daily entry description with your default text editor
- [X] List of random quotes on the main menu that can be changed/hidden
- [X] Easy access to quotes list file to add more quotes to the main menu
- [X] Easy access to JSON configuration file
- [X] Create and delete entry categories
- [X] Filter entry list by categories
- [X] Export/back up all entries to a single JSON file to chosen path
- [X] Import backup/exported entries into the diary 
- [X] Entry Schema validation
- [X] Setup config file on first initialization
- [X] "Factory Reset" options
- [X] JSON storage Repository
- [ ] SQL storage Repository
- [ ] Encryption

## Installation
```
git clone https://github.com/augustofrade/mood-diary-cli.git
cd mood-diary-cli
npm run create
```

Or you can run each step of the installation separately:

```
git clone https://github.com/augustofrade/mood-diary-cli.git
cd mood-diary-cli
npm install
npm run build
npm i -g
```

## Usage

Upon executing the software for the first time, the user will be prompted to set basic info, such as their name, diary's name and which storage method they would like to use (JSON or SQL). Then, after the initial setup they will be prompted with the main menu unless either the diary or its configuration file (config.json) are deleted.

In the main menu, they can choose between several options and its actions.

### New Entry

Prompts the user to pick a date in the YYYY-MM-DD format and let them set the daily entry categories and day's mood and write its title and description. If they desire to, there's the option to review what was written and change it.

Writing the entry's description is done using the system's preferred text editor.

### List Entries

Lists available entries to the user and a few options:
- Filter by category
- Toggle dates/titles/moods

If an entry is selected, a screen with its information will be shown with all of its details.

### View Entry

Simply select an entry in the "List Entries" menu.

### Edit or delete an entry

Simply select an entry in the "List Entries" menu and choose the desired action.

### View Diary Details

Show the following informations about the diary:
- Average mood
- Most common mood
- Sum of words written in all entries

### Categories

Categories can be set to an entry during its creation or edition proccess.

Some categories are created by default upon the diary's creation.

It is possible to list the available categories, create or delete one by selecting **Categories Settings** in the Settings menu.

### Usage of Main Menu's Quotes

Quotes are stored on the `headings.txt` file located on the diary's directory and will be randomly shown to the user in the main menu unless it is set to not do so.

It is possible to reset (and recreate) the quotes list files by selecting **Reset quote list** on the Settings menu.

### Export to JSON

It is possible to export all the entries to a **single JSON file** by selecting the option **Export and backup entries to JSON file** in the Settings menu.

Simply select the action and pick a directory. The file will be created in the following name format: `{directory}/diary_export_YYYYMMDDmmSS.json`.

### Import from backup

It is possible to import your entries to the diary from a exported JSON file by selecting the option **Import from backup** in the Settings menu and writing the file's full path.

**Note**: if there's entries that share the same ID (YYYY-MM-DD), the one in the diary will be overwriten by the one in the backup file.

### Reset Settings

It is possible to reset the settings by selecting **Reset diary's settings** in the Settings menu. By doing so, the diary first setup screen will be instantly prompted again.

### Settings menu

This menu lists several options for the user:
- Change user's name
- Change diary's name
- Change date formatting (default: YYYY-MM-DD)
- Hide/Show quotes on main menu
- Categories Settings
- Import from backup
- Export and backup entries to JSON file
- Reset quote list
- Reset diary's settings
- Delete everything