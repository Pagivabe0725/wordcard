import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { DataElementComponent } from './data-element/data-element.component';

@Component({
  selector: 'app-left-side',
  standalone: true,
  imports: [DataElementComponent],
  templateUrl: './left-side.component.html',
  styleUrl: './left-side.component.scss',
})
export class LeftSideComponent implements OnChanges {
  @Input() goodAnswerNumber?: number;
  @Input() badAnswerNumber?: number;
  @Input() cardNumber?: number;
  @Input() categoryNumber?: number;
 
  public dataArray?: Array<{ title: string; value: string }> = [];

  /// good answer, bad answer, card number, pack number

  ngOnChanges(): void {
    this.dataArray = [];
    this.dataArray!.push({
      title: 'Jó válaszok száma:',
      value: this.goodAnswerNumber! + '',
    });
    this.dataArray!.push({
      title: 'Rossz válaszok száma:',
      value: this.badAnswerNumber! + '',
    });
    this.dataArray!.push({
      title: 'Kártyaszámok:',
      value: this.cardNumber! + '',
    });
    this.dataArray!.push({
      title: 'Kategóriaszámok:',
      value: this.categoryNumber! + '',
    });
  }
}
