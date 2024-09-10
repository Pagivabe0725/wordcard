import { Component, Input } from '@angular/core';
import { NumberInTimePipe } from '../../../Services/number-in-time.pipe';

@Component({
  selector: 'app-info-board',
  standalone: true,
  imports: [NumberInTimePipe],
  templateUrl: './info-board.component.html',
  styleUrl: './info-board.component.scss',
})
export class InfoBoardComponent {
  @Input() public pieceOfHp: Array<boolean> = [];
  @Input() public movingPoint?: number;
  @Input() public timer?: number;
}
