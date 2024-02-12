import { ConfigManager } from "./ConfigManager";

export class CategoryHandler {
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
        // update by ConfigManager.configs.categories reference
        this.cm.updateConfigs();
    }

    public deleteCategory(categoryName: string): void {
        const cat = this._categories.map(c => c.toLowerCase());
        const indexOfCategory = cat.indexOf(categoryName.toLowerCase());
        this._categories.splice(indexOfCategory, 1);
        // update by ConfigManager.configs.categories reference
        this.cm.updateConfigs();
    }
}