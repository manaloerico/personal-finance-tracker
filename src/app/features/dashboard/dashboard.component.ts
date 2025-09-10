import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from 'src/app/core/auth/service/auth.service';
import { TransactionsService } from '../../core/services/transaction.service';
@Component({
    selector: 'app-dashboard',
    imports: [CommonModule, MatCardModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    providers: [AuthService]
})
export class DashboardComponent implements OnInit {
  private tx = inject(TransactionsService);

  ngOnInit() {
    this.tx.initRealtime(); // start listening
  }
}
