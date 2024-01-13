import fs from 'fs';
import path from 'path';

import { basePath } from './directories';

export function generateQuotesFile() {
    const filepath = path.join(basePath, "headings.txt");
    const quotes = [
        '"Be yourself; everyone else is already taken" - Oscar Wilde',
        '"It is never too late to be what you might have been" - George Eliot',
        '"Everything you can imagine is real" - Pablo Picasso'
    ];
    fs.writeFileSync(filepath, quotes.join("\n"), "utf8");
}