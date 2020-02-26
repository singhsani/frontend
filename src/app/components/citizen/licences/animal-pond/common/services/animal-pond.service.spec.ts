import { TestBed, inject } from '@angular/core/testing';

import { AnimalPondService } from './animal-pond.service';
import { HttpService } from '../../../../../../shared/services/http.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SessionStorageService } from 'angular-web-storage';

describe('Service : AnimalPondService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AnimalPondService, SessionStorageService, HttpService]
    });
  });

  it('should be created', inject([AnimalPondService], (service: AnimalPondService) => {
    expect(service).toBeTruthy();
  }));
});
