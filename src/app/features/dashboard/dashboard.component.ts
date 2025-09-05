import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { AuthService } from 'src/app/core/auth/service/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
    imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [AuthService]
})
export class DashboardComponent implements OnInit {
  protected auth = inject(AuthService);  
  user$ = this.auth.user$.pipe(tap(user => console.log('User in dashboard:', user)  ));
  
  ngOnInit(): void {
  console.log(this.auth.user());
  }
 logout() {
    this.auth.logout();
  }
}
