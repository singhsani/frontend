import { TestBed, inject } from '@angular/core/testing';

import { HosFormActionsService } from './hos-form-actions.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SessionStorageService } from 'angular-web-storage';

 describe('Service : HosFormActionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HosFormActionsService, SessionStorageService]
    });
  });

  it('should be created', inject([HosFormActionsService], (service: HosFormActionsService) => {
    expect(service).toBeTruthy();
  }));
});
