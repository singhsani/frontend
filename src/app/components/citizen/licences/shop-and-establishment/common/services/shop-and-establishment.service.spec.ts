import { TestBed, inject } from '@angular/core/testing';

import { ShopAndEstablishmentService } from './shop-and-establishment.service';
import { SessionStorageService } from 'angular-web-storage';
import { HttpService } from '../../../../../../shared/services/http.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ShopAndEstablishmentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ShopAndEstablishmentService, HttpService, SessionStorageService]
    });
  });

  it('should be created', inject([ShopAndEstablishmentService], (service: ShopAndEstablishmentService) => {
    expect(service).toBeTruthy();
  }));
});
