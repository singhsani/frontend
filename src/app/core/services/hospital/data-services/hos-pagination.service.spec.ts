import { TestBed, inject } from '@angular/core/testing';

import { HosPaginationService } from './hos-pagination.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SessionStorageService } from 'angular-web-storage';

 describe('Service : HosPaginationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HosPaginationService, SessionStorageService]
    });
  });

  it('should be created', inject([HosPaginationService], (service: HosPaginationService) => {
    expect(service).toBeTruthy();
  }));
});
