import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { of } from 'rxjs';
import { AuthService } from 'src/app/core/auth/service/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
    imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [AuthService]
})
export class DashboardComponent {
  protected auth = inject(AuthService); 
  user$ = of(this.auth.user());
 logout() {
    this.auth.logout();
  }
}
