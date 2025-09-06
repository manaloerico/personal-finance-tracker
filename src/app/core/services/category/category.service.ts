import { Injectable, inject } from '@angular/core';
import {
  addDoc, collection, CollectionReference, deleteDoc, doc,
  FieldValue,
  getDocs,
  onSnapshot, orderBy, query, serverTimestamp, updateDoc, where,
} from 'firebase/firestore'; 
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../auth/service/auth.service';
import { db } from '../../firebase/firebase';

export interface Category {
  id?: string;
  categoryName: string;
  color?: string; // optional, for charts
    userId?: string;
    createdAt?: string | FieldValue;
    date?:number;
}

@Injectable({ providedIn: 'root' })
export class CategoryService { 
  private auth = inject(AuthService);

  private col: CollectionReference = collection(db,'categories');
  private _categories$ = new BehaviorSubject<Category[]>([]);
  categories$ = this._categories$.asObservable(); 
 
  get uid() {
    return this.auth.uid;
  }

  private unsub: (() => void) | null = null;

  initRealtime() {
    if (!this.auth.uid) return; // not logged in yet
    this.unsubscribe();

    console.log(this.auth.uid);
    const q = query(
      this.col,
      where('userId', '==', this.auth.uid),
      orderBy('date', 'desc')
    );

    this.unsub = onSnapshot(q, (snap) => {
      console.log(snap);
      const data = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() } as Category)
      );
      this._categories$.next(data);
    });
  }

  async getCategorysOnce() {
    if (!this.auth.uid) return; // not logged in yet
    const q = query(
      this.col,
      where('userId', '==', this.auth.uid),
      orderBy('date', 'desc')
    );
    const snap = await getDocs(q);
    const data = snap.docs.map(
      (d) => ({ id: d.id, ...d.data() } as Category)
    );
    return data;
  }

  unsubscribe() {
    if (this.unsub) {
      this.unsub();
      this.unsub = null;
    }
  }
  async addCategory(category:  Omit<Category, 'id'|'userId'|'createdAt'>) {
    if (!this.auth.uid) throw new Error('Not authenticated');
       const payload: Category = { ...category,date:Date.now(), userId: this.auth.uid, createdAt: serverTimestamp() };
       await addDoc(this.col, payload);
  }

  // 🔹 Update category
  async updateCategory(id: string, data: Partial<Category>) {
    
    
      await updateDoc(doc(this.col, id), data);
  }

  // 🔹 Delete category
  async deleteCategory(id: string) {
     await deleteDoc(doc(this.col, id));
  }
}
