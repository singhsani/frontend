import { TestBed, inject } from '@angular/core/testing';

import { TranslateService } from './translate.service';
import { SessionStorageService } from 'angular-web-storage';
import { HttpService } from '../../services/http.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

 describe('Shared Services : TranslateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TranslateService,HttpService, SessionStorageService]
    });
  });

  it('should be created', inject([TranslateService], (service: TranslateService) => {
    expect(service).toBeTruthy();
  }));
});
