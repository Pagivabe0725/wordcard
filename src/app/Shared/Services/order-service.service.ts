import { Injectable } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { finalPack } from '../Interfaces/finalPack';

@Injectable({
  providedIn: 'root',
})
export class OrderServiceService {
  constructor() {}

  orderString(
    Array: Array<finalPack>,
    incrase: boolean
  ): Promise<Array<finalPack>> {
    const orderPromise: Promise<Array<finalPack>> = new Promise(
      (resolve, reject) => {
        if (!Array) {
          reject('Error in operation of orderString!');
        } else {
          resolve(
            incrase
              ? Array.sort((a: finalPack, b: finalPack) =>
                  a.title > b.title ? 1 : -1
                )
              : Array.sort((a: finalPack, b: finalPack) =>
                  a.title < b.title ? 1 : -1
                )
          );
        }
      }
    );

    return orderPromise;
  }

  orderTimestamp(
    Array: Array<finalPack>,
    incrase: boolean
  ): Promise<Array<finalPack>> {
    const orderPromise: Promise<Array<finalPack>> = new Promise(
      (resolve, reject) => {
        if (!Array) {
          reject('Error in operation of orderTimestamp!');
        } else {
          resolve(
            incrase
              ? Array.sort((a: finalPack, b: finalPack) =>
                  a.date < b.date ? 1 : -1
                )
              : Array.sort((a: finalPack, b: finalPack) =>
                  a.date > b.date ? 1 : -1
                )
          );
        }
      }
    );

    return orderPromise;
  }
}
