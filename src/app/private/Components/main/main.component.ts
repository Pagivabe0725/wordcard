import { Component, OnDestroy, OnInit } from '@angular/core';
import { LeftSideComponent } from './left-side/left-side.component';
import { RightSideComponent } from './right-side/right-side.component';
import { CollectionService } from '../../../Shared/Services/collection.service';
import { Subscription } from 'rxjs';
import { LocalStorageService } from '../../../Shared/Services/local-storage.service';
import { User } from '../../../Shared/Interfaces/user';
import { GetCardsService } from '../../Services/get-cards.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [LeftSideComponent, RightSideComponent, MatProgressSpinner],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit, OnDestroy {
  public cardNumber: number = 0;
  public goodAnswerNumber: number = 0;
  public badAnswerNumber: number = 0;
  public categoryNumber: number = 0;
  private cardSub?: Subscription;
  public loading: boolean = true;

  constructor(
    private collectionService: CollectionService,
    private localStorageService: LocalStorageService,
    private get_cardService: GetCardsService
  ) {}

  ngOnInit(): void {
    const actualUser: string = this.localStorageService.getOnePropertyOfObject(
      'user',
      'id'
    );
    this.checkLastLog();
    const userSub: Subscription = this.collectionService
      .getDatasFromCollectionByName('Users', actualUser, undefined)
      .subscribe((user) => {
        if (user) {
          this.badAnswerNumber = (user as User).badAnswerToday;
          this.goodAnswerNumber = (user as User).goodAnswerToday;
        }

        userSub.unsubscribe();
      });

    this.cardSub = this.get_cardService
      .GetCards('all', actualUser)
      .subscribe((data) => {
        console.log(data);
        this.categoryNumber! += 1;
        this.cardNumber! += data.pack.length;
      });

    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  checkLastLog(): void {
    let actualUser: User =
      this.localStorageService.chosenObjectFromLocalStorage('user') as User;
    let oldTime: Date = new Date(actualUser.lastLoggedIn.seconds * 1000);
    let newTime: Date = new Date(Timestamp.now().seconds * 1000);
    console.log(oldTime);
    console.log(newTime);

    if (oldTime.getDate() !== newTime.getDate()) {
      actualUser.goodAnswerToday = 0;
      actualUser.badAnswerToday = 0;
      this.collectionService
        .setDatasByCollectionName('Users', actualUser.id, undefined, actualUser)
        .catch((err) => {
          console.error(err);
        });
    } else {
      actualUser.lastLoggedIn = Timestamp.now();
      this.collectionService
        .setDatasByCollectionName('Users', actualUser.id, undefined, actualUser)
        .then(() => this.localStorageService.createObject('user', actualUser))
        .catch((err) => {
          console.error(err);
        });
    }
  }

  ngOnDestroy(): void {
    this.cardSub?.unsubscribe();
  }
}
