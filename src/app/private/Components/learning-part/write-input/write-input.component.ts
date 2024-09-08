import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { WordCard } from '../../../../Shared/Interfaces/wordcard';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-write-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './write-input.component.html',
  styleUrl: './write-input.component.scss',
})
export class WriteInputComponent implements OnInit {
  @Input() actualCard?: WordCard;
  @Input() firstSide?: 'english' | 'hungarian';
  @Input() actualIndex?: number;
  @Output() resultEvent: EventEmitter<{ index: number; result: boolean }> =
    new EventEmitter();
  public fillableArray: Array<string> = [];

  public actualCardArray: Array<string> = [];
  public workIndex: number = 0;
  private fillable: boolean = true;
  public result: undefined | boolean = undefined;

  ngOnInit(): void {
    this.startSetting();
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.key.length === 1 && this.fillable) {
      this.isSpace(true);
      this.fillableArray[this.workIndex] = event.key;
      this.plus();
    } else if (this.result === undefined && event.code === 'Backspace') {
      this.isSpace(false);
      this.fillableArray[this.workIndex] = ' ';
    } else if (this.result === undefined && event.code === 'Enter') {
      this.completeresultprocessfuncion();
    }
  }

  startSetting() {
    this.fillable = true;
    this.result = undefined;
    this.fillableArray = [];
    this.actualCardArray = [];
    this.workIndex = 0;
    for (
      let i = 0;
      i <
      (this.firstSide === 'english'
        ? this.actualCard!.hungarian.length
        : this.actualCard!.english.length);
      i++
    ) {
      if (this.firstSide === 'english') {
        this.actualCardArray?.push(this.actualCard!.hungarian[i]);
      } else if (this.firstSide === 'hungarian') {
        this.actualCardArray?.push(this.actualCard!.english[i]);
      }
    }
    for (let i = 0; i < this.actualCardArray.length; i++) {
      this.fillableArray.push(' ');
    }
  }

  minus(): void {
    this.workIndex - 1 > -1 ? (this.workIndex--, (this.fillable = true)) : ' ';
  }

  plus(): void {
    this.workIndex < this.actualCardArray.length - 1
      ? this.workIndex++
      : (this.fillable = false);
  }

  isSpace(plus: boolean): void {
    if (plus) {
      if (this.actualCardArray[this.workIndex] === ' ') {
        this.plus();
      }
    } else {
      if (
        this.actualCardArray[this.workIndex] === ' ' ||
        this.fillableArray[this.workIndex] === ' '
      ) {
        this.minus();
      }
    }
  }

  formatchecker(): boolean {
    for (let i = 0; i < this.actualCardArray.length; i++) {
      if (this.fillableArray[i] === ' ' && this.actualCardArray[i] !== ' ') {
        return false;
      }
    }
    return true;
  }

  resultChecker(): boolean {
    for (let i = 0; i < this.fillableArray.length; i++) {
      if (this.actualCardArray[i] !== this.fillableArray[i]) {
        return false;
      }
    }
    return true;
  }

  completeresultprocessfuncion(): void {
    if (this.formatchecker()) {
      this.result = this.resultChecker();
      this.resultEvent.emit({
        result: this.result,
        index: this.actualIndex !== undefined ? this.actualIndex : -1,
      });
      setTimeout(() => {
        this.startSetting();
      }, 1500);
    }
  }
}
