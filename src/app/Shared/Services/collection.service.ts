import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { doc, updateDoc, deleteField, getFirestore } from 'firebase/firestore';
import { initializeApp } from '@angular/fire/app';
import { finalPack } from '../Interfaces/finalPack';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  constructor(private fireStore: AngularFirestore) {}

  getDatasFromCollectionByName(
    collection: string,
    userId: string | undefined,
    doc: string | undefined
  ) {
    if (!userId) {
      return this.fireStore.collection(collection).doc(doc).valueChanges();
    } else {
      return this.fireStore.collection(collection).doc(userId).valueChanges();
    }
  }

  setDatasByCollectionName(
    collection: string,
    userId: string | undefined,
    doc: string | undefined,
    object: object
  ) {
    if (!userId) {
      return this.fireStore.collection(collection).doc(doc).set(object);
    } else {
      return this.fireStore.collection(collection).doc(userId).set(object);
    }
  }

  deleteCollectionDoc(
    collection: string,
    userId: string | undefined,
    doc: string | undefined
  ) {
    if (!userId) {
      return this.fireStore.collection(collection).doc(doc).set({});
    } else {
      return this.fireStore.collection(collection).doc(userId).set({});
    }
  }

  updateCollectiondoc(
    collection: string,
    userId: string | undefined,
    doc: string | undefined,
    object: object
  ) {
    if (!userId) {
      return this.fireStore.collection(collection).doc(doc).update(object);
    } else {
      return this.fireStore.collection(collection).doc(userId).update(object);
    }
  }

  deletePackByTitle(userId: string, title: string) {
    const conf = {
      projectId: 'card-4ba14',
      appId: '1:286101602632:web:263faa96704c50196d737d',
      storageBucket: 'card-4ba14.appspot.com',
      apiKey: 'AIzaSyALpqjqCorJ-OTw1fphmupod6pwvvhlbIc',
      authDomain: 'card-4ba14.firebaseapp.com',
      messagingSenderId: '286101602632',
    };
    const app = initializeApp(conf);
    const db = getFirestore(app);
    const ref = doc(db, 'Packs', userId);
    return updateDoc(ref, {
      [title]: deleteField(),
    });
  }
}
