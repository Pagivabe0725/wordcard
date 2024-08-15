import { Component, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../../Shared/Services/user.service';
import { Subscription } from 'rxjs';
import { LocalStorageService } from '../../../Shared/Services/local-storage.service';
import { RouterService } from '../../../Shared/Services/router.service';
import { User } from '../../../Shared/Interfaces/user';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../../../Shared/Components/popup/popup.component';
import { Dialog } from '../../../Shared/Interfaces/dialog';
import { PopupService } from '../../../Shared/Services/popup.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
  public loading: boolean = false;
  private userSub?: Subscription;
  public loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  constructor(
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private routerService: RouterService,
    private popupService: PopupService
  ) {}

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  login(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.userService
        .loginUser(
          this.loginForm.get('email')?.value,
          this.loginForm.get('password')?.value
        )
        .then((user) => {
          if (user.user?.uid) {
            this.userSub = this.userService
              .getUserById(user.user?.uid)
              .subscribe((data) => {
                this.localStorageService.createObject('user', data as User);
                this.loading = false;
                this.routerService.navigate(`private/${data?.id}`);
              });
          }
        })
        .catch((err) => {
          console.error(err.message);
          this.loading = false;
          this.loginForm.reset();
          const actualDialog: Dialog = {
            title: 'hiba',
            text: 'A bejelentkezés sikertelen',
            chose: false,
            color:'primary',
          };
          this.popupService.displayPopUp(actualDialog);
        });
    }
  }
}
