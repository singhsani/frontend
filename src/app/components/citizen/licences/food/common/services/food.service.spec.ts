import { TestBed, inject } from '@angular/core/testing';

import { FoodService } from './food.service';
import { SessionStorageService } from 'angular-web-storage';
import { HttpService } from '../../../../../../shared/services/http.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FoodService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FoodService, HttpService, SessionStorageService]
    });
  });

  it('should be created', inject([FoodService], (service: FoodService) => {
    expect(service).toBeTruthy();
  }));
});
