import { TaskManager } from "./TaskManager.js";
// Initialise le gestionnaire de tâches
const taskManager = new TaskManager();
// Variables globales pour le titre, la description, la date et l'état de la tâche
let title = "";
let description = "";
let date;
let etat = "";
// Charge les tâches depuis le stockage local
function loadTasksFromLocalStorage() {
    const taskJSON = localStorage.getItem("tasks");
    return taskJSON ? JSON.parse(taskJSON) : [];
}
// Sauvegarde les tâches dans le stockage local
function saveTasksToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(taskManager.getTasks()));
}
// Charge les tâches depuis le stockage local et les ajoute au gestionnaire de tâches
const tasks = loadTasksFromLocalStorage();
tasks.forEach((task) => {
    taskManager.addTask(task);
    const taskElement = createTaskElement(task);
    const tasksDiv = document.querySelector("#tasks");
    tasksDiv.appendChild(taskElement);
});
// Écouteur d'événement pour le formulaire de création de tâche
document
    .querySelector("#taskForm")
    .addEventListener("submit", function (event) {
    event.preventDefault();
    title = document.querySelector("#taskTitle").value;
    description = document.querySelector("#taskDescription").value;
    date = new Date(document.querySelector("#taskDueDate").value);
    etat = document.querySelector("#taskPriority").value;
    if (title && description && date && etat) {
        createNewTask(title, description, date, etat);
        envoieFormulaire(event);
    }
    else {
        alert("Veuillez remplir tous les champs");
    }
});
// Crée une nouvelle tâche
function createNewTask(title, description, date, etat) {
    return {
        id: taskManager.getTasks().length + 1,
        titre: title,
        description,
        date,
        etat,
    };
}
// Fonction d'envoi du formulaire de création de tâche
function envoieFormulaire(event) {
    event.preventDefault();
    const newTask = createNewTask(title, description, date, etat);
    taskManager.addTask(newTask);
    saveTasksToLocalStorage();
    const taskElement = createTaskElement(newTask);
    const tasksDiv = document.querySelector("#tasks");
    tasksDiv.appendChild(taskElement);
}
// Crée un élément de tâche HTML à partir d'une tâche
function createTaskElement(newTask) {
    const taskDiv = document.createElement("div");
    const taskDate = new Date(newTask.date);
    if (!(taskDate instanceof Date) || isNaN(taskDate.getTime())) {
        console.error("La date n'est pas valide :", newTask.date);
        return taskDiv;
    }
    const etatString = newTask.etat === "high"
        ? "Priorité haute"
        : newTask.etat === "medium"
            ? "Priorité moyenne"
            : "Priorité basse";
    const h3 = document.createElement("h3");
    h3.textContent = `${newTask.titre} – ${etatString}`;
    taskDiv.appendChild(h3);
    const dateP = document.createElement("p");
    dateP.textContent = `Date d'échéance: ${taskDate.toISOString().split("T")[0]}`;
    taskDiv.appendChild(dateP);
    const descriptionP = document.createElement("p");
    descriptionP.textContent = newTask.description;
    taskDiv.appendChild(descriptionP);
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "deleteTask";
    deleteButton.textContent = "Supprimer";
    deleteButton.addEventListener("click", () => {
        taskManager.deleteTask(newTask.id);
        taskDiv.remove();
        saveTasksToLocalStorage();
    });
    taskDiv.appendChild(deleteButton);
    const modifyButton = document.createElement("button");
    modifyButton.className = "buttonModify, edit-btn";
    modifyButton.textContent = "Modifier";
    modifyButton.addEventListener("click", () => {
        toggleModal();
        preFillForm(newTask.id);
    });
    taskDiv.appendChild(modifyButton);
    return taskDiv;
}
// Sélectionne l'élément modal et le bouton de fermeture
const modal = document.querySelector(".modal");
const closeButton = document.querySelector(".close");
// Fonction pour afficher ou masquer la modal
function toggleModal() {
    modal.style.display = modal.style.display === "none" ? "block" : "none";
}
// Ajoute un écouteur d'événement au bouton de fermeture de la modal
closeButton.addEventListener("click", toggleModal);
// Pré-remplit le formulaire de modification avec les données de la tâche sélectionnée
function preFillForm(taskId) {
    const task = taskManager.getTasks().find((task) => task.id === taskId);
    if (task) {
        document.getElementById("updateTitle").value =
            task.titre;
        document.getElementById("updateDescription").value = task.description;
        document.getElementById("updateDate").value =
            task.date.toISOString().split("T")[0];
        document.getElementById("updateEtat").value =
            task.etat;
        document.querySelector("#updateTaskId").value =
            taskId.toString();
    }
}
// Met à jour une tâche avec les nouvelles données du formulaire de modification
function updateTask(event) {
    event.preventDefault();
    const taskId = parseInt(document.querySelector("#updateTaskId").value);
    const title = document.querySelector("#updateTitle")
        .value;
    const description = document.querySelector("#updateDescription").value;
    const date = new Date(document.querySelector("#updateDate").value);
    const etat = document.querySelector("#updateEtat")
        .value;
    taskManager.updateTask(taskId, title, description, date, etat);
}
// Sélectionne le formulaire de mise à jour et ajoute un écouteur d'événement pour soumettre la mise à jour de la tâche
const updateForm = document.querySelector("#updateForm");
updateForm.addEventListener("submit", updateTask);
// Fonction de filtrage des tâches
function filtreTask() {
    console.log("alo tu marches ??");
    const filterValuePriorityElement = document.querySelector("#filterPriority");
    const filterValuePriority = filterValuePriorityElement.value;
    console.log("alo tu marches ??");
}
// Ajoute un écouteur d'événement au bouton d'application du filtre
document.querySelector("#applyFilter").addEventListener("click", filtreTask);
// Ajoute un écouteur d'événement pour le chargement du document, qui appelle également la fonction de filtrage des tâches
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#applyFilter").addEventListener("click", filtreTask);
});
