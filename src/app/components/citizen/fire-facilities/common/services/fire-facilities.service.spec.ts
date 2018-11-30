import { TestBed, inject } from '@angular/core/testing';

import { FireFacilitiesService } from './fire-facilities.service';

describe('FireFacilitiesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FireFacilitiesService]
    });
  });

  it('should be created', inject([FireFacilitiesService], (service: FireFacilitiesService) => {
    expect(service).toBeTruthy();
  }));
});
