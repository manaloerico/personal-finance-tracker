import { inject, Injectable } from '@angular/core';
import {
  collection,
  CollectionReference,
  doc,
  DocumentData,
  DocumentReference,
  getDocs,
  query,
} from 'firebase/firestore';
import { from, map, Observable } from 'rxjs';
import { AuthService } from '../../auth/service/auth.service';
import { db } from '../../firebase/firebase';

export interface TransactionType {
  id?: string;
  name: string;
  color?: string; // optional, for charts
}
@Injectable({
  providedIn: 'root',
})
export class TransactionTypeService {
  private auth = inject(AuthService);

  private col: CollectionReference = collection(db, 'transactionType');
  getTransactionTypeMap() {
    const transactionType$ = from(getDocs(this.col).then((snap) => snap));
    return transactionType$.pipe(
      map((snap) => {
        const transactionTypeMap: Record<string, Partial<TransactionType>> = {};

        snap.forEach((doc) => {
          transactionTypeMap[doc.ref.path] = { id: doc.id, ...doc.data() };
        });

        return transactionTypeMap;
      })
    );
  }

  getTransactionTypeList(): Observable<TransactionType[]> {
    if (!this.auth.uid) return from(Promise.resolve([])); // return empty array if not logged in

    const q = query(this.col);

    return from(
      getDocs(q).then((snap) =>
        snap.docs.map((d) => ({ id: d.id, ...d.data() } as TransactionType))
      )
    );
  }

  getTransactionTypeRef(
    id?: string
  ): DocumentReference<DocumentData, DocumentData> {
    return doc(db, 'transactionType', id!);
  }
}
