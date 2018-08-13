import { TestBed, inject } from '@angular/core/testing';

import { MuttonFishService } from './mutton-fish.service';

describe('MuttonFishService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MuttonFishService]
    });
  });

  it('should be created', inject([MuttonFishService], (service: MuttonFishService) => {
    expect(service).toBeTruthy();
  }));
});
