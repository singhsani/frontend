import { TestBed, inject } from '@angular/core/testing';

import { HosUploadFileService } from './hos-upload-file.service';

describe('HosUploadFileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HosUploadFileService]
    });
  });

  it('should be created', inject([HosUploadFileService], (service: HosUploadFileService) => {
    expect(service).toBeTruthy();
  }));
});
