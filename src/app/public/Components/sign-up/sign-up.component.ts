import { Component } from '@angular/core';
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
import { User } from '../../../Shared/Interfaces/user';
import { RouterService } from '../../../Shared/Services/router.service';
import { PopupService } from '../../../Shared/Services/popup.service';
import { Dialog } from '../../../Shared/Interfaces/dialog';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  public loading: boolean = false;
  public sign_upForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.minLength(6),
      Validators.required,
    ]),
    rePassword: new FormControl('', [
      Validators.minLength(6),
      Validators.required,
    ]),
  });

  constructor(
    private userService: UserService,
    private routerService: RouterService,
    private popupService: PopupService
  ) {}

  equalPasswords(): boolean {
    return (
      this.sign_upForm.get('password')?.value ===
      this.sign_upForm.get('rePassword')?.value
    );
  }

  passwordCheck(): void {
    if (!this.equalPasswords()) {
      this.sign_upForm.get('password')?.setErrors(Validators.compose);
      this.sign_upForm.get('rePassword')?.setErrors(Validators.compose);
    } else {
      this.sign_upForm.get('password')?.setErrors(null);
      this.sign_upForm.get('rePassword')?.setErrors(null);
    }
  }

  registration() {
    this.passwordCheck();
    if (this.equalPasswords() && this.sign_upForm.valid) {
      const actualDialog: Dialog = {
        title: 'Hiba',
        text: 'Hiba történt a regisztráció során. Valószínűleg az email-cím már foglalt',
        chose: false,
        color: 'primary',
      };
      this.loading = true;
      this.userService
        .signUpWithEmailAndPassword(
          this.sign_upForm.get('email')?.value,
          this.sign_upForm.get('password')?.value
        )
        .then((user) => {
          if (user.user?.uid) {
            const actualUser: User = {
              id: user.user.uid,
              email: this.sign_upForm.get('email')?.value,
              lastName: this.sign_upForm.get('lastName')?.value,
              firstName: this.sign_upForm.get('firstName')?.value,
              badAnswerToday: 0,
              goodAnswerToday: 0,
              lastLoggedIn: new Date(),
            };
            this.userService
              .createUserObject(actualUser)
              .then(() => {
                this.loading = false;
                this.routerService.navigate('public');
              })
              .catch((err) => {
                console.error(err);
                this.loading = false;
                this.popupService.displayPopUp(actualDialog);
              });
          }
        })
        .catch((err) => {
          console.error(err);
          this.loading = false;
          this.popupService.displayPopUp(actualDialog);
        });
    }
  }
}
