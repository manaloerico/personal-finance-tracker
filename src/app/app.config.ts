import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { provideFirebaseApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { provideFirestore } from '@angular/fire/firestore';
import { provideAnimations } from '@angular/platform-browser/animations';
import { collection } from 'firebase/firestore';
import { routes } from './app.routes';
import { auth, db, firebaseApp } from './core/firebase/firebase';
import { provideTransactionTypeMap } from './core/mapper/transaction-type.mapper';
import {
  BUDGET_COLLECTION,
  CATEGORY_COLLECTION,
  TRANSACTION_COLLECTION,
  TRANSACTION_TYPE_COLLECTION,
  TRANSACTION_TYPE_MAP,
} from './core/tokens/firestore.token';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideAnimations(),
    provideFirebaseApp(() => firebaseApp),
    provideAuth(() => auth),
    provideFirestore(() => db),
    {
      provide: TRANSACTION_TYPE_COLLECTION,
      useValue: collection(db, 'transactionType'),
    },
    {
      provide: CATEGORY_COLLECTION,
      useValue: collection(db, 'categories'),
    },
    {
      provide: TRANSACTION_COLLECTION,
      useValue: collection(db, 'transactions'),
    },
    {
      provide: BUDGET_COLLECTION,
      useValue: collection(db, 'budgets'),
    },
    {
      provide: TRANSACTION_TYPE_MAP,
      useFactory: provideTransactionTypeMap,
      deps: [TRANSACTION_TYPE_COLLECTION],
    },
  ],
};
