// src/app/core/auth/auth.service.ts
import { Injectable, signal } from '@angular/core'; 
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import { auth } from '../../firebase/firebase';
// import { user } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = signal<User | null>(null);
  
  // user$ = user(auth);
  constructor() {
    onAuthStateChanged(auth, (u) => this.user.set(u));
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }

  async logout() {
    await signOut(auth);
  }

  get uid(): string | null {
    return this.user()?.uid ?? null;
  }

  get isAuthed(): boolean {
    console.log(this.user());
    return !!this.user();
  }
}
