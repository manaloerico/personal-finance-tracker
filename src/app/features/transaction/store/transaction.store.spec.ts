import { TestBed, inject } from '@angular/core/testing';
import { TransactionStoreService } from './transaction.store';

describe('Service: Transaction', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransactionStoreService],
    });
  });

  it('should ...', inject(
    [TransactionStoreService],
    (service: TransactionStoreService) => {
      expect(service).toBeTruthy();
    }
  ));
});
