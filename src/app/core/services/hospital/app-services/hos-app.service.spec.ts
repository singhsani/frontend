import { TestBed, inject } from '@angular/core/testing';

import { HosAppService } from './hos-app.service';
import { RouterTestingModule } from '@angular/router/testing';
import { SessionStorageService } from 'angular-web-storage';
import { HttpClientTestingModule } from '@angular/common/http/testing';

 describe('Service : HosAppService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [HosAppService, SessionStorageService]
    });
  });

  it('should be created', inject([HosAppService], (service: HosAppService) => {
    expect(service).toBeTruthy();
  }));
});
