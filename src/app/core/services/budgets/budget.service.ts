import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  CollectionReference,
  doc,
  DocumentData,
  DocumentReference,
  FieldValue,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { from, map, Observable } from 'rxjs';
import { AuthService } from '../../auth/service/auth.service';
import { db } from '../../firebase/firebase';
import { BUDGET_COLLECTION } from '../../tokens/firestore.token';
import { resolveRefs } from '../../utility/resolver';
import { Category } from '../category/category.service';

export interface Budget {
  id?: string;
  categoryId: string;
  category?: Category; // ref to category
  amount: number;
  month: number;
  year: number;
  userId?: string;
  createdAt?: string | FieldValue;
}
@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  getBudgetListData(trigger?: {
    month: number;
    year: number;
  }): Observable<Budget[]> {
    console.log(this.auth.uid);
    const now = new Date(); // client time, just for month/year

    if (!this.auth.uid) return from(Promise.resolve([])); // return empty array if not logged in
    const param = trigger ?? {
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    };
    const q = query(
      this.col,
      where('userId', '==', this.auth.uid),
      where('month', '==', param.month),
      where('year', '==', param.year),
      orderBy('month', 'desc'),
      orderBy('year', 'desc')
    );

    return from(
      getDocs(q).then((snap) =>
        snap.docs.map((d) => {
          return {
            id: d.id,
            ...d.data(),
          } as Budget;
        })
      )
    );
  }
  getBudgetList(trigger: {
    year: number;
    month: number;
  }): Observable<Budget[]> {
    return resolveRefs(this.getBudgetListData(trigger));
  }
  private auth = inject(AuthService);

  private col: CollectionReference = inject(BUDGET_COLLECTION);
  getbudgetMap() {
    const budget$ = from(getDocs(this.col).then((snap) => snap));
    return budget$.pipe(
      map((snap) => {
        const budgetMap: Record<string, Partial<Budget>> = {};

        snap.forEach((doc) => {
          budgetMap[doc.ref.path] = { id: doc.id, ...doc.data() };
        });

        return budgetMap;
      })
    );
  }

  // getbudgetList(): Observable<Budget[]> {
  //   if (!this.auth.uid) return from(Promise.resolve([])); // return empty array if not logged in

  //   const q = query(this.col);

  //   return from(
  //     getDocs(q).then((snap) =>
  //       snap.docs.map((d) => ({ id: d.id, ...d.data() } as Budget))
  //     )
  //   );
  // }

  getbudgetRef(id?: string): DocumentReference<DocumentData, DocumentData> {
    return doc(db, 'budget', id!);
  }

  addbudget(
    budget: Omit<Budget, 'id' | 'userId' | 'createdAt'>
  ): Observable<DocumentReference> {
    if (!this.auth.uid) throw new Error('Not authenticated');
    const payload: Budget = {
      ...budget,
      category: `categories/${budget.categoryId}` as unknown as Category,
      userId: this.auth.uid,
      createdAt: serverTimestamp(),
    };
    return from(addDoc(this.col, payload).then((docRef) => docRef));
  }
}
