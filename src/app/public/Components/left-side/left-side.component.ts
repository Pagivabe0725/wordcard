import {
  AfterContentChecked,
  AfterViewChecked,
  Component,
  OnChanges,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { RouterService } from '../../../Shared/Services/router.service';

@Component({
  selector: 'app-left-side',
  standalone: true,
  imports: [MatButtonModule, RouterLink],
  templateUrl: './left-side.component.html',
  styleUrl: './left-side.component.scss',
})
export class LeftSideComponent implements AfterContentChecked {
  public actualPage: string = 'login';

  constructor(private routerService: RouterService) {}

  ngAfterContentChecked(): void {
    this.setActualPage();
  }

  setActualPage() {
    this.actualPage = this.routerService.actualLocation();
  }
}
