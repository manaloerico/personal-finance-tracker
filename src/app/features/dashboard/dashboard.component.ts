import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
ngOnInit(): void {
  console.log('DashboardComponent initialized');
}
}
