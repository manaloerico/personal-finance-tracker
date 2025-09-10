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
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { combineLatest, from, map, Observable } from 'rxjs';
import { AuthService } from '../../auth/service/auth.service';
import { db } from '../../firebase/firebase';
import {
  TransactionType,
  TransactionTypeService,
} from '../transaction-type/transaction-type.service';

export interface Category {
  id?: string;
  categoryName: string;
  color?: string; // optional, for charts
  transactionTypeId?: string; // id of transaction type
  transactionType?:
    | DocumentReference<DocumentData, DocumentData>
    | TransactionType; // ref to transaction type

  userId?: string;
  createdAt?: string | FieldValue;
  date?: number;
}

@Injectable()
export class CategoryService {
  private auth = inject(AuthService);
  private transactionTypeService = inject(TransactionTypeService);

  private col: CollectionReference = collection(db, 'categories');
  categories$ = this.getCategoriesOnce$();

  get uid() {
    return this.auth.uid;
  }
  getCategoryMap() {
    const categorySnap = from(getDocs(collection(db, 'categories')));
    return categorySnap.pipe(
      map((data) => {
        const categoryMap: Record<string, Partial<Category>> = {};
        data.forEach((doc) => {
          categoryMap[doc.ref.path] = { id: doc.id, ...doc.data() };
        });
        return categoryMap;
      })
    );
  }

  getCategoryWithTransactionType() {
    return combineLatest([
      this.categories$,
      this.transactionTypeService.getTransactionTypeMap(),
    ]).pipe(
      map(([categories, txTypes]) => {
        const enriched = categories.map((data) => {
          const transactionType = data.transactionType
            ? txTypes[(data.transactionType as DocumentReference).path]
            : null;

          const returnData = {
            id: data.id,
            ...data,
            transactionType, // replaces reference with real category object
          } as unknown as Category;
          return returnData;
        });
        console.log('enriched', enriched);
        return enriched;
      })
    );
  }
  getCategoriesOnce$() {
    if (!this.auth.uid) return from(Promise.resolve([])); // return empty array if not logged in

    const q = query(
      this.col,
      where('userId', '==', this.auth.uid),
      orderBy('date', 'desc')
    );

    return from(
      getDocs(q).then((snap) =>
        snap.docs.map((d) => ({ id: d.id, ...d.data() } as Category))
      )
    );
  }
  addCategory(
    category: Omit<Category, 'id' | 'userId' | 'createdAt'>
  ): Observable<DocumentReference> {
    if (!this.auth.uid) throw new Error('Not authenticated');
    const payload: Category = {
      ...category,
      date: Date.now(),
      userId: this.auth.uid,
      createdAt: serverTimestamp(),
      transactionType: this.transactionTypeService.getTransactionTypeRef(
        category.transactionTypeId!
      ),
    };
    return from(addDoc(this.col, payload).then((docRef) => docRef));
  }

  // 🔹 Update category
  updateCategory(id: string, data: Partial<Category>): Observable<void> {
    const payload = {
      ...data,
      transactionType: this.transactionTypeService.getTransactionTypeRef(
        data.transactionTypeId!
      ),
    };
    return from(updateDoc(doc(this.col, id), payload));
  }

  // 🔹 Delete category
  deleteCategory(id: string): Observable<void> {
    return from(deleteDoc(doc(this.col, id)));
  }
}
