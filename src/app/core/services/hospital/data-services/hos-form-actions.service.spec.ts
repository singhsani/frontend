import { TestBed, inject } from '@angular/core/testing';

import { HosFormActionsService } from './hos-form-actions.service';

describe('HosFormActionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HosFormActionsService]
    });
  });

  it('should be created', inject([HosFormActionsService], (service: HosFormActionsService) => {
    expect(service).toBeTruthy();
  }));
});
