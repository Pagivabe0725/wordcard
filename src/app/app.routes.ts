import { Routes } from '@angular/router';
import { PublicComponent } from './public/public.component';
import { PrivateComponent } from './private/private.component';
import { LoginComponent } from './public/Components/login/login.component';
import { SignUpComponent } from './public/Components/sign-up/sign-up.component';
import { MainComponent } from './private/Components/main/main.component';
import { LearnCardComponent } from './private/Components/learn-card/learn-card.component';
import { CreateCardComponent } from './private/Components/create-card/create-card.component';
import { VerbsComponent } from './private/Components/verbs/verbs.component';
import { GameComponent } from './private/Components/game/game.component';

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
    path: 'private/:id',
    component: PrivateComponent,
    title: 'private',
    children: [
      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full',
      },
      {
        path: 'main',
        component: MainComponent,
        title: 'main',
      },
      {
        path: 'learn-card',
        component: LearnCardComponent,
        title: 'learn-card',
      },
      {
        path: 'create-card',
        component: CreateCardComponent,
        title: 'create-card',
      },
      {
        path: 'verb-forms',
        component: VerbsComponent,
        title: 'verb-forms',
      },
      {
        path: 'easy-game',
        component: GameComponent,
        title: 'game',
      },
      {
        path: 'mid-game',
        component: GameComponent,
        title: 'game',
      },
      {
        path: 'hard-game',
        component: GameComponent,
        title: 'game',
      },
    ],
  },
];
