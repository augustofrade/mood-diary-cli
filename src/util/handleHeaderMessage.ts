import chalk from 'chalk';

import { IHeaderMessage } from '../types/IHeaderMessage';

export function handleHeaderMessage(message?: IHeaderMessage): void {
    if(message) {
        const color = message.isError ? chalk.yellow : chalk.green;
        console.log(chalk.bold(color("\n" + message.text)));
    }
}