import { TestBed, inject } from '@angular/core/testing';

import { HosHttpService } from './hos-http.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SessionStorageService } from 'angular-web-storage';

 describe('Shared Services : HosHttpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HosHttpService, SessionStorageService]
    });
  });

  it('should be created', inject([HosHttpService], (service: HosHttpService) => {
    expect(service).toBeTruthy();
  }));
});
