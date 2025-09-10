import { TestBed, inject } from '@angular/core/testing';
import { BudgetStoreService } from './budget.store';

describe('Service: Budget', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BudgetStoreService],
    });
  });

  it('should ...', inject(
    [BudgetStoreService],
    (service: BudgetStoreService) => {
      expect(service).toBeTruthy();
    }
  ));
});
