import { TestBed, inject } from '@angular/core/testing';

import { AnimalPondService } from './animal-pond.service';

describe('AnimalPondService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnimalPondService]
    });
  });

  it('should be created', inject([AnimalPondService], (service: AnimalPondService) => {
    expect(service).toBeTruthy();
  }));
});
