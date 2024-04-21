import { Category } from "./Category";

export interface Task {
  id: number;
  titre: string;
  description: string;
  date: Date;
  etat: string;
  // categorie: string;
}
