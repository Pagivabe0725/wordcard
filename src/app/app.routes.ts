import { Routes } from '@angular/router';
import { PublicComponent } from './public/public.component';
import { PrivateComponent } from './private/private.component';
import { LoginComponent } from './public/Components/login/login.component';
import { SignUpComponent } from './public/Components/sign-up/sign-up.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'public',
    pathMatch: 'full',
  },
  {
    path: 'public',
    component: PublicComponent,
    title: 'public',
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: LoginComponent,
        title: 'login',
      },
      {
        path: 'sign-up',
        component: SignUpComponent,
        title: 'registration',
      },
    ],
  },
  {
    path: 'private',
    component: PrivateComponent,
    title: 'private',
  },
];
