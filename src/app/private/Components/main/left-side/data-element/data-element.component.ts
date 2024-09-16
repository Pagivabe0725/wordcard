import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-data-element',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './data-element.component.html',
  styleUrl: './data-element.component.scss',
})
export class DataElementComponent {
  @Input() title!: string;
  @Input() value!: string;
}
