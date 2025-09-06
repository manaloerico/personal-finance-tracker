// src/app/features/transactions/data/transactions.service.ts
import { Injectable, inject } from '@angular/core'; 
import {
  addDoc, collection, CollectionReference, deleteDoc, doc,
  DocumentData,
  DocumentReference,
  FieldValue,
  onSnapshot, orderBy, query, serverTimestamp, updateDoc, where
} from 'firebase/firestore'; 
import { BehaviorSubject, map } from 'rxjs';
import { AuthService } from '../auth/service/auth.service';
import { db } from '../firebase/firebase';
import { CategoryService } from './category/category.service';

export type TxType = 'income' | 'expense';
export interface Transaction {
  id?: string;
  amount: number;      // positive
  type: TxType;        // income | expense
  categoryId?: string; // id of category
  category: DocumentReference<DocumentData, DocumentData> | string; // ref to category
  date: number;        // epoch ms
  note?: string;
  userId?: string;
  createdAt?: string | FieldValue;
}

@Injectable({ providedIn: 'root' })
export class TransactionsService {
  private auth = inject(AuthService);
  private col: CollectionReference = collection(db, 'transactions');
  private _transactions$ = new BehaviorSubject<Transaction[]>([]);
  transactions$ = this._transactions$.asObservable(); 
  protected categoryService = inject(CategoryService);  
  categories$ = this.categoryService.categories$; 
  totals$ = this.transactions$.pipe(
    map(list => {
      const income = list.filter(t => t.type === 'income').reduce((s,t)=>s+t.amount,0);
      const expenses = list.filter(t => t.type === 'expense').reduce((s,t)=>s+t.amount,0);
      return { income, expenses, balance: income - expenses };
    })
  );

  constructor() {
    this.categoryService.initRealtime()
  }
  private unsub: (() => void) | null = null;


  getCategoryRef(id?: string):DocumentReference<DocumentData, DocumentData> {
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
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Transaction));
      this._transactions$.next(data);
    });
  }
categoryList(){
  return this.categoryService.getCategorysOnce();
}
  unsubscribe() {
    if (this.unsub) { this.unsub(); this.unsub = null; }
  }

  async add(tx: Omit<Transaction, 'id'|'userId'|'createdAt'>) {
    if (!this.auth.uid) throw new Error('Not authenticated');
    const payload: Omit<Transaction,'categoryId'> = { ...tx, category:this.getCategoryRef(tx.categoryId),userId: this.auth.uid, createdAt: serverTimestamp() };
    console.log("payload",payload);
    try{
    await addDoc(this.col, payload);}
    catch(err){
      console.error("Error adding document: ", err);
    }
  }

  async update(id: string, patch: Partial<Transaction>) {
    await updateDoc(doc(this.col, id), patch);
  }

  async remove(id: string) {
    await deleteDoc(doc(this.col, id));
  }
}
