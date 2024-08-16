import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { WordCard } from '../../../../Shared/Interfaces/wordcard';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-element',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-element.component.html',
  styleUrl: './input-element.component.scss',
})
export class InputElementComponent implements OnChanges {
  @Input() public index?: number;
  @Input() valueObject?: WordCard;
  @Output() setCardEvent: EventEmitter<{ index: number; card: WordCard }> =
    new EventEmitter();

    ngOnChanges(): void {
      console.log('hello')
    }

  isEmpty(which: string): boolean {
    switch (which) {
      case 'hungarian':
        if (this.valueObject?.hungarian === '') {
          return true;
        }
        return false;
      case 'english':
        if (this.valueObject?.english === '') {
          return true;
        }
        return false;
    }
    return true;
  }

  changeValue(which: string, value: string): void {
    if (this.valueObject) {
      if (which === 'hungarian') {
        this.valueObject.hungarian = value;
      } else if (which === 'englis') {
        this.valueObject.english = value;
      }
      this.setCardFunction();
    }
  }

  setCardFunction() {
    if (
      !this.isEmpty('hungarian') &&
      !this.isEmpty('english') &&
      this.valueObject !== undefined &&
      this.index !== undefined
    ) {
      let obj: { index: number; card: WordCard } = {
        index: this.index,
        card: this.valueObject,
      };
      this.setCardEvent.emit(obj);
    }
  }
}
