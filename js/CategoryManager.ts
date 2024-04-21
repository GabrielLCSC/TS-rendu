import { Category } from "./Category";

export class CategoryManager {
  private categories: Category[] = [];

  addCategory(category: Category): void {
    this.categories.push(category);
  }

  getCategories() {
    return this.categories;
  }
}
