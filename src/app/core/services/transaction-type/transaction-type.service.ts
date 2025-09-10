import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  CollectionReference,
  doc,
  DocumentData,
  DocumentReference,
  FieldValue,
  getDocs,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { from, map, Observable } from 'rxjs';
import { AuthService } from '../../auth/service/auth.service';
import { db } from '../../firebase/firebase';
import { TRANSACTION_TYPE_COLLECTION } from '../../tokens/firestore.token';

export interface TransactionType {
  id?: string;
  name: string;
  description?: string;
  color?: string; // optional, for charts

  userId?: string;
  createdAt?: string | FieldValue;
}
@Injectable()
export class TransactionTypeService {
  private auth = inject(AuthService);

  private col: CollectionReference = inject(TRANSACTION_TYPE_COLLECTION);
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

  addTransactionType(
    transactionType: Omit<TransactionType, 'id' | 'userId' | 'createdAt'>
  ): Observable<DocumentReference> {
    if (!this.auth.uid) throw new Error('Not authenticated');
    const payload: TransactionType = {
      ...transactionType,
      userId: this.auth.uid,
      createdAt: serverTimestamp(),
    };
    return from(addDoc(this.col, payload).then((docRef) => docRef));
  }
}
