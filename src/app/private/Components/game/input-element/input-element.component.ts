import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-input-element',
  standalone: true,
  imports: [],
  templateUrl: './input-element.component.html',
  styleUrl: './input-element.component.scss',
})
export class InputElementComponent {
  @Output() public ratingEvent: EventEmitter<number> = new EventEmitter();

  rating() {
    this.ratingEvent.emit(3);
  }
}
