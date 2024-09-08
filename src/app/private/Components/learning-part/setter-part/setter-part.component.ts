import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-setter-part',
  standalone: true,
  imports: [MatButtonModule, CommonModule],
  templateUrl: './setter-part.component.html',
  styleUrl: './setter-part.component.scss',
})
export class SetterPartComponent {
  public starterSide?: 'english' | 'hungarian';
  public errorSign?: boolean;
  public inputType?: 'click' | 'write';
  @Output() setterEvent: EventEmitter<{
    startSide: 'english' | 'hungarian';
    errorSign: boolean;
    inputType: 'click' | 'write';
  }> = new EventEmitter();

  setStarterSide(value: 'english' | 'hungarian'): void {
    this.starterSide = value;
  }

  setInputType(value: 'click' | 'write'): void {
    this.inputType = value;
  }

  setErrorSign(value: boolean) {
    this.errorSign = value;
  }

  sendBasicSettings(): void {
    if (
      this.inputType !== undefined &&
      this.starterSide !== undefined &&
      this.errorSign !== undefined
    ) {
      this.setterEvent.emit({
        startSide: this.starterSide,
        inputType: this.inputType,
        errorSign: this.errorSign,
      });
    }
  }
}
