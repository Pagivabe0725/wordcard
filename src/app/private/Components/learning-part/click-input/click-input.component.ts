import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-click-input',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './click-input.component.html',
  styleUrl: './click-input.component.scss',
})
export class ClickInputComponent {
  @Output() public turnEvent: EventEmitter<void> = new EventEmitter();
  @Input() public actualIndex: number = 0;
  @Output() resultEvent: EventEmitter<{ index: number; result: boolean }> =
    new EventEmitter();
}
