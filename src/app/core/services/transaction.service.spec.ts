

import { TestBed, inject } from '@angular/core/testing';
import { TransactionsService } from './transaction.service';

describe('Service: Transaction', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransactionsService]
    });
  });

  it('should ...', inject([TransactionsService], (service: TransactionsService) => {
    expect(service).toBeTruthy();
  }));
});
