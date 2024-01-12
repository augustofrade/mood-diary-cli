import fs from "fs";

export class JsonFS {
    public constructor() {}

    public read<T>(filepath: string): T | null {
        try {
            // TODO: add jsonschema verification chain
            const file = fs.readFileSync(filepath, "utf8");
            const object = JSON.parse(file) as T;
            return object;
        } catch(e) {
            console.log(e);
            return null;
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