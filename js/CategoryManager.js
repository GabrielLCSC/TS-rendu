export class CategoryManager {
    categories = [];
    addCategory(category) {
        this.categories.push(category);
    }
    getCategories() {
        return this.categories;
    }
}
