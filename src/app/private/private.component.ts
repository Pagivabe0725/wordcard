import { Component } from '@angular/core';
import { MenuBarComponent } from './Components/menu-bar/menu-bar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-private',
  standalone: true,
  imports: [MenuBarComponent, RouterOutlet],
  templateUrl: './private.component.html',
  styleUrl: './private.component.scss',
})
export class PrivateComponent {}
