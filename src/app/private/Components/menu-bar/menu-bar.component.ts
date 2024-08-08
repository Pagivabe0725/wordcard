import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  DoCheck,
  OnChanges,
  OnInit,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterService } from '../../../Shared/Services/router.service';
import { LocalStorageService } from '../../../Shared/Services/local-storage.service';

@Component({
  selector: 'app-menu-bar',
  standalone: true,
  imports: [MatToolbarModule, MatMenuModule, MatButtonModule, MatIconModule],
  templateUrl: './menu-bar.component.html',
  styleUrl: './menu-bar.component.scss',
})
export class MenuBarComponent {
  public page: string = 'Főmenü';

  constructor(
    private routerService: RouterService,
    private localStorageService: LocalStorageService
  ) {}

  translateUrl(text: string): string {
    switch (text) {
      case 'main':
        return 'Főmenű';
      case 'create-card':
        return 'Kártyakreátor';
      case 'learn-card':
        return 'Szótanulás';
      case 'verb-forms':
        return 'Igék';
      case 'easy-game':
        return 'Könnyű játék';
      case 'mid-game':
        return 'Közepes játék';
      case 'hard-game':
        return 'Nehéz játék';
    }
    return '';
  }

  navigate(path: string) {
    this.routerService.navigate('private/' + path);
    this.page = this.translateUrl(path);
  }

  quit() {
    this.localStorageService.removeObjectFromLocalStorage('user');
    this.routerService.navigate('public');
  }
}
