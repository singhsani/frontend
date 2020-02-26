import { TestBed, inject } from '@angular/core/testing';

import { ProfessionalTaxService } from './professional-tax.service';

describe('ProfessionalTaxService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfessionalTaxService]
    });
  });

  it('should be created', inject([ProfessionalTaxService], (service: ProfessionalTaxService) => {
    expect(service).toBeTruthy();
  }));
});
