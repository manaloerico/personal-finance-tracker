import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../service/auth.service';

@Component({
    selector: 'app-login-page',
    imports: [CommonModule],
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent  {
 private auth = inject(AuthService);
  login() { this.auth.loginWithGoogle(); }
}
