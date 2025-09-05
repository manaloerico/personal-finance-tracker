import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { authState } from 'rxfire/auth';
import { map, take } from "rxjs";
import { Auth as FirebaseAuth } from 'firebase/auth';
import { Auth as AngularFireAuth } from '@angular/fire/auth';
type FixedAuth = AngularFireAuth & FirebaseAuth;

export const canActivateAuth: CanActivateFn = () => {
  const auth = inject(AngularFireAuth) as FixedAuth;
  const router = inject(Router);

 return authState(auth).pipe(
    take(1), // wait for the first user state
    map(user => {
      if (user) return true;
      router.navigate(['/auth']);
      return false;
    })
  );

};

export const canActivateUnAuth: CanActivateFn = () => {
  const auth = inject(AngularFireAuth) as FixedAuth;
  const router = inject(Router); 
 return authState(auth).pipe(
    take(1), // wait for the first user state
    map(user => {
      if (!user) return true;
      router.navigate(['/dashboard']);
      return false;
    })
  );
}
