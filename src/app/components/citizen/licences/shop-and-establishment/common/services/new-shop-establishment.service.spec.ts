import { TestBed, inject } from '@angular/core/testing';

import { NewShopEstablishmentService } from './new-shop-establishment.service';

describe('NewShopEstablishmentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewShopEstablishmentService]
    });
  });

  it('should be created', inject([NewShopEstablishmentService], (service: NewShopEstablishmentService) => {
    expect(service).toBeTruthy();
  }));
});
