import { TestBed, inject } from '@angular/core/testing';

import { HosUploadFileService } from './hos-upload-file.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SessionStorageService } from 'angular-web-storage';

 describe('Shared Services : HosUploadFileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HosUploadFileService, SessionStorageService],
    });
  });

  it('should be created', inject([HosUploadFileService], (service: HosUploadFileService) => {
    expect(service).toBeTruthy();
  }));
});
