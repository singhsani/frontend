import { TestBed, inject } from '@angular/core/testing';

import { HosPaginationService } from './hos-pagination.service';

describe('HosPaginationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HosPaginationService]
    });
  });

  it('should be created', inject([HosPaginationService], (service: HosPaginationService) => {
    expect(service).toBeTruthy();
  }));
});
