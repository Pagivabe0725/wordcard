import { Timestamp } from "@angular/fire/firestore";

export interface User {
  badAnswerToday: number;
  email: string;
  firstName: string;
  goodAnswerToday: number;
  id: string;
  lastLoggedIn: Timestamp;
  lastName: string;
}
