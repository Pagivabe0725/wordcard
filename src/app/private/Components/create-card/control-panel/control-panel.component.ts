import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-control-panel',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './control-panel.component.html',
  styleUrl: './control-panel.component.scss',
})
export class ControlPanelComponent {
  @Output() plusEvent: EventEmitter<void> = new EventEmitter();
  @Output() minusEvent: EventEmitter<void> = new EventEmitter();
  @Output() switchEvent: EventEmitter<void> = new EventEmitter();
  @Input() controlPanelSide: boolean = false;
}
