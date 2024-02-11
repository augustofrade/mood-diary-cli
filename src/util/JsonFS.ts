import chalk from 'chalk';
import fs from 'fs';

export class JsonFS {
    public constructor() {}

    public read<T>(filepath: string, validation?: (object: any) => T | null): T {
        try {
            const file = fs.readFileSync(filepath, "utf8");
            let object = JSON.parse(file);

            if(!validation) {
                return object as T;
            }

            object = validation(object);
            if(object == null) {
                throw new Error("ValidationError: file does not match schema requirements");
            }
            
            return object;
        } catch(e) {
            console.log(chalk.red((e as Error).toString()));
            console.log(chalk.red(`File path: ${filepath}`));
            process.exit();
        }
    }

    public writeSync(filepath: string, content: object) {
        fs.writeFileSync(filepath, JSON.stringify(content, null, 2), "utf8");
    }

    public write(filepath: string, content: object) {
        return new Promise((resolve, reject) => {
            fs.writeFile(filepath, JSON.stringify(content, null, 2), "utf8", (err) => {
                if(err) {
                    reject();
                } else {
                    resolve(null);
                }
            });
        })
    }
}