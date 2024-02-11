import { ConfigManager } from "./ConfigManager";

export class CategoryHandler {
    // TODO: put this class as a property in ConfigManager
    private readonly cm = ConfigManager.instance();
    private _categories: string[] = [];

    public constructor() {
        this._categories = this.cm.configs!.categories;
    }

    public get categories(): string[] {
        return this._categories;
    }

    public categoryExists(categoryName: string): boolean {
        const cat = this._categories.map(c => c.toLowerCase());
        return cat.includes(categoryName.toLowerCase());
    }

    public addCategory(categoryName: string): void {
        this._categories.push(categoryName);
        // update by reference
        this.cm.updateConfigs();
    }

    public deleteCategory(categoryName: string): void {
        const cat = this._categories.map(c => c.toLowerCase());
        const indexOf = cat.indexOf(categoryName.toLowerCase());
        this._categories.splice(indexOf, 1);
        // update by reference
        this.cm.updateConfigs();
    }
}