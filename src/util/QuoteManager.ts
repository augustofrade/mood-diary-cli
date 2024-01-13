import fs from 'fs';
import path from 'path';

import { basePath } from './directories';
import { randomArrayItem } from './randomArrayItem';

export class QuoteManager {
    public constructor() {}
    private readonly filepath: string = path.join(basePath, "headings.txt");
    private quotes: string[] = [];
    private quotesLoaded = false;

    public generateFile() {
        const quotes = [
            '"Be yourself; everyone else is already taken" - Oscar Wilde',
            '"It is never too late to be what you might have been" - George Eliot',
            '"Everything you can imagine is real" - Pablo Picasso'
        ];
        fs.writeFileSync(this.filepath, quotes.join("\n"), "utf8");
    }

    public getQuotes(): this {
        this.quotes = fs.readFileSync(this.filepath, "utf8").split("\n");
        this.quotesLoaded = true;
        return this;
    }

    public byIndex(index = 0): string | undefined {
        if(!this.quotesLoaded)
            this.getQuotes();
        return this.quotes[index];
    }

    public random(): string | undefined {
        if(!this.quotesLoaded)
            this.getQuotes();
        return randomArrayItem(this.quotes);
    }
}