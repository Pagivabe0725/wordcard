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
import { WriteService } from '../../../Services/write.service';
import { WriteHelper } from '../../../../Shared/Interfaces/writeHelper';

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
  @Output() resultEvent: EventEmitter<{
    index: number;
    result: boolean;
  }> = new EventEmitter();
  public actualWriteObject?: WriteHelper;

  constructor(private writeService: WriteService) {}

  ngOnInit(): void {
    this.startSetting();
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.key.length === 1 && this.actualWriteObject!.fillable) {
      this.actualWriteObject = this.writeService.plus(
        this.actualWriteObject!,
        event.key
      );
    } else if (event.key === 'Backspace' && this.actualWriteObject!.fillable) {
      this.actualWriteObject = this.writeService.minus(this.actualWriteObject!);
    } else if (event.key === 'Enter' && this.actualWriteObject!.fillable) {
      if (this.writeService.isFilled(this.actualWriteObject!)) {
        this.actualWriteObject = this.writeService.compareArraysValues(
          this.actualWriteObject!
        );
        this.resultEvent.emit({
          index: this.actualIndex!,
          result: this.getResultWithoutUndifind(),
        });
        
        setTimeout(() => {
          this.startSetting();
        }, 1500);
      }
    }
  }

  getResultWithoutUndifind(): boolean {
    switch (this.actualWriteObject!.result) {
      case true:
        return true;
      case false:
        return false;
      default:
        return false;
    }
  }

  startSetting() {
    const Arrays: Array<Array<string>> =
      this.writeService.createValuesOfActualCardAndFillableArray(
        this.actualCard!,
        this.firstSide!
      );
    const startSettingObject: WriteHelper = {
      fillable: true,
      fillableArray: Arrays[1],
      actualCardArray: Arrays[0],
      result: undefined,
      workIndex: 0,
    };
    this.actualWriteObject = startSettingObject;
  }
}
