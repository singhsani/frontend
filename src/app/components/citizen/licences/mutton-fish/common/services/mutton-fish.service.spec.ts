import { TestBed, inject } from '@angular/core/testing';

import { MuttonFishService } from './mutton-fish.service';
import { HttpService } from '../../../../../../shared/services/http.service';
import { SessionStorageService } from 'angular-web-storage';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MuttonFishService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MuttonFishService,HttpService, SessionStorageService]
    });
  });

  it('should be created', inject([MuttonFishService], (service: MuttonFishService) => {
    expect(service).toBeTruthy();
  }));
});
