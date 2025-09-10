// src/app/features/transactions/data/transactions.service.ts
import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  FieldValue,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { AuthService } from '../auth/service/auth.service';
import { db } from '../firebase/firebase';
import { resolveRefs } from '../utility/resolver';
import { CategoryService } from './category/category.service';

export type TxType = 'income' | 'expense';
export interface Transaction {
  id?: string;
  amount: number; // positive
  transactionTypeId: string;
  transactionType?: DocumentReference<DocumentData, DocumentData> | string; // income | expense
  categoryId?: string; // id of category
  category: DocumentReference<DocumentData, DocumentData> | string; // ref to category
  subCategory?: string;
  date: string; // epoch ms
  note?: string;
  userId?: string;
  createdAt?: string | FieldValue;
}
export interface TransactionSearchFilter {
  startDate?: Date;
  endDate?: Date;
}
@Injectable()
export class TransactionsService {
  private auth = inject(AuthService);
  private col: CollectionReference = collection(db, 'transactions');
  private _transactions$ = new BehaviorSubject<Transaction[]>([]);
  transactions$ = this._transactions$.asObservable();
  protected categoryService = inject(CategoryService);
  categories$ = this.categoryService.categories$;

  constructor() {
    console.log(' TransactionsService initialized');
  }
  private unsub: (() => void) | null = null;

  getCategoryRef(id?: string): DocumentReference<DocumentData, DocumentData> {
    const categoryRef = doc(db, 'categories', id!);
    return categoryRef;
  }
  initRealtime() {
    if (!this.auth.uid) return; // not logged in yet
    this.unsubscribe();

    const q = query(
      this.col,
      where('userId', '==', this.auth.uid),
      orderBy('date', 'desc')
    );

    this.unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(
        (d) =>
          ({
            id: d.id,
            ...d.data(),
          } as Transaction)
      );
      console.log('Transactions updated', data);
      this._transactions$.next(data);
    });
  }

  // async getTransactionsWithCategories() {
  //   // 1. Load categories once
  //   const categoryMap = await this.categoryService.getCategoryMap();

  //   // 2. Load transactions
  //   const transactionSnap = await getDocs(this.col);

  //   // 3. Merge category info
  //   const enriched = transactionSnap.docs.map((docSnap) => {
  //     const data = docSnap.data() as unknown as Transaction;
  //     const category = data.category
  //       ? categoryMap[(data.category as DocumentReference).path]
  //       : null;

  //     const returnData = {
  //       id: docSnap.id,
  //       ...data,
  //       category, // replaces reference with real category object
  //     } as unknown as Transaction;
  //     return returnData;
  //   });
  //   console.log('enriched', enriched);
  //   this._transactions$.next(enriched);
  //   return enriched;
  // }

  categoryList() {
    return [];
  }
  unsubscribe() {
    if (this.unsub) {
      this.unsub();
      this.unsub = null;
    }
  }

  async add(tx: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) {
    if (!this.auth.uid) throw new Error('Not authenticated');
    const payload = {
      ...tx,
      category: this.getCategoryRef(tx.categoryId),
      userId: this.auth.uid,
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(this.col, payload);
    } catch (err) {
      console.error('Error adding document: ', err);
    }
  }

  async update(id: string, patch: Partial<Transaction>) {
    const payload = {
      ...patch,
      category: this.getCategoryRef(patch.categoryId),
    };
    await updateDoc(doc(this.col, id), payload);
  }

  async remove(id: string) {
    await deleteDoc(doc(this.col, id));
  }

  getTransactionList(
    filters?: TransactionSearchFilter
  ): Observable<Transaction[]> {
    console.log(this.auth.uid);
    if (!this.auth.uid) return from(Promise.resolve([])); // return empty array if not logged in

    const q = query(
      this.col,
      where('userId', '==', this.auth.uid),
      orderBy('date', 'desc')
    );

    // if (filters?.endDate) {
    //   console.log('end', Timestamp.fromDate(new Date(filters.endDate)));
    //   q = query(
    //     q,
    //     where('date', '<=', Timestamp.fromDate(new Date(filters.endDate)))
    //   );
    // }
    // if (filters?.startDate) {
    //   console.log(Timestamp.fromDate(new Date(filters.startDate)));
    //   q = query(
    //     q,
    //     where('date', '>=', Timestamp.fromDate(new Date(filters.startDate)))
    //   );
    // }
    console.log(q);

    return from(
      getDocs(q).then((snap) =>
        snap.docs.map((d) => {
          return {
            id: d.id,
            ...d.data(),
          } as Transaction;
        })
      )
    );
  }

  getTransactionWithCategory(searchParam?: TransactionSearchFilter) {
    return resolveRefs(this.getTransactionList(searchParam));
    // return combineLatest([
    //   this.getTransactionList(),
    //   this.categoryService.getCategoryMap(),
    // ]).pipe(
    //   map(([transactions, mappers]) => {
    //     const enriched = transactions.map((data) => {
    //       const category = data.category
    //         ? mappers[(data.category as DocumentReference).path]
    //         : null;

    //       const returnData = {
    //         id: data.id,
    //         ...data,
    //         category, // replaces reference with real category object
    //       } as unknown as Transaction;
    //       return returnData;
    //     });
    //     console.log('enriched', enriched);
    //     return enriched;
    //   })
    // );
  }

  addTransaction(
    transactionType: Omit<Transaction, 'id' | 'userId' | 'createdAt'>
  ): Observable<DocumentReference> {
    if (!this.auth.uid) throw new Error('Not authenticated');
    const payload: Transaction = {
      ...transactionType,
      userId: this.auth.uid,
      createdAt: serverTimestamp(),
    };
    return from(addDoc(this.col, payload).then((docRef) => docRef));
  }
}
