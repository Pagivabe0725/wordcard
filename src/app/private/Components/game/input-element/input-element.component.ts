import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { WordCard } from '../../../../Shared/Interfaces/wordcard';
import { WriteService } from '../../../Services/write.service';
import { WriteHelper } from '../../../../Shared/Interfaces/writeHelper';
import { CommonModule } from '@angular/common';
import { WriteInputComponent } from '../../learning-part/write-input/write-input.component';

@Component({
  selector: 'app-input-element',
  standalone: true,
  imports: [CommonModule, WriteInputComponent],
  templateUrl: './input-element.component.html',
  styleUrl: './input-element.component.scss',
})
export class InputElementComponent implements OnInit {
  @Output() public ratingEvent: EventEmitter<number> = new EventEmitter();

  @Input() public actualCard?: WordCard;
  public displayedWord?: string;
  public actualWriteObject?: WriteHelper;

  constructor(private writeService: WriteService) {}

  ngOnInit(): void {
    this.displayedWord = this.actualCard!.hungarian;
    const helper: Array<Array<string>> =
      this.writeService.createValuesOfActualCardAndFillableArray(
        this.actualCard!,
        'english'
      );
    this.actualWriteObject = {
      actualCardArray: helper[0],
      fillableArray: helper[1],
      result: undefined,
      workIndex: 0,
      fillable: true,
    };
  }

  checker(obj: { index: number; result: boolean }) {
    if (obj.result) {
      if (this.actualCard!.english.length < 10) {
        this.ratingEvent.emit(5);
      } else if (
        this.actualCard!.english.length > 10 &&
        this.actualCard!.english.length < 20
      ) {
        this.ratingEvent.emit(7);
      } else {
        this.ratingEvent.emit(10);
      }
    } else {
      this.displayedWord = this.actualCard!.english;
      this.ratingEvent.emit(0);
      setTimeout(() => {
        this.displayedWord = this.actualCard!.hungarian;
      }, 1500);
    }
  }
}
