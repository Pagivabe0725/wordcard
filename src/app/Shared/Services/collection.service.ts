import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { doc } from '@angular/fire/firestore';

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
}
