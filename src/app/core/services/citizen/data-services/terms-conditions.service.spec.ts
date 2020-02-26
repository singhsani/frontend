import { TestBed, inject } from '@angular/core/testing';

import { TermsConditionsService } from './terms-conditions.service';

describe('TermsConditionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TermsConditionsService]
    });
  });

  it('should be created', inject([TermsConditionsService], (service: TermsConditionsService) => {
    expect(service).toBeTruthy();
  }));
});
