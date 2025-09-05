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
import { of } from 'rxjs';
// import { user } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = signal<User | null>(null);
  user$ = of(this.user());
  
  // user$ = user(auth);
  constructor() {
    onAuthStateChanged(auth, (u) =>{
      console.log('Auth state changed:', u);
 this.user.set(u)

    });
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider(); 

    try {
  const result = await signInWithPopup(auth, provider);
  console.log("User:", result.user);
} catch (err) {
  console.error("Login error:", err);
}
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
