import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom([
      AngularFireModule.initializeApp({
        projectId: 'card-4ba14',
        appId: '1:286101602632:web:263faa96704c50196d737d',
        storageBucket: 'card-4ba14.appspot.com',
        apiKey: 'AIzaSyALpqjqCorJ-OTw1fphmupod6pwvvhlbIc',
        authDomain: 'card-4ba14.firebaseapp.com',
        messagingSenderId: '286101602632',
      }),
      AngularFireAuthModule,
      AngularFirestoreModule,
    ]),

    
  ],
};
