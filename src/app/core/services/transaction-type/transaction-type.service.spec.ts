/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TransactionTypeService } from './transaction-type.service';

describe('Service: TransactionType', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransactionTypeService]
    });
  });

  it('should ...', inject([TransactionTypeService], (service: TransactionTypeService) => {
    expect(service).toBeTruthy();
  }));
});
