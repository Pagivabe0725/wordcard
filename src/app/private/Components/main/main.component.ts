import { Component } from '@angular/core';
import { LeftSideComponent } from './left-side/left-side.component';
import { RightSideComponent } from './right-side/right-side.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [LeftSideComponent,RightSideComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
