import { TestBed, inject } from '@angular/core/testing';

import { HosHttpService } from './hos-http.service';

describe('HosHttpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HosHttpService]
    });
  });

  it('should be created', inject([HosHttpService], (service: HosHttpService) => {
    expect(service).toBeTruthy();
  }));
});
