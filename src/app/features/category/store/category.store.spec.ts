
import { TestBed, inject } from '@angular/core/testing';
import { CategoryStoreService } from './category.store';

describe('Service: Category.store', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategoryStoreService]
    });
  });

  it('should ...', inject([CategoryStoreService], (service: CategoryStoreService) => {
    expect(service).toBeTruthy();
  }));
});
