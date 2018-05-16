import { TestBed, inject } from '@angular/core/testing';

import { HosAppService } from './hos-app.service';

describe('HosAppService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HosAppService]
    });
  });

  it('should be created', inject([HosAppService], (service: HosAppService) => {
    expect(service).toBeTruthy();
  }));
});
