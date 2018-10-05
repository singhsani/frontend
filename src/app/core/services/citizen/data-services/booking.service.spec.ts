import { TestBed, inject } from '@angular/core/testing';

import { BookingService } from './booking.service';
import { HttpService } from '../../../../shared/services/http.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SessionStorageService } from 'angular-web-storage';
import { CommonService } from '../../../../shared/services/common.service';

 describe('Service : BookingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BookingService, 
        CommonService, 
        HttpService, 
        SessionStorageService]
    });
  });

  it('should be created', inject([BookingService], (service: BookingService) => {
    expect(service).toBeTruthy();
  }));
});
