import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { WordCard } from '../../../Shared/Interfaces/wordcard';
import { InputElementComponent } from './input-element/input-element.component';
import { ControlPanelComponent } from './control-panel/control-panel.component';
import { PopupService } from '../../../Shared/Services/popup.service';
import { Dialog } from '../../../Shared/Interfaces/dialog';
const templateCard: WordCard = { hungarian: '', english: '' };

@Component({
  selector: 'app-create-card',
  standalone: true,
  imports: [InputElementComponent, ControlPanelComponent],
  templateUrl: './create-card.component.html',
  styleUrl: './create-card.component.scss',
})
export class CreateCardComponent {
  public title?: string;
  public inputValuesArray: Array<WordCard> = [{ ...templateCard }];

  constructor(private popupService: PopupService) {}
  setCardByIndex(obj: { index: number; card: WordCard }): void {
    this.inputValuesArray[obj.index] = obj.card;
    console.log(this.inputValuesArray);
  }

  minusRow(stop: boolean): void {
    let deletedRow: number = 0;
    for (let i = this.inputValuesArray.length - 1; i > -1; --i) {
      if (
        this.inputValuesArray[i].english === '' &&
        this.inputValuesArray[i].hungarian === '' &&
        this.inputValuesArray.length !== 1
      ) {
        this.inputValuesArray.splice(i, 1);
        deletedRow++;
        if (stop) {
          break;
        }
      }
    }
    if (!deletedRow) {
      const actualDialog: Dialog = {
        title: 'hiba',
        text: 'Nincs üres sor amit ki tudnál törölni!',
        chose: false,
        color: 'accent',
      };
      this.popupService.displayPopUp(actualDialog);
    } else {
      this.scroll();
    }
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
}
