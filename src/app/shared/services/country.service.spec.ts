import { TestBed, inject } from '@angular/core/testing';

import { CountryService } from './country.service';
import { HttpService } from './http.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsActionsService } from '../../core/services/citizen/data-services/forms-actions.service';
import { SessionStorageService } from 'angular-web-storage';

 describe('Shared Services : CountryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CountryService, FormsActionsService, SessionStorageService, HttpService]
    });
  });

  it('should be created', inject([CountryService], (service: CountryService) => {
    expect(service).toBeTruthy();
  }));
});
