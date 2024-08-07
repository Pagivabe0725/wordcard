import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../Interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private fireAuth: AngularFireAuth,
    private fireStore: AngularFirestore
  ) {}

  signUpWithEmailAndPassword(email: string, password: string) {
    return this.fireAuth.createUserWithEmailAndPassword(email, password);
  }

  createUserObject(user: User) {
    return this.fireStore.collection<User>('Users').doc(user.id).set(user);
  }

  loginUser(email: string, password: string) {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  getUserById(userId: string) {
    return this.fireStore.collection<User>('Users').doc(userId).valueChanges();
  }
}
