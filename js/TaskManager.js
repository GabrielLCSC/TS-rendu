export class TaskManager {
    tasks = [];
    addTask(task) {
        this.tasks.push(task);
    }
    deleteTask(taskId) {
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
    }
    updateTask(taskId, title, description, date, etat) {
        let task = this.tasks.find((task) => task.id === taskId);
        if (task) {
            task.titre = title;
            task.description = description;
            task.date = date;
            task.etat = etat;
        }
    }
    getTasks() {
        return this.tasks;
    }
}
