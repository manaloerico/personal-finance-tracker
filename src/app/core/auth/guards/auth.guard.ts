import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../service/auth.service";

export const canActivateAuth: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  console.log(auth);
  console.log(auth.isAuthed);
  if (auth.isAuthed){
return true;
  } 
  router.navigateByUrl('/auth');
  return false;
};