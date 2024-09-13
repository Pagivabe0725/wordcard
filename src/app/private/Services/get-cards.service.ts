import { Injectable } from '@angular/core';
import { Observable, Subscriber, Subscription, filter } from 'rxjs';
import { finalPack } from '../../Shared/Interfaces/finalPack';
import { CollectionService } from '../../Shared/Services/collection.service';

@Injectable({
  providedIn: 'root',
})
export class GetCardsService {
  constructor(private collectionService: CollectionService) {}

  GetCards(keyOrKeys: Array<string>, user: string): Observable<finalPack> {
    let obj: any;

    return new Observable((subsriber: Subscriber<finalPack>) => {
      const allObject: Subscription = this.collectionService
        .getDatasFromCollectionByName('Packs', user, undefined)
        .subscribe((data) => {
          if (data) {
            obj = data;
          }
          for (let i = 0; i < Object.keys(obj).length; i++) {
            if (keyOrKeys.includes(Object.keys(obj)[i])) {
              subsriber.next(Object.values(obj as object)[i]);
            }
          }
          allObject.unsubscribe();
        });
    });
  }
}
