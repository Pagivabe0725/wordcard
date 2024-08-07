import { Component } from '@angular/core';
import { LeftSideComponent } from './Components/left-side/left-side.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-public',
  standalone: true,
  imports: [LeftSideComponent,RouterOutlet],
  templateUrl: './public.component.html',
  styleUrl: './public.component.scss'
})
export class PublicComponent {

}
