import { Component, OnInit } from '@angular/core';
import { WordCard } from '../../../Shared/Interfaces/wordcard';
import { InputElementComponent } from './input-element/input-element.component';
import { ControlPanelComponent } from './control-panel/control-panel.component';
import { PopupService } from '../../../Shared/Services/popup.service';
import { Dialog } from '../../../Shared/Interfaces/dialog';
import { CollectionService } from '../../../Shared/Services/collection.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Pack } from '../../../Shared/Interfaces/pack';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TitleComponent } from './title/title.component';
import { FormControl } from '@angular/forms';
import { finalPack } from '../../../Shared/Interfaces/finalPack';
import { RouterService } from '../../../Shared/Services/router.service';
import { Timestamp } from '@angular/fire/firestore';

const templateCard: WordCard = { hungarian: '', english: '' };

@Component({
  selector: 'app-create-card',
  standalone: true,
  imports: [
    InputElementComponent,
    ControlPanelComponent,
    MatProgressSpinner,
    TitleComponent,
  ],
  templateUrl: './create-card.component.html',
  styleUrl: './create-card.component.scss',
})
export class CreateCardComponent implements OnInit {
  public title: FormControl = new FormControl('');
  public titleGiving: boolean = false;
  public inputValuesArray: Array<WordCard> = [{ ...templateCard }];
  private actualUser: string = '';
  public loading: boolean = true;

  constructor(
    private popupService: PopupService,
    private collectionService: CollectionService,
    private actRoute: ActivatedRoute,
    private router: RouterService
  ) {}

  ngOnInit(): void {
    let routerSub: Subscription;
    let collectionSub: Subscription;
    if (this.actRoute.parent) {
      routerSub = this.actRoute.parent.params.subscribe((params: any) => {
        this.actualUser = params.id;
        collectionSub = this.collectionService
          .getDatasFromCollectionByName(
            'InProgress',
            this.actualUser,
            undefined
          )
          .subscribe((data) => {
            if ((data as Pack).title) {
              const actualDialog: Dialog = {
                title: 'Kérdés',
                text: 'Szeretnéd folytatni a félbehagyott paklit?',
                chose: true,
                color: 'accent',
              };
              let popSub: Subscription = this.popupService
                .displayPopUp(actualDialog)
                .afterClosed()
                .subscribe((dialogResult) => {
                  if (dialogResult) {
                    let dataAsPack: Pack = data as Pack;
                    this.inputValuesArray = dataAsPack.array;
                    this.inputValuesArray = dataAsPack.array;
                    this.title?.setValue(dataAsPack.title);
                  } else {
                    this.collectionService
                      .deleteCollectionDoc(
                        'InProgress',
                        this.actualUser,
                        undefined
                      )
                      .then()
                      .catch((err) => console.error(err));
                  }
                  this.loading = false;
                  popSub.unsubscribe();
                });
            } else {
              this.loading = false;
            }

            collectionSub.unsubscribe();
          });
      });

      routerSub.unsubscribe();
    }
  }

  setCardByIndex(obj: { index: number; card: WordCard }): void {
    this.inputValuesArray[obj.index] = obj.card;
    this.setFirebaseCach();
  }

  setFirebaseCach(): void {
    let actualPack: Pack = {
      title: 'CurrentPack',
      length: this.inputValuesArray.length,
      array: this.minusRow(false, false),
    };
    this.collectionService
      .setDatasByCollectionName(
        'InProgress',
        this.actualUser,
        undefined,
        actualPack
      )
      .catch((err) => console.error(err));
  }

  deleteFirebaseCach(): void {
    this.collectionService
      .deleteCollectionDoc('InProgress', this.actualUser, undefined)
      .catch((err) => console.error(err));
  }

  minusRow(stop: boolean, dialog: boolean): Array<WordCard> {
    let helperArray: Array<WordCard> = [...this.inputValuesArray];
    let emptyIndexArray: Array<number> = [];
    for (let i = helperArray.length - 1; i >= 0; --i) {
      if (
        helperArray[i].hungarian === '' &&
        helperArray[i].english === '' &&
        helperArray.length > 1
      ) {
        emptyIndexArray.push(i);
        if (stop) break;
      }
    }

    if (emptyIndexArray.length > 0) {
      for (let i = 0; i < emptyIndexArray.length; i++) {
        helperArray.splice(emptyIndexArray[i], 1);
      }
    } else {
      if (dialog) this.minusPopup();
    }
    this.scroll();

    return helperArray;
  }

  minusPopup(): void {
    const actualDialog: Dialog = {
      title: 'hiba',
      text: 'Nincs üres sor amit ki tudnál törölni!',
      chose: false,
      color: 'accent',
    };
    this.popupService.displayPopUp(actualDialog);
  }

  addRow(): void {
    this.inputValuesArray.push({ ...templateCard });
    setTimeout(() => {
      this.scroll();
    }, 1);
  }

  scroll(): void {
    let div = document.getElementById('own-private-component-container-div');
    if (div) div.scroll(0, div.scrollHeight);
  }

  getElementByIndex(index: number): WordCard {
    return this.inputValuesArray[index];
  }

  filledfield(): boolean {
    for (let i = 0; i < this.inputValuesArray.length; i++) {
      if (
        this.inputValuesArray[i].hungarian !== '' &&
        this.inputValuesArray[i].english !== ''
      ) {
        return true;
      }
    }
    return false;
  }

  setTitleGiving() {
    console.log(this.filledfield());
    if (this.filledfield())
      if (this.titleGiving) {
        this.titleGiving = false;
      } else {
        this.titleGiving = true;
      }
  }

  setTitle(title: string) {
    this.title.setValue(title);
  }

  finalObjectCreator(): { [key: string]: finalPack } {
    let finalObj: finalPack = {
      pack: this.minusRow(false, false),
      changed: false,
      date: Timestamp.now(),
      length: this.minusRow(false, false).length,
      title: this.title.value,
    };
    let finaObjectWithKey: { [key: string]: finalPack } = {
      [this.title.value]: finalObj,
    };

    return finaObjectWithKey;
  }

  save(title: string) {
    this.setTitle(title);
    this.collectionService
      .updateCollectiondoc(
        'Packs',
        this.actualUser,
        undefined,
        this.finalObjectCreator()
      )
      .then(() => {
        this.deleteFirebaseCach();
        this.router.navigate(`private/${this.actualUser}/learn-card`);
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
