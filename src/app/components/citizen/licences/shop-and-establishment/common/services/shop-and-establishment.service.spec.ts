import { TestBed, inject } from '@angular/core/testing';

import { ShopAndEstablishmentService } from './shop-and-establishment.service';

describe('ShopAndEstablishmentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShopAndEstablishmentService]
    });
  });

  it('should be created', inject([ShopAndEstablishmentService], (service: ShopAndEstablishmentService) => {
    expect(service).toBeTruthy();
  }));
});
