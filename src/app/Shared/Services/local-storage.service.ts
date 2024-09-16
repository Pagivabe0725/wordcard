import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  createObject(key: string, object: Object): void {
    localStorage.setItem(key, JSON.stringify(object));
  }

  chosenObjectFromLocalStorage(key: string): Object {
    return JSON.parse(localStorage.getItem(key) as string);
  }

  getOnePropertyOfObject(key: string, property: string): any {
    return JSON.parse(localStorage.getItem(key) as string)[property];
  }

  removeObjectFromLocalStorage(key: string): void {
    localStorage.removeItem(key);
  }
}
