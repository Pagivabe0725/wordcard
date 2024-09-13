import { Component, OnDestroy, OnInit } from '@angular/core';
import { WordCard } from '../../../Shared/Interfaces/wordcard';
import { CollectionService } from '../../../Shared/Services/collection.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalPack } from '../../../Shared/Interfaces/finalPack';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DisplayComponent } from './display/display.component';
import { MatButtonModule } from '@angular/material/button';
import { SetterPartComponent } from './setter-part/setter-part.component';
import { ClickInputComponent } from './click-input/click-input.component';
import { WriteInputComponent } from './write-input/write-input.component';
import { PopupService } from '../../../Shared/Services/popup.service';
import { Dialog } from '../../../Shared/Interfaces/dialog';
import { RouterService } from '../../../Shared/Services/router.service';

@Component({
  selector: 'app-learning-part',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    DisplayComponent,
    SetterPartComponent,
    ClickInputComponent,
    WriteInputComponent,
  ],
  templateUrl: './learning-part.component.html',
  styleUrl: './learning-part.component.scss',
})
export class LearningPartComponent implements OnInit, OnDestroy {
  private categoryArray: Array<string> = [];
  public cardArray: Array<WordCard> = [];
  private savedCardArray: Array<WordCard> = [];
  public errorArray: Array<number> = [];
  public actualRandomNumber: number = -1;
  public starterSide?: 'english' | 'hungarian';
  public errorSign?: boolean;
  public inputType?: 'click' | 'write';
  private actualUser?: string;
  private userSub?: Subscription;
  private packSub?: Subscription;
  private collSub?: Subscription;
  public loading: boolean = true;
  constructor(
    private collectionService: CollectionService,
    private actRoute: ActivatedRoute,
    private popupService: PopupService,
    private routerService: RouterService
  ) {}

  ngOnInit(): void {
    this.userSub = this.actRoute.parent!.params.subscribe((params) => {
      this.actualUser = params['id'];
    });

    this.packSub = this.actRoute.params.subscribe((params) => {
      if ((params['array'] as string).includes(',')) {
        this.categoryArray = (params['array'] as string).split(',');
      } else {
        this.categoryArray.push(params['array']);
      }

      this.loadAlCardToCardArray(this.categoryArray);
    });
  }

  loadAlCardToCardArray(helperArray: Array<string>) {
    this.collSub = this.collectionService
      .getDatasFromCollectionByName('Packs', this.actualUser, undefined)
      .subscribe((data: any) => {
        let helperFinalPackArray: Array<finalPack> = [];
        let keyArray: Array<string> = Object.keys(data);
        for (let i = 0; i < keyArray.length; i++) {
          helperFinalPackArray.push(data[keyArray[i]]);
        }

        for (let i = 0; i < helperArray.length; i++) {
          for (let j = 0; j < helperFinalPackArray.length; j++) {
            if (helperArray[i] === helperFinalPackArray[j].title) {
              this.cardArray = this.cardArray.concat(
                helperFinalPackArray[j].pack
              );
            }
          }
        }
        this.randomNumberGenerator();
        this.savedCardArray = [...this.cardArray];
        this.loading = false;
      });
  }

  createErrorArray(): void {
    this.errorArray = [];
    for (let i = 0; i < this.cardArray.length; i++) {
      this.errorArray.push(0);
    }
  }

  randomNumberGenerator(): void {
    this.actualRandomNumber = Math.floor(Math.random() * this.cardArray.length);
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
    this.packSub?.unsubscribe();
    this.collSub?.unsubscribe();
  }

  basicSetter(obj: {
    startSide: 'english' | 'hungarian';
    errorSign: boolean;
    inputType: 'click' | 'write';
  }) {
    this.starterSide = obj.startSide;
    this.errorSign = obj.errorSign;
    this.inputType = obj.inputType;
    if (this.errorSign) {
      this.createErrorArray();
    }
  }

  turnCard(): void {
    this.starterSide === 'hungarian'
      ? (this.starterSide = 'english')
      : (this.starterSide = 'hungarian');
  }

  nextFunction(obj: { index: number; result: boolean }) {
    console.log(obj)
    if (this.inputType === 'write') {
      this.turnCard();
      setTimeout(() => {
        if (obj.result) {
          this.rightAnswer(obj.index);
        } else {
          this.badAnswer(obj.index);
        }
        this.turnCard();
        if (this.cardArray.length === 0) {
          this.chosePopup();
        }
      }, 1500);
    } else if (this.inputType === 'click') {
      if (obj.result) {
        this.rightAnswer(obj.index);
      } else this.badAnswer(obj.index);
      if (this.cardArray.length === 0) {
        this.chosePopup();
      }
    }
  }

  rightAnswer(index: number) {
    this.cardArray.splice(index, 1);
    this.errorArray.splice(index, 1);
    this.randomNumberGenerator();
  }

  badAnswer(index: number) {
    if (this.errorSign) {
      this.errorArray[index] <= 5 ? this.errorArray[index]++ : '';
    }
    this.randomNumberGenerator();
  }

  giveErrorValue(): string {
    if (
      this.errorArray[this.actualRandomNumber] > 0 &&
      this.errorArray[this.actualRandomNumber] <= 5
    ) {
      return `rgba(255,0,0,0.${this.errorArray[this.actualRandomNumber]})`;
    } else if (this.errorArray[this.actualRandomNumber] > 5) {
      return `rgba(255,0,0,0.${5})`;
    } else return ``;
  }

  chosePopup() {
    console.log('ASDASFAF');
    const dialog: Dialog = {
      title: 'Sikeres teljesítés',
      text: 'Sikeresen teljesítetted a paklit. Szeretnéd újrakezdeni?',
      chose: true,
      color: 'primary',
    };
    this.popupService
      .displayPopUp(dialog)
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.cardArray = [...this.savedCardArray];
          this.createErrorArray();
        } else {
          this.routerService.navigate(`private/${this.actualUser}/learn-card`);
        }
      });
  }
}
