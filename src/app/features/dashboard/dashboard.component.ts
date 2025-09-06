import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth/service/auth.service';
import { MatCardModule } from '@angular/material/card';
import { TransactionsService } from '../../core/services/transaction.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
    imports: [CommonModule,MatCardModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [AuthService]
})
export class DashboardComponent implements OnInit {
 private tx = inject(TransactionsService);
  totals$ = this.tx.totals$;

  ngOnInit() {
    this.tx.initRealtime(); // start listening
  }
}
