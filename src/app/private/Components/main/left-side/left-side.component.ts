import { Component } from '@angular/core';
import { DataElementComponent } from './data-element/data-element.component';

@Component({
  selector: 'app-left-side',
  standalone: true,
  imports: [DataElementComponent],
  templateUrl: './left-side.component.html',
  styleUrl: './left-side.component.scss'
})
export class LeftSideComponent {

}
