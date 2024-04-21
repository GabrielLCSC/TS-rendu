import { Task } from "./Task";
import { TaskManager } from "./TaskManager.js";

// Initialise le gestionnaire de tâches
const taskManager = new TaskManager();

// Variables globales pour le titre, la description, la date et l'état de la tâche
let title = "";
let description = "";
let date: Date;
let etat = "";

// Charge les tâches depuis le stockage local
function loadTasksFromLocalStorage(): Task[] {
  const taskJSON = localStorage.getItem("tasks");
  return taskJSON ? JSON.parse(taskJSON) : [];
}

// Sauvegarde les tâches dans le stockage local
function saveTasksToLocalStorage(): void {
  localStorage.setItem("tasks", JSON.stringify(taskManager.getTasks()));
}

// Charge les tâches depuis le stockage local et les ajoute au gestionnaire de tâches
const tasks: Task[] = loadTasksFromLocalStorage();
tasks.forEach((task) => {
  taskManager.addTask(task);
  const taskElement = createTaskElement(task);
  const tasksDiv = document.querySelector("#tasks");
  tasksDiv!.appendChild(taskElement);
});

// Écouteur d'événement pour le formulaire de création de tâche
document
  .querySelector("#taskForm")!
  .addEventListener("submit", function (event) {
    event.preventDefault();

    title = (document.querySelector("#taskTitle") as HTMLInputElement).value;
    description = (
      document.querySelector("#taskDescription") as HTMLInputElement
    ).value;
    date = new Date(
      (document.querySelector("#taskDueDate") as HTMLInputElement).value
    );
    etat = (document.querySelector("#taskPriority") as HTMLInputElement).value;

    if (title && description && date && etat) {
      createNewTask(title, description, date, etat);
      envoieFormulaire(event);
    } else {
      alert("Veuillez remplir tous les champs");
    }
  });

// Crée une nouvelle tâche
function createNewTask(
  title: string,
  description: string,
  date: Date,
  etat: string
): Task {
  return {
    id: taskManager.getTasks().length + 1,
    titre: title,
    description,
    date,
    etat,
  };
}

// Fonction d'envoi du formulaire de création de tâche
function envoieFormulaire(event: Event): void {
  event.preventDefault();

  const newTask = createNewTask(title, description, date, etat);
  taskManager.addTask(newTask);
  saveTasksToLocalStorage();

  const taskElement = createTaskElement(newTask);
  const tasksDiv = document.querySelector("#tasks");
  tasksDiv!.appendChild(taskElement);
}

// Crée un élément de tâche HTML à partir d'une tâche
function createTaskElement(newTask: Task): HTMLElement {
  const taskDiv = document.createElement("div");

  const taskDate = new Date(newTask.date);
  if (!(taskDate instanceof Date) || isNaN(taskDate.getTime())) {
    console.error("La date n'est pas valide :", newTask.date);
    return taskDiv;
  }

  const etatString =
    newTask.etat === "high"
      ? "Priorité haute"
      : newTask.etat === "medium"
      ? "Priorité moyenne"
      : "Priorité basse";

  const h3 = document.createElement("h3");
  h3.textContent = `${newTask.titre} – ${etatString}`;
  taskDiv.appendChild(h3);

  const dateP = document.createElement("p");
  dateP.textContent = `Date d'échéance: ${
    taskDate.toISOString().split("T")[0]
  }`;
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
const modal = document.querySelector(".modal") as HTMLElement;
const closeButton = document.querySelector(".close") as HTMLElement;

// Fonction pour afficher ou masquer la modal
function toggleModal() {
  modal.style.display = modal.style.display === "none" ? "block" : "none";
}

// Ajoute un écouteur d'événement au bouton de fermeture de la modal
closeButton.addEventListener("click", toggleModal);

// Pré-remplit le formulaire de modification avec les données de la tâche sélectionnée
function preFillForm(taskId: number) {
  const task = taskManager.getTasks().find((task) => task.id === taskId);

  if (task) {
    (document.getElementById("updateTitle") as HTMLInputElement).value =
      task.titre;
    (
      document.getElementById("updateDescription") as HTMLTextAreaElement
    ).value = task.description;
    (document.getElementById("updateDate") as HTMLInputElement).value =
      task.date.toISOString().split("T")[0];
    (document.getElementById("updateEtat") as HTMLSelectElement).value =
      task.etat;
    (document.querySelector("#updateTaskId") as HTMLInputElement).value =
      taskId.toString();
  }
}

// Met à jour une tâche avec les nouvelles données du formulaire de modification
function updateTask(event: Event): void {
  event.preventDefault();

  const taskId = parseInt(
    (document.querySelector("#updateTaskId") as HTMLInputElement).value
  );
  const title = (document.querySelector("#updateTitle") as HTMLInputElement)
    .value;
  const description = (
    document.querySelector("#updateDescription") as HTMLTextAreaElement
  ).value;
  const date = new Date(
    (document.querySelector("#updateDate") as HTMLInputElement).value
  );
  const etat = (document.querySelector("#updateEtat") as HTMLSelectElement)
    .value;

  taskManager.updateTask(taskId, title, description, date, etat);
}

// Sélectionne le formulaire de mise à jour et ajoute un écouteur d'événement pour soumettre la mise à jour de la tâche
const updateForm = document.querySelector("#updateForm") as HTMLFormElement;
updateForm.addEventListener("submit", updateTask);

// Fonction de filtrage des tâches
function filtreTask(): void {
  console.log("alo tu marches ??");
  const filterValuePriorityElement = document.querySelector(
    "#filterPriority"
  ) as HTMLInputElement;
  const filterValuePriority = filterValuePriorityElement.value;
  console.log("alo tu marches ??");
}

// Ajoute un écouteur d'événement au bouton d'application du filtre
document.querySelector("#applyFilter")!.addEventListener("click", filtreTask);

// Ajoute un écouteur d'événement pour le chargement du document, qui appelle également la fonction de filtrage des tâches
document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("#applyFilter")!.addEventListener("click", filtreTask);
});
