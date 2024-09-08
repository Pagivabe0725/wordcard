import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { WordCard } from '../../../../Shared/Interfaces/wordcard';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-display',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './display.component.html',
  styleUrl: './display.component.scss',
})
export class DisplayComponent implements OnChanges  {
  @Input() public actualPair?: WordCard;
  @Input() public actualIndex?: number;
  @Input() public firstSide?: 'english' | 'hungarian';
  @Input() public errorRate?: string ;

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.errorRate)
  }

  getActualSide(): string {
    if (this.actualIndex !== -1) {
      if (this.firstSide === 'english') {
        return this.actualPair!.english;
      } else if (this.firstSide === 'hungarian') {
        return this.actualPair!.hungarian;
      }
    }
    return '';
  }
}
