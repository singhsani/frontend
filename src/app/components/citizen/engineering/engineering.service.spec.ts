import { TestBed, inject } from '@angular/core/testing';

import { EngineeringService } from './engineering.service';

describe('EngineeringService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EngineeringService]
    });
  });

  it('should be created', inject([EngineeringService], (service: EngineeringService) => {
    expect(service).toBeTruthy();
  }));
});
