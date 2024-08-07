import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  constructor(private router: Router) {}

  actualLocation(): string {
    return this.router.url.split('/')[this.router.url.split('/').length - 1];
  }

  navigate(path: string): void {
    this.router.navigateByUrl(path);
  }
}
